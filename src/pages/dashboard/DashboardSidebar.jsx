import { signout, deleteMyAccount } from "@/api"
import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    ThemeToggle,
    useSidebar,
} from "@/components"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context"
import {
    ClockCounterClockwise,
    ERROR_TOAST_OPTIONS,
    Graph,
    LayoutDashboard,
    PATHS,
    showGenericErrorAsToast,
    SUCCESS_TOAST_OPTIONS,
    TOAST_OPTIONS,
    Upload,
} from "@/utils"
import { LogOut, ShieldIcon, Trash2, AlertTriangle } from "lucide-react"
import { useState, useMemo } from "react"
import toast from "react-hot-toast"
import { Link, useLocation, useNavigate } from "react-router-dom"

function DashboardSidebar() {
    const allMenuItems = [
        { title: "Dashboard", icon: LayoutDashboard, url: PATHS.DASHBOARD },
        { title: "Upload & Analyze Data", icon: Upload, url: PATHS.FILE_UPLOAD },
        { title: "Analysis History", icon: ClockCounterClockwise, url: PATHS.ANALYSIS_HISTORY },
        { title: "Admin panel", icon: ShieldIcon, url: PATHS.ADMIN_PANEL, requiredRoles: ["admin"] },
    ]

    const { setOpenMobile } = useSidebar()
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deletePassword, setDeletePassword] = useState("")
    const [isDeletingAccount, setIsDeletingAccount] = useState(false)

    // Filter menu items based on user roles
    const menuItems = useMemo(() => {
        return allMenuItems.filter((item) => {
            // If item doesn't require specific roles, show it to everyone
            if (!item.requiredRoles) return true

            // If user doesn't have roles, hide items that require roles
            if (!user?.role) return false

            // Check if user has any of the required roles
            return item.requiredRoles.some((role) => user.role.includes(role))
        })
    }, [user?.roles])

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true)

            const { success, genericErrors } = await signout()
            if (success) {
                logout()
                toast.success("You've been logged out successfully.", SUCCESS_TOAST_OPTIONS)
                navigate(PATHS.SIGNIN, { replace: true })
                return
            }

            showGenericErrorAsToast(genericErrors)
        } catch (error) {
            console.error("Logout error:", error)
            toast.error("Something went wrong. Please try again.", ERROR_TOAST_OPTIONS)
        } finally {
            setIsLoggingOut(false)
        }
    }

    const handleDeleteAccount = async () => {
        if (!deletePassword.trim()) {
            toast.error("Please enter your password to confirm account deletion.", ERROR_TOAST_OPTIONS)
            return
        }

        try {
            setIsDeletingAccount(true)

            const { success, fieldErrors, genericErrors } = await deleteMyAccount({ password: deletePassword })

            if (success) {
                toast.success("Your account has been permanently deleted.", SUCCESS_TOAST_OPTIONS)
                logout()
                navigate(PATHS.SIGNIN, { replace: true })
                setShowDeleteModal(false)
                return
            }

            // Handle field errors
            if (fieldErrors?.password) {
                toast.error(fieldErrors.password, ERROR_TOAST_OPTIONS)
                return
            }

            showGenericErrorAsToast(genericErrors)
        } catch (error) {
            console.error("Delete account error:", error)
            toast.error("Failed to delete account. Please try again.", ERROR_TOAST_OPTIONS)
        } finally {
            setIsDeletingAccount(false)
            setDeletePassword("")
        }
    }

    const handleDeleteModalClose = () => {
        setShowDeleteModal(false)
        setDeletePassword("")
    }

    return (
        <>
            <Sidebar className="text-lg md:text-md w-64 max-h-screen overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-hide">
                <SidebarContent className="pt-6 px-4 space-y-4">
                    <div className="flex items-center gap-2 text-muted-foreground font-semibold text-base">
                        <Graph className="w-6 h-6" />
                        <span>Excel Analytics</span>
                    </div>

                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1">
                            {menuItems.map((item) => {
                                const itemPath = item.url.startsWith("/") ? item.url : `/dashboard/${item.url}`
                                const isActive = location.pathname === itemPath

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link
                                                to={isActive ? "#" : item.url}
                                                onClick={(e) => {
                                                    if (isActive) {
                                                        e.preventDefault()
                                                        return
                                                    }
                                                    setOpenMobile(false)
                                                }}
                                                className={`flex items-center gap-3 px-2 py-1 rounded-md transition ${isActive
                                                    ? "bg-muted text-primary font-semibold pointer-events-none"
                                                    : "hover:bg-muted text-foreground"
                                                    }`}
                                            >
                                                <item.icon className="w-5 h-5 text-primary" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarContent>

                <SidebarFooter className="px-4 py-3 border-t border-border">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="w-full justify-start space-x-3">
                                {/* Avatar */}
                                <div className="h-8 w-8 rounded-full bg-primary-foreground flex items-center justify-center text-primary font-semibold">
                                    {(user?.username?.[0] ?? "U").toUpperCase()}
                                </div>
                                {/* Name & Email */}
                                <div className="flex-1 flex flex-col min-w-0 text-start">
                                    <span className="text-sm font-medium truncate">{user?.username ?? "User"}</span>
                                    <span className="text-xs text-muted-foreground truncate">{user?.email ?? "email@example.com"}</span>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="start" side="top" className="w-56">
                            {/* Header with Role Badge */}
                            <div className="px-4 py-2 flex items-center justify-between">
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-medium truncate">{user?.username ?? "User"}</span>
                                    <span className="text-xs text-muted-foreground truncate">{user?.email ?? "email@example.com"}</span>
                                </div>
                                {user?.role && (
                                    <Badge variant="secondary" className="text-xs">
                                        {user.role}
                                    </Badge>
                                )}
                            </div>

                            <DropdownMenuSeparator />

                            {/* Theme Toggle Inline */}
                            <DropdownMenuItem asChild>
                                <ThemeToggle variant="row">Theme</ThemeToggle>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            {/* Logout */}
                            <DropdownMenuItem asChild>
                                <Button variant="ghost" className="cursor-pointer w-full justify-start" onClick={handleLogout}>
                                    {isLoggingOut ? (
                                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-loading-spinner-color border-t-transparent" />
                                    ) : (
                                        <LogOut className="mr-2 h-4 w-4" />
                                    )}
                                    Log out
                                </Button>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            {/* Delete Account */}
                            <DropdownMenuItem asChild>
                                <Button
                                    variant="ghost"
                                    className="cursor-pointer w-full justify-start text-destructive hover:!text-destructive"
                                    onClick={() => setShowDeleteModal(true)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Account
                                </Button>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarFooter>
            </Sidebar>

            {/* Delete Account Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md">
                        {/* Header */}
                        <div className="p-4 sm:p-6 border-b border-border">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-destructive/10 rounded-full">
                                    <AlertTriangle className="w-5 h-5 text-destructive" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-card-foreground">Delete Account</h3>
                                    <p className="text-sm text-muted-foreground">This action cannot be undone</p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 sm:p-6">
                            <div className="space-y-4">
                                <div className="bg-destructive/5 border border-destructive/20 rounded-md p-4">
                                    <h4 className="text-sm font-medium text-destructive mb-2">Warning: Permanent Deletion</h4>
                                    <ul className="text-xs text-destructive/80 space-y-1">
                                        <li>• All your uploaded files will be deleted</li>
                                        <li>• All your saved analyses will be removed</li>
                                        <li>• All your account data will be permanently erased</li>
                                        <li>• This action cannot be reversed</li>
                                    </ul>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-card-foreground">
                                        Enter your password to confirm:
                                    </label>
                                    <input
                                        type="password"
                                        value={deletePassword}
                                        onChange={(e) => setDeletePassword(e.target.value)}
                                        placeholder="Your current password"
                                        className="w-full p-3 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-destructive/50 bg-background text-foreground"
                                        disabled={isDeletingAccount}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 sm:p-6 border-t border-border flex flex-col sm:flex-row gap-3">
                            <Button
                                variant="outline"
                                onClick={handleDeleteModalClose}
                                disabled={isDeletingAccount}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDeleteAccount}
                                disabled={isDeletingAccount || !deletePassword.trim()}
                                className="flex-1 flex items-center justify-center gap-2"
                            >
                                {isDeletingAccount ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4" />
                                        Delete Account
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default DashboardSidebar
