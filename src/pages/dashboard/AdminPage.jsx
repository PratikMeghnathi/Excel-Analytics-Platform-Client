import { useEffect, useState } from "react"
import { useImmer } from "use-immer"
import { useTheme } from "@/hooks"
import { useLoaderData, useNavigation } from "react-router-dom"
import {
  ERROR_TOAST_OPTIONS, showGenericErrorAsToast, SUCCESS_TOAST_OPTIONS,
  BarChart3, Upload, Users, Edit, ChevronDown, ChevronUp, Clock, Activity, FileBarChart
} from "@/utils"
import toast from "react-hot-toast"
import { updateUser } from "@/api"
import { Spinner1 } from "@/components"

const UserEditModal = ({ user, isOpen, onClose, onSave, isUserUpdating }) => {
  const [editUser, updateEditUser] = useImmer({
    id: user?.id || "",
    permissions: user?.permissions || "Read Only",
    uploadLimit: user?.uploadLimit || "",
    analysisLimit: user?.analysisLimit || "",
    isUploadUnrestricted: user?.uploadLimit === "unrestricted" || user?.uploadLimit === -1,
    isAnalysisUnrestricted: user?.analysisLimit === "unrestricted" || user?.analysisLimit === -1,
    analyses: user?.analyses || "",
    uploads: user?.uploads || "",
  })

  useEffect(() => {
    if (user) {
      updateEditUser((draft) => {
        draft.id = user.id || "";
        draft.permissions = user.permissions || "Read Only";
        draft.uploadLimit = user.uploadLimit === "unrestricted" || user.uploadLimit === -1 ? "" : user.uploadLimit || "";
        draft.analysisLimit = user.analysisLimit === "unrestricted" || user.analysisLimit === -1 ? "" : user.analysisLimit || "";
        draft.isUploadUnrestricted = user.uploadLimit === "unrestricted" || user.uploadLimit === -1;
        draft.isAnalysisUnrestricted = user.analysisLimit === "unrestricted" || user.analysisLimit === -1;
        draft.analyses = user?.analyses || 0;
        draft.uploads = user?.uploads || 0;
      })
    }
  }, [user, updateEditUser])

  if (!isOpen || !user) return null

  const handleSave = () => {
    const dataToSave = {
      ...editUser,
      uploadLimit: editUser.isUploadUnrestricted ? -1 : Number.parseInt(editUser.uploadLimit) || 0,
      analysisLimit: editUser.isAnalysisUnrestricted ? -1 : Number.parseInt(editUser.analysisLimit) || 0,
    }

    // Remove the checkbox states from the saved data
    delete dataToSave.isUploadUnrestricted
    delete dataToSave.isAnalysisUnrestricted
    delete dataToSave.analyses
    delete dataToSave.uploads

    onSave(dataToSave)
  }

  const handleUploadLimitToggle = (isUnrestricted) => {
    updateEditUser((draft) => {
      draft.isUploadUnrestricted = isUnrestricted
      if (isUnrestricted) {
        draft.uploadLimit = ""
      }
    })
  }

  const handleAnalysisLimitToggle = (isUnrestricted) => {
    updateEditUser((draft) => {
      draft.isAnalysisUnrestricted = isUnrestricted
      if (isUnrestricted) {
        draft.analysisLimit = ""
      }
    })
  }

  const validateNumberInput = (value) => {
    // Allow empty string, or positive integers only
    return value === "" || (/^\d+$/.test(value) && Number.parseInt(value) >= 0)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
      <div className="bg-card rounded-md shadow-md p-4 sm:p-6 w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4 text-muted-foreground">
          Edit User: <span className="break-all">{user.username}</span>
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-sm text-muted-foreground">Permissions</label>
            <select
              className="w-full p-2 sm:p-3 rounded border bg-muted border-primary/10  text-sm focus:outline-none"
              value={editUser.permissions}
              onChange={(e) =>
                updateEditUser((draft) => {
                  draft.permissions = e.target.value
                })
              }
              disabled={isUserUpdating}
            >
              <option className="bg-secondary text-secondary-foreground text-sm" value="Full Access">Full Access</option>
              <option className="bg-secondary text-secondary-foreground text-sm" value="Read Only">Read Only</option>
            </select>
          </div>

          {/* Upload Limit Section */}
          <div>
            <label className="block mb-2 font-medium text-sm text-muted-foreground">Upload Limit</label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="upload-unrestricted"
                  name="uploadLimitType"
                  checked={editUser.isUploadUnrestricted}
                  onChange={() => handleUploadLimitToggle(true)}
                  className="cursor-pointer accent-muted-foreground"
                  disabled={isUserUpdating}
                />
                <label htmlFor="upload-unrestricted" className="text-sm text-muted-foreground">
                  Unlimited uploads
                </label>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="upload-limited"
                    name="uploadLimitType"
                    checked={!editUser.isUploadUnrestricted}
                    onChange={() => handleUploadLimitToggle(false)}
                    className="cursor-pointer accent-muted-foreground"
                    disabled={isUserUpdating}
                  />
                  <label htmlFor="upload-limited" className="text-sm text-muted-foreground whitespace-nowrap">
                    Set specific limit:
                  </label>
                </div>
                <input
                  type="number"
                  value={editUser.uploadLimit}
                  onChange={(e) => {
                    if (validateNumberInput(e.target.value)) {
                      updateEditUser((draft) => {
                        draft.uploadLimit = e.target.value
                        draft.isUploadUnrestricted = false
                      })
                    }
                  }}
                  disabled={editUser.isUploadUnrestricted || isUserUpdating}
                  placeholder="Enter number"
                  className="w-full sm:flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-primary bg-card text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  min={editUser.uploads}
                />
              </div>
            </div>
          </div>

          {/* Analysis Limit Section */}
          <div>
            <label className="block mb-2 font-medium text-sm text-muted-foreground">Analysis Save Limit</label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="analysis-unrestricted"
                  name="analysisLimitType"
                  checked={editUser.isAnalysisUnrestricted}
                  onChange={() => handleAnalysisLimitToggle(true)}
                  className="cursor-pointer accent-muted-foreground"
                  disabled={isUserUpdating}
                />
                <label htmlFor="analysis-unrestricted" className="text-sm text-muted-foreground">
                  Unlimited saved analyses
                </label>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="analysis-limited"
                    name="analysisLimitType"
                    checked={!editUser.isAnalysisUnrestricted}
                    onChange={() => handleAnalysisLimitToggle(false)}
                    className="cursor-pointer accent-muted-foreground"
                    disabled={isUserUpdating}
                  />
                  <label htmlFor="analysis-limited" className="text-sm text-muted-foreground whitespace-nowrap">
                    Set specific limit:
                  </label>
                </div>
                <input
                  type="number"
                  value={editUser.analysisLimit}
                  onChange={(e) => {
                    if (validateNumberInput(e.target.value)) {
                      updateEditUser((draft) => {
                        draft.analysisLimit = e.target.value
                        draft.isAnalysisUnrestricted = false
                      })
                    }
                  }}
                  disabled={editUser.isAnalysisUnrestricted || isUserUpdating}
                  placeholder="Enter number"
                  className="w-full sm:flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-primary bg-card text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  min={editUser.analyses}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preview of current settings */}
        <div className="mt-4 p-3 bg-muted/30 rounded text-sm">
          <div className="font-medium text-muted-foreground mb-1">Current Settings:</div>
          <div className="text-muted-foreground">
            • Upload Limit: {editUser.isUploadUnrestricted ? "Unrestricted" : editUser.uploadLimit || "0"}
          </div>
          <div className="text-muted-foreground">
            • Analysis Limit: {editUser.isAnalysisUnrestricted ? "Unrestricted" : editUser.analysisLimit || "0"}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={handleSave}
            disabled={isUserUpdating}
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition text-sm"
          >
            {isUserUpdating ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={onClose}
            disabled={isUserUpdating}
            className="flex-1 px-4 py-2 bg-muted text-muted-foreground rounded hover:bg-muted/80 transition text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

const UserCard = ({ user, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  // Format the limit display
  const formatLimit = (limit) => {
    if (limit === -1) return "Unlimited"
    return limit
  }

  return (
    <div className="border rounded-lg p-4 bg-card">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-primary truncate">{user.username}</h3>
          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <span
            className={`text-xs px-2 py-1 rounded whitespace-nowrap ${user.isActive
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
              }`}
          >
            {user.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Permissions:</span>
          <span className="font-medium">{user.permissions}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total Uploads:</span>
          <span className="font-medium">{user.uploads}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total Analyses:</span>
          <span className="font-medium">{user.analyses}</span>
        </div>

        {isExpanded && (
          <div className="pt-2 border-t space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Recent Uploads:</span>
              <span className="font-medium">{user.recentUploads}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Recent Analyses:</span>
              <span className="font-medium">{user.recentAnalyses}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Upload Limit:</span>
              <span className="font-medium">{formatLimit(user.uploadLimit)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Analysis Limit:</span>
              <span className="font-medium">{formatLimit(user.analysisLimit)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-muted-foreground hover:text-primary transition flex items-center gap-1"
        >
          {isExpanded ? (
            <>
              Less <ChevronUp className="h-3 w-3" />
            </>
          ) : (
            <>
              More <ChevronDown className="h-3 w-3" />
            </>
          )}
        </button>
        <button
          onClick={() => onEdit(user)}
          className="px-3 py-1.5 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition flex items-center gap-1"
        >
          <Edit className="h-3 w-3" />
          Edit
        </button>
      </div>
    </div>
  )
}

const AdminPage = () => {
  const { isDarkMode } = useTheme()
  const response = useLoaderData()
  const navigation = useNavigation()

  // Check if page is currently loading (during navigation)
  const isLoading = navigation.state === "loading"

  // Show errors as toast notifications
  useEffect(() => {
    if (!response.success && response?.genericErrors) {
      showGenericErrorAsToast(response.genericErrors)
    }
  }, [response])

  const [selectedUser, setSelectedUser] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [users, updateUsers] = useImmer([])
  const [stats, updateStats] = useImmer({
    totalUsers: 0,
    totalUploads: 0,
    savedAnalyses: 0,
  })
  const [analyticsStats, updateAnalyticsStats] = useImmer({
    uploadFrequency: 0,
    peakUploadTime: "",
    peakUploadCount: 0,
    usageRate: 0,
    totalRecentUploads: 0,
    totalUploadsAllTime: 0,
  })
  const [isUserUpdating, setIsUserUpdating] = useState(false)

  useEffect(() => {
    if (!response?.data) {
      toast.error("No data in response", ERROR_TOAST_OPTIONS)
      return
    }
    const { basicStats, userStats, analyticsStats } = response.data

    if (basicStats) {
      updateStats((draft) => {
        draft.totalUsers = basicStats.totalUsers || 0
        draft.totalUploads = basicStats.totalUploads || 0
        draft.savedAnalyses = basicStats.savedAnalyses || 0
      })
    }

    if (userStats && Array.isArray(userStats)) {
      const processedUsers = userStats.map((user) => ({
        id: user._id,
        name: user.name,
        username: user.name,
        email:
          user.email ||
          (user.name ? `${user.name.toLowerCase().replace(/\s+/g, ".")}@company.com` : "unknown@company.com"),
        permissions: user.permissions || "Read Only",
        status: user.status || "Active",

        uploads: user.activity?.uploads || 0,
        analyses: user.activity?.savedAnalyses || 0,

        recentUploads: user.activity?.recentActivity?.uploads || 0,
        recentAnalyses: user.activity?.recentActivity?.analyses || 0,

        uploadLimit: user.uploadLimit,
        analysisLimit: user.analysisLimit,

        activity: user.activity || {},
        isActive:
          user.isActive ||
          Boolean(
            user.activity &&
            (user.activity?.recentActivity?.uploads > 0 || user.activity?.recentActivity?.analyses > 0),
          ),
        lastActivity: user.lastActivity ? new Date(user.lastActivity).toLocaleDateString() : "N/A",
      }))
      updateUsers(processedUsers)
    }

    if (analyticsStats) {
      updateAnalyticsStats((draft) => {
        draft.uploadFrequency = analyticsStats.uploadFrequency || 0
        draft.peakUploadTime = analyticsStats.peakUploadTime || "N/A"
        draft.peakUploadCount = analyticsStats.peakUploadCount || 0
        draft.usageRate = analyticsStats.usageRate || 0
        draft.totalRecentUploads = analyticsStats.totalRecentUploads || 0
        draft.totalUploadsAllTime = analyticsStats.totalUploadsAllTime || 0
      })
    }
  }, [response, updateStats, updateUsers, updateAnalyticsStats])

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setIsEditModalOpen(true)
  }

  const handleUpdateUser = async (updatedUser) => {
    setIsUserUpdating(true)
    try {
      const { success, genericErrors } = await updateUser(updatedUser)

      if (success) {
        updateUsers((draft) => {
          const index = draft.findIndex((user) => user.id === selectedUser.id)
          if (index !== -1) {
            draft[index] = { ...draft[index], ...updatedUser }
          }
        })
        toast.success("User updated successfully", SUCCESS_TOAST_OPTIONS)
        setIsEditModalOpen(false)
        return
      }

      showGenericErrorAsToast(genericErrors)
    } catch (error) {
      console.error(error)
      toast.error("Failed to update user", ERROR_TOAST_OPTIONS)
    } finally {
      setIsUserUpdating(false)
    }
  }

  const handleExportReport = () => {
    const timestamp = new Date().toISOString().split("T")[0]

    // Essential System Stats
    const systemStats = [
      "SYSTEM OVERVIEW",
      `Report Date,${new Date().toLocaleDateString()}`,
      `Total Users,${stats.totalUsers}`,
      `Active Users,${computedStats.activeUsers}`,
      `Total Uploads,${stats.totalUploads}`,
      `Total Analyses,${stats.savedAnalyses}`,
      "",
      "USER DETAILS",
      "Name,Email,Permissions,Uploads,Analyses,Status,Last Activity",
    ]

    // User data - essential columns only
    const userData = users.map((user) =>
      [
        user.name,
        user.email,
        user.permissions,
        user.uploads,
        user.analyses,
        user.isActive ? "Active" : "Inactive",
        user.lastActivity,
      ].join(","),
    )

    // Permission breakdown
    const permissionBreakdown = ["", "PERMISSION SUMMARY", "Permission,Count"]

    const permissionCounts = users.reduce((acc, user) => {
      acc[user.permissions] = (acc[user.permissions] || 0) + 1
      return acc
    }, {})

    Object.entries(permissionCounts).forEach(([permission, count]) => {
      permissionBreakdown.push(`${permission},${count}`)
    })

    // Analytics data
    const analyticsData = [
      "",
      "ANALYTICS DATA",
      `Upload Frequency,${analyticsStats.uploadFrequency}`,
      `Peak Upload Time,${analyticsStats.peakUploadTime}`,
      `Peak Upload Count,${analyticsStats.peakUploadCount}`,
      `Usage Rate,${analyticsStats.usageRate}%`,
      `Recent Uploads,${analyticsStats.totalRecentUploads}`,
      `Total Uploads,${analyticsStats.totalUploadsAllTime}`,
    ]

    // Combine everything
    const csvContent = [...systemStats, ...userData, ...permissionBreakdown, ...analyticsData].join("\n")

    // Download
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `usage-report-${timestamp}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    toast.success("Usage report exported", SUCCESS_TOAST_OPTIONS)
  }

  // Format the limit display
  const formatLimit = (limit) => {
    if (limit === -1) return "Unlimited"
    return limit
  }

  // Computed stats from actual user data
  const computedStats = {
    activeUsers: users.filter((user) => user.isActive).length,
    totalUserUploads: users.reduce((sum, user) => sum + user.uploads, 0),
    totalUserAnalyses: users.reduce((sum, user) => sum + user.analyses, 0),
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner1 className="w-8 h-8 border-3 border-loading-spinner-color" />
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-muted-foreground mb-3 sm:mb-4">Admin Control Panel</h2>

      {/* System Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="p-4 sm:p-6 bg-card rounded-md shadow-md flex flex-col items-center justify-center">
          <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary mb-2" />
          <h3 className="text-base sm:text-lg font-semibold text-muted-foreground text-center">Total Users</h3>
          <p className="text-xl sm:text-2xl font-bold text-primary">{stats.totalUsers}</p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">{computedStats.activeUsers} active</p>
        </div>
        <div className="p-4 sm:p-6 bg-card rounded-md shadow-md flex flex-col items-center justify-center">
          <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-primary mb-2" />
          <h3 className="text-base sm:text-lg font-semibold text-muted-foreground text-center">Total Uploads</h3>
          <p className="text-xl sm:text-2xl font-bold text-primary">{stats.totalUploads}</p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">across all users</p>
        </div>
        <div className="p-4 sm:p-6 bg-card rounded-md shadow-md flex flex-col items-center justify-center sm:col-span-2 lg:col-span-1">
          <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-primary mb-2" />
          <h3 className="text-base sm:text-lg font-semibold text-muted-foreground text-center">Saved Analyses</h3>
          <p className="text-xl sm:text-2xl font-bold text-primary">{stats.savedAnalyses}</p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">total saved</p>
        </div>
      </div>

      {/* User Management Section */}
      <div className="bg-card rounded-md shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-primary">User Management</h2>
        {users.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No users found</div>
        ) : (
          <>
            {/* Desktop Table - Hidden on small screens */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 pl-2 font-semibold text-left text-muted-foreground">Name</th>
                    <th className="py-3 font-semibold text-left text-muted-foreground">Permissions</th>
                    <th className="py-3 font-semibold text-left text-muted-foreground">Total Activity</th>
                    <th className="py-3 font-semibold text-left text-muted-foreground">Recent Activity</th>
                    <th className="py-3 font-semibold text-left text-muted-foreground">Limits</th>
                    <th className="py-3 font-semibold text-left text-muted-foreground">Status</th>
                    <th className="py-3 font-semibold text-left text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/50 transition">
                      <td className="py-3 pl-2">
                        <div>
                          <div className="font-medium text-primary">{user.username}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="text-sm text-muted-foreground">{user.permissions}</span>
                      </td>
                      <td className="py-3">
                        <div className="text-sm">
                          <div className="text-primary">{user.uploads} uploads</div>
                          <div className="text-muted-foreground">{user.analyses} analyses</div>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="text-sm">
                          <div className="text-primary">{user.recentUploads} uploads</div>
                          <div className="text-muted-foreground">{user.recentAnalyses} analyses</div>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="text-sm">
                          <div className="text-primary">Uploads: {formatLimit(user.uploadLimit)}</div>
                          <div className="text-muted-foreground">Analyses: {formatLimit(user.analysisLimit)}</div>
                        </div>
                      </td>
                      <td className="py-3">
                        <span
                          className={`text-sm px-2 py-1 rounded ${user.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                            }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="px-3 py-1.5 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet Card View - Shown on smaller screens */}
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
              {users.map((user) => (
                <UserCard key={user.id} user={user} onEdit={handleEditUser} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Analytics & Reporting Section */}
      <div className="bg-card rounded-md shadow-md p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-primary">Analytics & Reporting</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <div className="p-3 sm:p-4 border rounded">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-muted-foreground text-sm sm:text-base">Upload Frequency</h3>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-primary">{analyticsStats.uploadFrequency}</p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">avg per user</p>
          </div>
          <div className="p-3 sm:p-4 border rounded">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-muted-foreground text-sm sm:text-base">Peak Upload Time</h3>
            </div>
            <p className="text-lg sm:text-xl font-bold text-primary">{analyticsStats.peakUploadTime}</p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">{analyticsStats.peakUploadCount} uploads</p>
          </div>
          <div className="p-3 sm:p-4 border rounded">
            <div className="flex items-center gap-2 mb-2">
              <FileBarChart className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-muted-foreground text-sm sm:text-base">Usage Rate</h3>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-primary">{analyticsStats.usageRate}%</p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">active users</p>
          </div>
        </div>

        {/* Additional Analytics */}
        <div className="bg-muted/30 p-4 rounded-md mb-6">
          <h3 className="text-sm font-medium mb-3">Upload Statistics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Recent Uploads:</span>
              <span className="text-sm font-medium">{analyticsStats.totalRecentUploads}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Uploads (All Time):</span>
              <span className="text-sm font-medium">{analyticsStats.totalUploadsAllTime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Active Users:</span>
              <span className="text-sm font-medium">
                {computedStats.activeUsers} of {stats.totalUsers}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Last Updated:</span>
              <span className="text-sm font-medium">
                {response.data.timestamp ? new Date(response.data.timestamp).toLocaleString() : "N/A"}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleExportReport}
          className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition text-sm sm:text-base"
        >
          Export Usage Report
        </button>
      </div>

      {/* Edit User Modal */}
      <UserEditModal
        user={selectedUser}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdateUser}
        isUserUpdating={isUserUpdating}
      />
    </div>
  )
}

export default AdminPage
