
import { Button } from '../components/ui/button';
import { Globe2, Network, Zap, Target, Building2, Users2, BarChart3, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

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

                <div className="container relative mx-auto px-4 md:px-8 pt-20">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 backdrop-blur-sm mb-4">
                            <span className="flex h-2 w-2 rounded-full bg-athar-yellow animate-pulse"></span>
                            <span className="text-sm font-bold text-slate-600 tracking-wide">Mapping the Future of Innovation</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight text-slate-900">
                            The Upper Egypt <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-athar-blue to-athar-yellow">Innovation Ecosystem</span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
                            A comprehensive digital platform connecting startups, investors, and enablers.
                            Discover opportunities, analyze trends, and be part of the growing economy.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                            <Link to="/explore">
                                <Button size="lg" className="h-14 px-8 text-lg bg-athar-blue hover:bg-[#1520a8] text-white rounded-2xl shadow-lg shadow-athar-blue/25 hover:shadow-athar-blue/40 transition-all font-bold group">
                                    Explore the Map
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
            <section className="py-24 bg-white relative">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-athar-black mb-4">Why This Platform?</h2>
                        <div className="h-1.5 w-20 bg-athar-yellow mx-auto rounded-full mb-6"></div>
                        <p className="text-lg text-slate-600">
                            We bridge the gap between ideas and execution by providing data-driven insights and fostering connections across the ecosystem.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Feature 1 */}
                        <div className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-athar-blue/20 hover:shadow-xl hover:shadow-athar-blue/5 transition-all duration-300">
                            <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Network className="h-7 w-7 text-athar-blue" />
                            </div>
                            <h3 className="text-xl font-bold text-athar-black mb-3">Connect & Collaborate</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Find partners, mentors, and investors. Our directory categorizes startups by industry, stage, and location for easy discovery.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-athar-blue/20 hover:shadow-xl hover:shadow-athar-blue/5 transition-all duration-300">
                            <div className="h-14 w-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Zap className="h-7 w-7 text-athar-yellow" />
                            </div>
                            <h3 className="text-xl font-bold text-athar-black mb-3">Accelerate Growth</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Access resources, funding opportunities, and success stories. We highlight the most promising ventures in the region.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-athar-blue/20 hover:shadow-xl hover:shadow-athar-blue/5 transition-all duration-300">
                            <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <BarChart3 className="h-7 w-7 text-slate-700" />
                            </div>
                            <h3 className="text-xl font-bold text-athar-black mb-3">Data-Driven Insights</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Make informed decisions with real-time statistics on revenue, employment, and sector performance.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Athar Section */}
            <section className="py-24 bg-white text-slate-900 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-athar-blue/5 to-transparent"></div>

                <div className="container mx-auto px-4 md:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1 space-y-8">
                            <div className="inline-block">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="h-px w-8 bg-athar-blue"></span>
                                    <span className="text-athar-blue font-bold tracking-widest uppercase text-sm">Powered By</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-athar-black">Athar Accelerator</h2>
                            </div>

                            <p className="text-lg text-slate-600 leading-relaxed">
                                Athar is the leading startup accelerator in Upper Egypt, dedicated to fostering innovation and entrepreneurship. We believe in the potential of local talent to solve global challenges.
                            </p>

                            <ul className="space-y-4">
                                <li className="flex items-center gap-4">
                                    <div className="h-8 w-8 rounded-full bg-athar-blue/10 flex items-center justify-center text-athar-blue">
                                        <Building2 size={16} />
                                    </div>
                                    <span className="font-semibold text-slate-700">Supporting 100+ Startups</span>
                                </li>
                                <li className="flex items-center gap-4">
                                    <div className="h-8 w-8 rounded-full bg-athar-blue/20 flex items-center justify-center text-athar-blue">
                                        <Users2 size={16} />
                                    </div>
                                    <span className="font-semibold text-slate-700">Building a Strong Community</span>
                                </li>
                                <li className="flex items-center gap-4">
                                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                                        <Target size={16} />
                                    </div>
                                    <span className="font-semibold text-slate-700">Focused on Sustainable Impact</span>
                                </li>
                            </ul>

                            <div className="pt-4">
                                <a href="https://athareg.com" target="_blank" rel="noopener noreferrer">
                                    <Button variant="link" className="text-athar-blue hover:text-athar-yellow p-0 font-bold text-lg group">
                                        Visit Athar Website
                                        <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </a>
                            </div>
                        </div>

                        <div className="flex-1 w-full max-w-md lg:max-w-full relative">
                            <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-gradient-to-br from-slate-50 to-white border border-slate-200 shadow-lg p-8 flex items-center justify-center">
                                <img
                                    src={logo}
                                    alt="Athar Logo"
                                    className="w-3/4 h-auto object-contain"
                                />

                                {/* Decorative Circles */}
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-athar-blue/10 rounded-full filter blur-3xl"></div>
                                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-athar-yellow/20 rounded-full filter blur-3xl"></div>
                            </div>
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
