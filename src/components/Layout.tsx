import { Outlet, Link, useLocation } from 'react-router-dom';
import { Building2, Home, BarChart3, Moon, Sun, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from './ThemeProvider';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function Layout() {
    const location = useLocation();
    const { t, i18n } = useTranslation();
    const { setTheme } = useTheme();

    const isActive = (path: string) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    const toggleLanguage = () => {
        const newLang = i18n.language === 'ar' ? 'en' : 'ar';
        i18n.changeLanguage(newLang);
        // Direction is handled via CSS/HTML attribute usually, but we can force update if needed
        document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300" dir={i18n.dir()}>
            {/* Header with Navigation */}
            <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container px-4 md:px-8 h-16 flex items-center justify-between mx-auto">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary hover:opacity-80 transition-opacity">
                        <Building2 className="h-6 w-6" />
                        <span className="hidden md:inline-block">{t('app.title')}</span>
                    </Link>

                    {/* Navigation */}
                    <div className="flex items-center gap-2 md:gap-4">
                        <nav className="flex items-center gap-1">
                            <Link
                                to="/"
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/')
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                            >
                                <Home className="h-4 w-4" />
                                <span className="hidden sm:inline">{t('nav.home')}</span>
                            </Link>

                            <Link
                                to="/stats"
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/stats')
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                            >
                                <BarChart3 className="h-4 w-4" />
                                <span className="hidden sm:inline">{t('nav.stats')}</span>
                            </Link>
                        </nav>

                        <div className="h-6 w-px bg-border mx-1" />

                        {/* Controls */}
                        <div className="flex items-center gap-2">
                            {/* Language Toggle */}
                            <Button variant="ghost" size="icon" onClick={toggleLanguage} title="Change Language">
                                <Languages className="h-[1.2rem] w-[1.2rem]" />
                                <span className="sr-only">Toggle Language</span>
                            </Button>

                            {/* Theme Toggle */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                        <span className="sr-only">Toggle theme</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setTheme("light")}>
                                        Light
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                                        Dark
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme("system")}>
                                        System
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
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
