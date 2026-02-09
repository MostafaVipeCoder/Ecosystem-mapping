import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, BarChart3, Globe2 } from 'lucide-react';
import logo from '../assets/logo.png';
import readyLogo from '../assets/ready-for-tomorrow.png';

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
                <div className="w-full px-4 md:px-12 h-20 md:h-28 flex items-center justify-between gap-4">
                    {/* Left: Branding Logo */}
                    <div className="flex-1 flex justify-start">
                        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                            <div className="h-10 md:h-16 w-auto flex items-center justify-center">
                                <img
                                    src={logo}
                                    alt="Athar Logo"
                                    className="h-full w-auto object-contain"
                                />
                            </div>
                        </Link>
                    </div>

                    {/* Middle: Navigation Tabs */}
                    <nav className="flex items-center gap-1 md:gap-4 bg-slate-100/50 p-1 md:p-2 rounded-2xl border border-slate-200/50">
                        <Link
                            to="/"
                            className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-xl text-xs md:text-sm font-bold transition-all ${isActive('/') && location.pathname === '/'
                                ? 'bg-white text-[#1a27c9] shadow-sm'
                                : 'text-slate-500 hover:text-athar-blue hover:bg-white/50'
                                }`}
                        >
                            <Home className="h-4 w-4" />
                            <span className="hidden sm:inline">Home</span>
                        </Link>

                        <Link
                            to="/explore"
                            className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-xl text-xs md:text-sm font-bold transition-all ${isActive('/explore')
                                ? 'bg-white text-[#1a27c9] shadow-sm'
                                : 'text-slate-500 hover:text-athar-blue hover:bg-white/50'
                                }`}
                        >
                            <Globe2 className="h-4 w-4" />
                            <span className="hidden sm:inline">Ecosystem</span>
                        </Link>

                        <Link
                            to="/stats"
                            className={`flex items-center gap-2 px-3 md:px-6 py-2 md:py-3 rounded-xl text-xs md:text-sm font-bold transition-all ${isActive('/stats')
                                ? 'bg-white text-[#1a27c9] shadow-sm'
                                : 'text-slate-500 hover:text-athar-blue hover:bg-white/50'
                                }`}
                        >
                            <BarChart3 className="h-4 w-4" />
                            <span className="hidden sm:inline">Statistics</span>
                        </Link>
                    </nav>

                    {/* Right: Ready For Tomorrow Logo */}
                    <div className="flex-1 flex justify-end">
                        <div className="h-12 md:h-24 w-auto flex items-center">
                            <img
                                src={readyLogo}
                                alt="Ready For Tomorrow"
                                className="h-full w-auto object-contain"
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Page Content */}
            <main>
                <Outlet />
            </main>


        </div>
    );
}
