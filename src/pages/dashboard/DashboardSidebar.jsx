import { signout } from "@/api";
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
    useSidebar
} from "@/components";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context";
import { ClockCounterClockwise, Graph, LayoutDashboard, LogOutIcon, PATHS, showGenericErrorAsToast, TOAST_OPTIONS, Upload, User } from "@/utils";
import { LogOut, ShieldIcon } from "lucide-react";
import React, { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";

function DashboardSidebar() {
    const allMenuItems = [
        { title: "Dashboard", icon: LayoutDashboard, url: PATHS.DASHBOARD },
        { title: "Upload & Analyze Data", icon: Upload, url: PATHS.FILE_UPLOAD },
        { title: "Analysis History", icon: ClockCounterClockwise, url: PATHS.ANALYSIS_HISTORY },
        { title: "Admin panel", icon: ShieldIcon, url: PATHS.ADMIN_PANEL, requiredRoles: ['admin'] },
    ];

    const { setOpenMobile } = useSidebar();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Filter menu items based on user roles
    const menuItems = useMemo(() => {
        return allMenuItems.filter(item => {
            // If item doesn't require specific roles, show it to everyone
            if (!item.requiredRoles) return true;

            // If user doesn't have roles, hide items that require roles
            if (!user?.role) return false;

            // Check if user has any of the required roles
            return item.requiredRoles.some(role => user.role.includes(role));
        });
    }, [user?.roles]);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);

            const { success, genericErrors } = await signout();
            if (success) {
                logout();
                toast.success("You've been logged out successfully.", TOAST_OPTIONS);
                navigate(PATHS.SIGNIN, { replace: true });
                return;
            }

            showGenericErrorAsToast(genericErrors);
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Something went wrong. Please try again.", TOAST_OPTIONS);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <Sidebar className="text-lg md:text-md w-64 max-h-screen overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-hide">
            <SidebarContent className="pt-6 px-4 space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground font-semibold text-base">
                    <Graph className="w-6 h-6" />
                    <span>Excel Analytics</span>
                </div>

                <SidebarGroupContent>
                    <SidebarMenu className="space-y-1">
                        {menuItems.map((item) => {
                            const itemPath = item.url.startsWith("/")
                                ? item.url
                                : `/dashboard/${item.url}`;
                            const isActive = location.pathname === itemPath;

                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link
                                            to={isActive ? "#" : item.url}
                                            onClick={(e) => {
                                                if (isActive) {
                                                    e.preventDefault();
                                                    return;
                                                }
                                                setOpenMobile(false);
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
                            <div className="flex-1 flex flex-col items-start min-w-0">
                                <span className="text-sm font-medium truncate">
                                    {user?.username ?? "User"}
                                </span>
                                <span className="text-xs text-muted-foreground truncate">
                                    {user?.email ?? "email@example.com"}
                                </span>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="start" side="top" className="w-56">
                        {/* Header with Role Badge */}
                        <div className="px-4 py-2 flex items-center justify-between">
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-medium truncate">
                                    {user?.username ?? "User"}
                                </span>
                                <span className="text-xs text-muted-foreground truncate">
                                    {user?.email ?? "email@example.com"}
                                </span>
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
                            <ThemeToggle variant="row">
                                Theme
                            </ThemeToggle>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        {/* Logout */}
                        <DropdownMenuItem asChild>
                            <Button
                                variant="ghost"
                                className="cursor-pointer w-full justify-start"
                                onClick={handleLogout}
                            >
                                {isLoggingOut ? (
                                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-loading-spinner-color border-t-transparent" />
                                ) : (
                                    <LogOut className="mr-2 h-4 w-4" />
                                )}
                                Log out
                            </Button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarFooter>
        </Sidebar>
    );
}

export default DashboardSidebar;