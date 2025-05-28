import { SidebarProvider, SidebarTrigger } from "@/components";
import { DashboardSidebar } from "@/pages";
import { Outlet } from "react-router-dom";

function DashboardLayout() {
    return (
        <SidebarProvider defaultOpen={true}>
            <div className="flex w-full h-screen overflow-hidden bg-background text-foreground">
                <DashboardSidebar className="hidden md:block" />

                {/* Main Content Area */}
                <div className="grow p-4 space-y-4 overflow-y-auto bg-background">
                    {/* Mobile Sidebar Trigger */}
                    <div className="md:hidden mb-4">
                        <SidebarTrigger className="py-2 px-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer text-center" />
                    </div>

                    <Outlet />
                </div>
            </div>
        </SidebarProvider>
    );
}

export default DashboardLayout