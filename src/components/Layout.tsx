import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, BarChart3, Globe2 } from 'lucide-react';
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
            <header className="sticky top-0 z-[40] w-full border-b border-slate-200 bg-white/80 backdrop-blur-md text-slate-900 shadow-sm">
                <div className="w-full px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                        <div className="h-10 md:h-12 w-auto flex items-center justify-center">
                            <img
                                src={logo}
                                alt="Athar Logo"
                                className="h-full w-auto object-contain"
                            />
                        </div>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex items-center gap-2 md:gap-4">
                        <Link
                            to="/"
                            className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${isActive('/') && location.pathname === '/'
                                ? 'bg-[#1a27c9] text-white shadow-lg shadow-athar-blue/20'
                                : 'text-slate-500 hover:text-athar-blue hover:bg-slate-50'
                                }`}
                        >
                            <Home className="h-4 w-4" />
                            <span className="hidden sm:inline">Home</span>
                        </Link>

                        <Link
                            to="/explore"
                            className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${isActive('/explore')
                                ? 'bg-[#1a27c9] text-white shadow-lg shadow-athar-blue/20'
                                : 'text-slate-500 hover:text-athar-blue hover:bg-slate-50'
                                }`}
                        >
                            <Globe2 className="h-4 w-4" />
                            <span className="hidden sm:inline">Ecosystem</span>
                        </Link>

                        <Link
                            to="/stats"
                            className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${isActive('/stats')
                                ? 'bg-[#1a27c9] text-white shadow-lg shadow-athar-blue/20'
                                : 'text-slate-500 hover:text-athar-blue hover:bg-slate-50'
                                }`}
                        >
                            <BarChart3 className="h-4 w-4" />
                            <span className="hidden sm:inline">Statistics</span>
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
