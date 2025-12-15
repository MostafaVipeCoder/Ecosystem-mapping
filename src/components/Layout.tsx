import { Outlet, Link, useLocation } from 'react-router-dom';
import { Building2, Home, BarChart3 } from 'lucide-react';

export default function Layout() {
    const location = useLocation();

    const isActive = (path: string) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans" dir="rtl">
            {/* Header with Navigation */}
            <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container px-4 md:px-8 h-16 flex items-center justify-between mx-auto">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary hover:opacity-80 transition-opacity">
                        <Building2 className="h-6 w-6" />
                        <span>منصة الشركات الناشئة</span>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex items-center gap-1">
                        <Link
                            to="/"
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/')
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                        >
                            <Home className="h-4 w-4" />
                            <span>الرئيسية</span>
                        </Link>

                        <Link
                            to="/stats"
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/stats')
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                        >
                            <BarChart3 className="h-4 w-4" />
                            <span>الإحصائيات</span>
                        </Link>


                    </nav>
                </div>
            </header>

            {/* Page Content */}
            <main>
                <Outlet />
            </main>


        </div>
    );
}
