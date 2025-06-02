import { Outlet } from "react-router-dom"
import { Footer, Header } from "@/pages/landing"

function LandingLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default LandingLayout
