
import { Button } from '../components/ui/button';
import { Globe2, Network, Target, Building2, Users2, BarChart3, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import planLogo from '../assets/plan-international.png';
import denmarkLogo from '../assets/denmark-ministry.png';
import atharLogo from '../assets/Athar-Logo.png';
import danishLogo from '../assets/Danish-Arab-Logo.png';
import danskerhverLogo from '../assets/dansk-erhverv.png';
import readyLogo from '../assets/ready-for-tomorrow.png';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans" dir="ltr">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-white text-slate-900 min-h-[90vh] flex items-center">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-athar-blue/10 via-white to-white"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-50 mix-blend-soft-light"></div>

                {/* Animated Shapes */}
                <div className="absolute top-20 right-20 w-96 h-96 bg-athar-blue/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 left-20 w-72 h-72 bg-athar-yellow/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

                <div className="container relative mx-auto px-4 md:px-8 pt-0.2">
                    <div className="max-w-4xl mx-auto text-center space-y-8">


                        {/* Ready For Tomorrow Logo */}
                        <div className="mb-4 flex justify-center">
                            <img
                                src={readyLogo}
                                alt="Ready For Tomorrow"
                                className="h-20 md:h-60 w-auto object-contain"
                            />
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight text-slate-900">
                            <span className="block">Egypt Startup & MSME</span>
                            <span className="block mt-7 text-transparent bg-clip-text bg-gradient-to-r from-athar-blue to-athar-yellow">Directory Platform</span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">

                            The Egypt Startup & MSME Directory Platform is a national, interactive online directory that showcases startups and micro, small, and medium enterprises (MSMEs) supported through YIEP, DAPP, and partner programs across Egypt.

                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                            <Link to="/explore">
                                <Button size="lg" className="h-14 px-8 text-lg bg-athar-blue hover:bg-[#1520a8] text-white rounded-2xl shadow-lg shadow-athar-blue/25 hover:shadow-athar-blue/40 transition-all font-bold group">
                                    Explore the Ecosystem
                                    <Globe2 className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                                </Button>
                            </Link>
                            <Link to="/stats">
                                <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-slate-200 text-slate-700 hover:bg-slate-50 rounded-2xl font-bold bg-white shadow-sm hover:shadow-md transition-all">
                                    View Analytics
                                    <BarChart3 className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Platform Section */}
            <section className="py-24 bg-slate-50 relative border-y border-slate-100">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-athar-black mb-4">Why This Platform?</h2>
                        <div className="h-1.5 w-20 bg-athar-yellow mx-auto rounded-full mb-6"></div>
                        <p className="text-lg text-slate-600">
                            We bridge the gap between ideas and execution by providing data-driven insights and fostering connections across the ecosystem.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                        {/* Feature 1: Explore */}
                        <div className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-athar-blue/20 hover:shadow-xl hover:shadow-athar-blue/5 transition-all duration-300">
                            <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Globe2 className="h-7 w-7 text-athar-blue" />
                            </div>
                            <h3 className="text-xl font-bold text-athar-black mb-3">Explore & Discover</h3>
                            <p className="text-slate-500 leading-relaxed text-sm">
                                Explore startups and MSMEs nationwide by sector and location through our interactive directory.
                            </p>
                        </div>

                        {/* Feature 2: Economic Impact (Data-Driven Insights) */}
                        <div className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-athar-blue/20 hover:shadow-xl hover:shadow-athar-blue/5 transition-all duration-300">
                            <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <BarChart3 className="h-7 w-7 text-slate-700" />
                            </div>
                            <h3 className="text-xl font-bold text-athar-black mb-3">Data-Driven Insights</h3>
                            <p className="text-slate-500 leading-relaxed text-sm">
                                Visualize economic impact including jobs created, revenues, and key growth indicators across the nation.
                            </p>
                        </div>

                        {/* Feature 3: Direct Connection */}
                        <div className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-athar-blue/20 hover:shadow-xl hover:shadow-athar-blue/5 transition-all duration-300">
                            <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Network className="h-7 w-7 text-athar-blue" />
                            </div>
                            <h3 className="text-xl font-bold text-athar-black mb-3">Direct Connections</h3>
                            <p className="text-slate-500 leading-relaxed text-sm">
                                Enable direct connection between businesses, investors, and ecosystem partners to foster collaboration.
                            </p>
                        </div>

                        {/* Feature 4: Transparent Reporting */}
                        <div className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-athar-blue/20 hover:shadow-xl hover:shadow-athar-blue/5 transition-all duration-300">
                            <div className="h-14 w-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Target className="h-7 w-7 text-athar-yellow" />
                            </div>
                            <h3 className="text-xl font-bold text-athar-black mb-3">Transparent Reporting</h3>
                            <p className="text-slate-500 leading-relaxed text-sm">
                                Support transparent reporting and ecosystem learning through structured data and analytics.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Partners Section */}
            <section className="py-16 bg-slate-50 border-y border-slate-200">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-athar-black mb-2">Powerd by</h2>
                        <div className="h-1 w-16 bg-athar-blue mx-auto rounded-full"></div>
                    </div>

                    <div className="flex flex-nowrap items-center justify-center gap-8 md:gap-20 max-w-7xl mx-auto px-4 py-4">
                        {/* Plan International */}
                        <div className="shrink-0 flex items-center justify-center">
                            <img
                                src={planLogo}
                                alt="Plan International"
                                className="h-16 md:h-24 w-auto object-contain transition-all duration-300"
                            />
                        </div>

                        {/* Denmark Ministry */}
                        <div className="shrink-0 flex items-center justify-center">
                            <img
                                src={denmarkLogo}
                                alt="Ministry of Foreign Affairs of Denmark"
                                className="h-16 md:h-24 w-auto object-contain transition-all duration-300"
                            />
                        </div>

                        {/* Danish Arab Union */}
                        <div className="shrink-0 flex items-center justify-center">
                            <img
                                src={danishLogo}
                                alt="Danish Arab Union"
                                className="h-16 md:h-24 w-auto object-contain transition-all duration-300"
                            />
                        </div>

                        {/* DANSK ERHVERV */}
                        <div className="shrink-0 flex items-center justify-center">
                            <img
                                src={danskerhverLogo}
                                alt="DANSK ERHVERV"
                                className="h-16 md:h-24 w-auto object-contain transition-all duration-300"
                            />
                        </div>
                    </div>
                </div>
            </section>



            {/* Footer */}
            <footer className="bg-athar-black border-t border-white/10 py-12 text-center text-slate-500 text-sm">
                <div className="container mx-auto px-4">
                    <p>&copy; {new Date().getFullYear()} Athar Accelerator. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
