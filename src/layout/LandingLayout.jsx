import { Outlet, useNavigation } from "react-router-dom"
import { Footer, Header } from "@/pages/landing"
import { Spinner1 } from "@/components"

function LandingLayout() {
    const navigation = useNavigation()
    const isNavigating = navigation.state === "loading"
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-grow">
                {isNavigating ? (
                    <div className="min-h-[60vh] flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4">
                            <Spinner1 className="w-8 h-8 border-2 border-primary" />
                            <p className="text-muted-foreground">Loading...</p>
                        </div>
                    </div>
                ) : (
                    <Outlet />
                )}
            </main>
            <Footer />
        </div>
    )
}

export default LandingLayout
