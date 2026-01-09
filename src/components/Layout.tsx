import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, BarChart3 } from 'lucide-react';
import logo from '../assets/logo.png';

export default function Layout() {
    const location = useLocation();

    const isActive = (path: string) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans" dir="ltr">
            {/* Header with Navigation */}
            <header className="sticky top-0 z-30 w-full border-b border-white/5 bg-athar-black text-white shadow-xl">
                <div className="container px-4 md:px-8 h-18 flex items-center justify-between mx-auto py-2">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                        <div className="h-12 w-auto flex items-center justify-center">
                            <img
                                src={logo}
                                alt="Athar Logo"
                                className="h-full w-auto object-contain brightness-110"
                            />
                        </div>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex items-center gap-1">
                        <Link
                            to="/"
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isActive('/')
                                ? 'bg-athar-yellow text-athar-black shadow-lg shadow-athar-yellow/20'
                                : 'text-slate-300 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            <Home className="h-4 w-4" />
                            <span>Home</span>
                        </Link>

                        <Link
                            to="/stats"
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isActive('/stats')
                                ? 'bg-athar-yellow text-athar-black shadow-lg shadow-athar-yellow/20'
                                : 'text-slate-300 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            <BarChart3 className="h-4 w-4" />
                            <span>Statistics</span>
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
