
import React, { useEffect, useRef, useState } from 'react';
import {
    TrendUp, ChartBar, ArrowsClockwise, Target, ShieldCheck, Lightning,
    CurrencyDollar, Bell, DeviceMobile, ArrowRight, Star, Check,
    CaretDown, Wallet, ChartPie, Lock, Users, Globe, ArrowUpRight
} from 'phosphor-react';

interface LandingPageProps {
    onEnterApp: () => void;
}

// Intersection Observer hook for scroll animations
function useInView(threshold = 0.15) {
    const ref = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold]);
    return { ref, inView };
}

function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
    const { ref, inView } = useInView();
    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ${className}`}
            style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(40px)',
                transitionDelay: `${delay}ms`,
            }}
        >
            {children}
        </div>
    );
}

const FEATURES = [
    { icon: ChartBar, title: 'Smart Analytics', desc: 'Visual spending breakdowns by category with interactive bar charts and monthly trend analysis.', color: '#A855F7' },
    { icon: ArrowsClockwise, title: 'Recurring Tracker', desc: 'Never miss a bill. Track subscriptions, rent, and recurring income with smart due-date alerts.', color: '#00D68F' },
    { icon: Target, title: 'Savings Goals', desc: 'Set financial targets with visual progress bars. Contribute to goals and watch your savings grow.', color: '#3B82F6' },
    { icon: ShieldCheck, title: 'Budget Limits', desc: 'Set spending caps per category. Get visual warnings when you approach or exceed your budget.', color: '#FBBF24' },
    { icon: Lock, title: 'Privacy First', desc: 'Your data never leaves your device. No cloud sync means total privacy and zero data breaches.', color: '#FF6B6B' },
    { icon: DeviceMobile, title: 'Fully Responsive', desc: 'Beautiful on any device — desktop, tablet, or phone. A premium experience across all screens.', color: '#EC4899' },
];

const STEPS = [
    { num: '01', title: 'Add Your Transactions', desc: 'Log income and expenses in seconds with our smart categorization system.', icon: CurrencyDollar },
    { num: '02', title: 'Set Goals & Budgets', desc: 'Define spending limits and savings targets that match your financial ambitions.', icon: Target },
    { num: '03', title: 'Watch Your Wealth Grow', desc: 'Track progress with real-time charts, alerts, and insights that keep you on track.', icon: TrendUp },
];

const TESTIMONIALS = [
    { name: 'Sarah Chen', role: 'Product Designer', text: 'CoinTrack replaced three different apps for me. The recurring bills tracker alone saves me from late fees every month.', avatar: 'SC', rating: 5 },
    { name: 'Marcus Rivera', role: 'Freelance Developer', text: 'Finally a finance app that respects my privacy. Everything stays on my device and the UI is absolutely gorgeous.', avatar: 'MR', rating: 5 },
    { name: 'Aisha Patel', role: 'Small Business Owner', text: 'The savings goals feature changed how I plan my finances. I saved for a new laptop in just 4 months using CoinTrack.', avatar: 'AP', rating: 5 },
];

const PRICING = [
    {
        name: 'Free',
        price: '$0',
        period: 'forever',
        desc: 'Perfect for getting started',
        features: ['Up to 50 transactions/month', 'Basic spending charts', '3 categories', '1 savings goal', 'Mobile responsive'],
        cta: 'Get Started Free',
        highlighted: false,
    },
    {
        name: 'Pro',
        price: '$9',
        period: '/month',
        desc: 'For serious money managers',
        features: ['Unlimited transactions', 'Advanced analytics & reports', 'Unlimited categories', 'Unlimited savings goals', 'Recurring bill tracker', 'Budget rollover', 'CSV/JSON data export', 'Priority support'],
        cta: 'Start 14-Day Trial',
        highlighted: true,
    },
    {
        name: 'Enterprise',
        price: '$29',
        period: '/month',
        desc: 'For teams and families',
        features: ['Everything in Pro', 'Multi-user accounts', 'Shared budgets & goals', 'Bank sync (Plaid API)', 'Multi-currency support', 'Custom reports', 'Dedicated account manager', 'SSO & audit logs'],
        cta: 'Contact Sales',
        highlighted: false,
    },
];

const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-[#0C0E14] text-white overflow-x-hidden">

            {/* ─── Sticky Navbar ─── */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0C0E14]/90 backdrop-blur-xl border-b border-white/[0.06] shadow-2xl' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-br from-[#6C5CE7] to-[#A855F7] p-2 rounded-xl shadow-lg shadow-purple-500/20">
                            <TrendUp weight="bold" className="text-white w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">CoinTrack</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-8">
                        <button onClick={() => scrollTo('features')} className="text-sm text-[#8B95A7] hover:text-white transition-colors font-medium">Features</button>
                        <button onClick={() => scrollTo('how-it-works')} className="text-sm text-[#8B95A7] hover:text-white transition-colors font-medium">How it Works</button>
                        <button onClick={() => scrollTo('pricing')} className="text-sm text-[#8B95A7] hover:text-white transition-colors font-medium">Pricing</button>
                        <button onClick={() => scrollTo('testimonials')} className="text-sm text-[#8B95A7] hover:text-white transition-colors font-medium">Testimonials</button>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button onClick={onEnterApp} className="hidden md:block text-sm text-[#A78BFA] hover:text-white transition-colors font-semibold">Log In</button>
                        <button
                            onClick={onEnterApp}
                            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
                            style={{ background: 'linear-gradient(135deg, #6C5CE7 0%, #A855F7 100%)' }}
                        >
                            Try Demo
                        </button>
                    </div>
                </div>
            </nav>

            {/* ─── Background Animation Keyframes ─── */}
            <style>{`
              @keyframes float-up {
                0% { transform: translateY(100vh) scale(0); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(-10vh) scale(1); opacity: 0; }
              }
              @keyframes orbit {
                0% { transform: rotate(0deg) translateX(var(--orbit-r)) rotate(0deg); }
                100% { transform: rotate(360deg) translateX(var(--orbit-r)) rotate(-360deg); }
              }
              @keyframes drift {
                0%, 100% { transform: translate(0, 0); }
                25% { transform: translate(var(--dx1), var(--dy1)); }
                50% { transform: translate(var(--dx2), var(--dy2)); }
                75% { transform: translate(var(--dx3), var(--dy3)); }
              }
              @keyframes spin-slow {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              @keyframes pulse-ring {
                0%, 100% { transform: scale(1); opacity: 0.15; }
                50% { transform: scale(1.15); opacity: 0.05; }
              }
              @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
              }
            `}</style>

            {/* ─── Hero Section ─── */}
            <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">

                    {/* Floating particles */}
                    {Array.from({ length: 30 }).map((_, i) => {
                        const size = 2 + Math.random() * 4;
                        const left = Math.random() * 100;
                        const duration = 8 + Math.random() * 16;
                        const delay = Math.random() * 20;
                        const isPurple = Math.random() > 0.4;
                        return (
                            <div
                                key={`p-${i}`}
                                className="absolute rounded-full"
                                style={{
                                    width: size,
                                    height: size,
                                    left: `${left}%`,
                                    bottom: '-5%',
                                    background: isPurple
                                        ? `rgba(168,85,247,${0.3 + Math.random() * 0.4})`
                                        : `rgba(255,255,255,${0.1 + Math.random() * 0.2})`,
                                    animation: `float-up ${duration}s ${delay}s linear infinite`,
                                    boxShadow: isPurple ? `0 0 ${size * 3}px rgba(168,85,247,0.3)` : 'none',
                                }}
                            />
                        );
                    })}

                    {/* Orbiting geometric shapes */}
                    {[
                        { r: 280, dur: 30, size: 14, color: '#6C5CE7', shape: 'rounded-full', top: '20%', left: '15%' },
                        { r: 200, dur: 25, size: 10, color: '#A855F7', shape: 'rotate-45 rounded-sm', top: '70%', left: '80%' },
                        { r: 320, dur: 40, size: 8, color: '#00D68F', shape: 'rounded-full', top: '40%', left: '85%' },
                        { r: 240, dur: 35, size: 12, color: '#7C3AED', shape: 'rotate-45 rounded-sm', top: '75%', left: '10%' },
                    ].map((orb, i) => (
                        <div
                            key={`orb-${i}`}
                            className="absolute"
                            style={{ top: orb.top, left: orb.left, width: 1, height: 1 }}
                        >
                            <div
                                className={`${orb.shape}`}
                                style={{
                                    width: orb.size,
                                    height: orb.size,
                                    background: orb.color,
                                    opacity: 0.4,
                                    boxShadow: `0 0 ${orb.size * 2}px ${orb.color}60`,
                                    // @ts-ignore
                                    '--orbit-r': `${orb.r}px`,
                                    animation: `orbit ${orb.dur}s linear infinite`,
                                } as React.CSSProperties}
                            />
                        </div>
                    ))}

                    {/* Large moving gradient orbs */}
                    <div
                        className="absolute w-[500px] h-[500px] rounded-full blur-[150px] opacity-[0.07]"
                        style={{
                            background: 'radial-gradient(circle, #6C5CE7, transparent 70%)',
                            top: '10%',
                            left: '5%',
                            // @ts-ignore
                            '--dx1': '80px', '--dy1': '60px', '--dx2': '-40px', '--dy2': '100px', '--dx3': '60px', '--dy3': '-30px',
                            animation: 'drift 20s ease-in-out infinite',
                        } as React.CSSProperties}
                    />
                    <div
                        className="absolute w-[400px] h-[400px] rounded-full blur-[130px] opacity-[0.06]"
                        style={{
                            background: 'radial-gradient(circle, #A855F7, transparent 70%)',
                            bottom: '5%',
                            right: '10%',
                            // @ts-ignore
                            '--dx1': '-70px', '--dy1': '-50px', '--dx2': '50px', '--dy2': '-80px', '--dx3': '-30px', '--dy3': '40px',
                            animation: 'drift 25s ease-in-out infinite',
                        } as React.CSSProperties}
                    />
                    <div
                        className="absolute w-[350px] h-[350px] rounded-full blur-[120px] opacity-[0.05]"
                        style={{
                            background: 'radial-gradient(circle, #00D68F, transparent 70%)',
                            top: '50%',
                            left: '50%',
                            // @ts-ignore
                            '--dx1': '100px', '--dy1': '-70px', '--dx2': '-80px', '--dy2': '-40px', '--dx3': '40px', '--dy3': '60px',
                            animation: 'drift 30s ease-in-out infinite',
                        } as React.CSSProperties}
                    />

                    {/* Pulsing rings */}
                    <div
                        className="absolute border border-[#7C3AED]/10 rounded-full"
                        style={{
                            width: 600, height: 600,
                            top: '50%', left: '50%',
                            marginTop: -300, marginLeft: -300,
                            animation: 'pulse-ring 6s ease-in-out infinite',
                        }}
                    />
                    <div
                        className="absolute border border-[#7C3AED]/[0.06] rounded-full"
                        style={{
                            width: 900, height: 900,
                            top: '50%', left: '50%',
                            marginTop: -450, marginLeft: -450,
                            animation: 'pulse-ring 8s ease-in-out infinite 1s',
                        }}
                    />

                    {/* Dot grid */}
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)', backgroundSize: '40px 40px' }} />

                    {/* Shimmer line */}
                    <div
                        className="absolute top-[40%] left-0 right-0 h-px opacity-20"
                        style={{
                            background: 'linear-gradient(90deg, transparent, transparent 30%, #7C3AED 50%, transparent 70%, transparent)',
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 8s linear infinite',
                        }}
                    />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto text-center">
                    {/* Badge */}
                    <AnimatedSection>
                        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-[#7C3AED]/30 bg-[#7C3AED]/10 mb-8">
                            <Lightning weight="fill" className="w-4 h-4 text-[#A855F7]" />
                            <span className="text-xs font-bold text-[#A78BFA] uppercase tracking-wider">Now in Public Beta</span>
                        </div>
                    </AnimatedSection>

                    {/* Main headline */}
                    <AnimatedSection delay={100}>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.95] mb-6">
                            <span className="text-white">Your money,</span>
                            <br />
                            <span className="bg-gradient-to-r from-[#6C5CE7] via-[#A855F7] to-[#C084FC] bg-clip-text text-transparent">
                                beautifully tracked.
                            </span>
                        </h1>
                    </AnimatedSection>

                    {/* Subtitle */}
                    <AnimatedSection delay={200}>
                        <p className="text-lg md:text-xl text-[#8B95A7] max-w-2xl mx-auto mb-10 leading-relaxed">
                            The modern finance tracker that helps you understand your spending, crush savings goals, and never miss a bill — all with a stunning interface.
                        </p>
                    </AnimatedSection>

                    {/* CTA Buttons */}
                    <AnimatedSection delay={300}>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                            <button
                                onClick={onEnterApp}
                                className="group px-8 py-4 rounded-2xl text-base font-bold text-white transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 flex items-center space-x-3"
                                style={{ background: 'linear-gradient(135deg, #6C5CE7 0%, #A855F7 100%)' }}
                            >
                                <span>Start Tracking Free</span>
                                <ArrowRight weight="bold" className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => scrollTo('features')}
                                className="px-8 py-4 rounded-2xl text-base font-semibold text-[#8B95A7] border border-white/[0.08] hover:border-[#7C3AED]/40 hover:text-white hover:bg-white/[0.02] transition-all flex items-center space-x-2"
                            >
                                <span>See Features</span>
                                <CaretDown weight="bold" className="w-4 h-4" />
                            </button>
                        </div>
                    </AnimatedSection>

                    {/* Dashboard Preview */}
                    <AnimatedSection delay={400}>
                        <div className="relative max-w-4xl mx-auto">
                            <div className="absolute -inset-4 bg-gradient-to-r from-[#6C5CE7]/20 via-[#A855F7]/10 to-[#6C5CE7]/20 rounded-3xl blur-xl" />
                            <div className="relative bg-[#111320] rounded-2xl border border-white/[0.08] p-3 shadow-2xl shadow-purple-900/30">
                                {/* Fake browser bar */}
                                <div className="flex items-center space-x-2 mb-3 px-2">
                                    <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                                    <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
                                    <div className="flex-1 mx-4 h-6 rounded-lg bg-white/[0.04] flex items-center justify-center">
                                        <span className="text-[10px] text-[#4B5568] font-medium">cointrack.app</span>
                                    </div>
                                </div>
                                {/* Dashboard mockup */}
                                <div className="rounded-xl overflow-hidden bg-[#0C0E14] p-6">
                                    <div className="grid grid-cols-5 gap-4 mb-4">
                                        <div className="col-span-3 rounded-xl p-5 h-28" style={{ background: 'linear-gradient(135deg, #1a1040 0%, #2d1b69 50%, #1C2033 100%)' }}>
                                            <div className="flex items-center space-x-2 mb-2">
                                                <Wallet weight="fill" className="w-4 h-4 text-[#A78BFA]" />
                                                <span className="text-[9px] font-bold text-[#A78BFA] uppercase tracking-widest">Total Balance</span>
                                            </div>
                                            <h3 className="text-3xl font-extrabold text-white">$4,215.71</h3>
                                            <p className="text-[10px] text-[#8B95A7] mt-1">Realized cash across all accounts</p>
                                        </div>
                                        <div className="rounded-xl p-4 bg-[#111320] border border-white/[0.06]">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="p-1.5 rounded-lg bg-[#00D68F]/10">
                                                    <ArrowUpRight weight="bold" className="w-3 h-3 text-[#00D68F]" />
                                                </div>
                                                <span className="text-[8px] font-bold text-[#8B95A7] uppercase">Income</span>
                                            </div>
                                            <h4 className="text-lg font-extrabold text-white">$6,432</h4>
                                        </div>
                                        <div className="rounded-xl p-4 bg-[#111320] border border-white/[0.06]">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="p-1.5 rounded-lg bg-[#FF6B6B]/10">
                                                    <ArrowUpRight weight="bold" className="w-3 h-3 text-[#FF6B6B]" style={{ transform: 'rotate(90deg)' }} />
                                                </div>
                                                <span className="text-[8px] font-bold text-[#8B95A7] uppercase">Spent</span>
                                            </div>
                                            <h4 className="text-lg font-extrabold text-white">$2,216</h4>
                                        </div>
                                    </div>
                                    {/* Fake chart bars */}
                                    <div className="rounded-xl bg-[#111320] border border-white/[0.06] p-4">
                                        <div className="flex items-end space-x-3 h-24">
                                            {[65, 40, 80, 30, 55, 20, 70, 45, 25, 60, 35, 50].map((h, i) => (
                                                <div key={i} className="flex-1 rounded-t-md" style={{
                                                    height: `${h}%`,
                                                    background: i % 3 === 0 ? 'linear-gradient(180deg, #00D68F, #00D68F80)' : 'linear-gradient(180deg, #A855F7, #A855F780)',
                                                    opacity: 0.8,
                                                }} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>

                    {/* Social proof */}
                    <AnimatedSection delay={500}>
                        <div className="flex flex-wrap items-center justify-center gap-6 mt-12">
                            <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} weight="fill" className="w-4 h-4 text-[#FBBF24]" />)}
                                <span className="text-sm text-[#8B95A7] ml-2 font-medium">4.9/5 rating</span>
                            </div>
                            <div className="h-4 w-px bg-white/[0.08]" />
                            <div className="flex items-center space-x-2">
                                <Users weight="fill" className="w-4 h-4 text-[#A78BFA]" />
                                <span className="text-sm text-[#8B95A7] font-medium">2,400+ active users</span>
                            </div>
                            <div className="h-4 w-px bg-white/[0.08]" />
                            <div className="flex items-center space-x-2">
                                <Globe weight="fill" className="w-4 h-4 text-[#00D68F]" />
                                <span className="text-sm text-[#8B95A7] font-medium">Available worldwide</span>
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* ─── Features Section ─── */}
            <section id="features" className="py-28 px-6">
                <div className="max-w-7xl mx-auto">
                    <AnimatedSection>
                        <div className="text-center mb-16">
                            <span className="text-xs font-bold text-[#A855F7] uppercase tracking-widest">Features</span>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-white mt-3 mb-4 tracking-tight">Everything you need to<br /><span className="bg-gradient-to-r from-[#6C5CE7] to-[#A855F7] bg-clip-text text-transparent">master your money</span></h2>
                            <p className="text-[#8B95A7] text-lg max-w-xl mx-auto">Powerful features wrapped in a beautiful interface. No complexity, no clutter — just clarity.</p>
                        </div>
                    </AnimatedSection>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {FEATURES.map((f, i) => (
                            <div key={f.title}>
                                <AnimatedSection delay={i * 100}>
                                    <div className="group p-7 rounded-2xl bg-[#111320]/80 border border-white/[0.06] hover:border-[#7C3AED]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-900/10 h-full">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110" style={{ background: `${f.color}15` }}>
                                            <f.icon weight="fill" className="w-6 h-6" style={{ color: f.color }} />
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                                        <p className="text-sm text-[#8B95A7] leading-relaxed">{f.desc}</p>
                                    </div>
                                </AnimatedSection>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── How It Works ─── */}
            <section id="how-it-works" className="py-28 px-6 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#7C3AED]/[0.03] to-transparent pointer-events-none" />
                <div className="max-w-5xl mx-auto relative z-10">
                    <AnimatedSection>
                        <div className="text-center mb-16">
                            <span className="text-xs font-bold text-[#A855F7] uppercase tracking-widest">How It Works</span>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-white mt-3 mb-4 tracking-tight">Three steps to<br /><span className="bg-gradient-to-r from-[#00D68F] to-[#34d399] bg-clip-text text-transparent">financial freedom</span></h2>
                        </div>
                    </AnimatedSection>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {STEPS.map((s, i) => (
                            <div key={s.num}>
                                <AnimatedSection delay={i * 150}>
                                    <div className="relative text-center">
                                        <div className="text-7xl font-black text-[#7C3AED]/10 mb-4">{s.num}</div>
                                        <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6C5CE7 0%, #A855F7 100%)' }}>
                                            <s.icon weight="bold" className="w-7 h-7 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                                        <p className="text-sm text-[#8B95A7] leading-relaxed max-w-xs mx-auto">{s.desc}</p>
                                        {i < STEPS.length - 1 && (
                                            <div className="hidden md:block absolute top-16 -right-4 w-8">
                                                <ArrowRight weight="bold" className="w-6 h-6 text-[#7C3AED]/30" />
                                            </div>
                                        )}
                                    </div>
                                </AnimatedSection>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Testimonials ─── */}
            <section id="testimonials" className="py-28 px-6">
                <div className="max-w-6xl mx-auto">
                    <AnimatedSection>
                        <div className="text-center mb-16">
                            <span className="text-xs font-bold text-[#A855F7] uppercase tracking-widest">Testimonials</span>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-white mt-3 mb-4 tracking-tight">Loved by thousands of<br /><span className="bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] bg-clip-text text-transparent">smart spenders</span></h2>
                        </div>
                    </AnimatedSection>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {TESTIMONIALS.map((t, i) => (
                            <div key={t.name}>
                                <AnimatedSection delay={i * 100}>
                                    <div className="p-7 rounded-2xl bg-[#111320]/80 border border-white/[0.06] hover:border-white/[0.12] transition-all h-full flex flex-col">
                                        <div className="flex items-center space-x-1 mb-4">
                                            {Array.from({ length: t.rating }).map((_, j) => (
                                                <Star key={j} weight="fill" className="w-4 h-4 text-[#FBBF24]" />
                                            ))}
                                        </div>
                                        <p className="text-sm text-[#C4D0E0] leading-relaxed flex-1 mb-6">"{t.text}"</p>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6C5CE7] to-[#A855F7] flex items-center justify-center text-white text-xs font-bold">
                                                {t.avatar}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white">{t.name}</p>
                                                <p className="text-xs text-[#8B95A7]">{t.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                </AnimatedSection>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Pricing ─── */}
            <section id="pricing" className="py-28 px-6 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#7C3AED]/[0.03] to-transparent pointer-events-none" />
                <div className="max-w-6xl mx-auto relative z-10">
                    <AnimatedSection>
                        <div className="text-center mb-16">
                            <span className="text-xs font-bold text-[#A855F7] uppercase tracking-widest">Pricing</span>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-white mt-3 mb-4 tracking-tight">Simple, transparent<br /><span className="bg-gradient-to-r from-[#6C5CE7] to-[#A855F7] bg-clip-text text-transparent">pricing</span></h2>
                            <p className="text-[#8B95A7] text-lg max-w-xl mx-auto">Start free, upgrade when you're ready. No hidden fees, cancel anytime.</p>
                        </div>
                    </AnimatedSection>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                        {PRICING.map((p, i) => (
                            <div key={p.name}>
                                <AnimatedSection delay={i * 100}>
                                    <div className={`rounded-2xl p-7 border transition-all h-full flex flex-col ${p.highlighted
                                        ? 'bg-gradient-to-b from-[#1a1040] to-[#111320] border-[#7C3AED]/40 shadow-xl shadow-purple-900/20 relative'
                                        : 'bg-[#111320]/80 border-white/[0.06] hover:border-white/[0.12]'
                                        }`}>
                                        {p.highlighted && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white" style={{ background: 'linear-gradient(135deg, #6C5CE7 0%, #A855F7 100%)' }}>
                                                Most Popular
                                            </div>
                                        )}
                                        <h3 className="text-lg font-bold text-white mb-1">{p.name}</h3>
                                        <p className="text-xs text-[#8B95A7] mb-5">{p.desc}</p>
                                        <div className="flex items-baseline space-x-1 mb-6">
                                            <span className="text-4xl font-extrabold text-white">{p.price}</span>
                                            <span className="text-sm text-[#8B95A7] font-medium">{p.period}</span>
                                        </div>
                                        <ul className="space-y-3 mb-8 flex-1">
                                            {p.features.map(f => (
                                                <li key={f} className="flex items-start space-x-3 text-sm">
                                                    <Check weight="bold" className={`w-4 h-4 mt-0.5 flex-shrink-0 ${p.highlighted ? 'text-[#A855F7]' : 'text-[#00D68F]'}`} />
                                                    <span className="text-[#C4D0E0]">{f}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <button
                                            onClick={onEnterApp}
                                            className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] ${p.highlighted
                                                ? 'text-white shadow-lg shadow-purple-500/20'
                                                : 'text-white border border-white/[0.08] hover:border-[#7C3AED]/40 hover:bg-white/[0.02]'
                                                }`}
                                            style={p.highlighted ? { background: 'linear-gradient(135deg, #6C5CE7 0%, #A855F7 100%)' } : {}}
                                        >
                                            {p.cta}
                                        </button>
                                    </div>
                                </AnimatedSection>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Final CTA ─── */}
            <section className="py-28 px-6">
                <AnimatedSection>
                    <div className="max-w-4xl mx-auto text-center relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#6C5CE7]/10 via-[#A855F7]/10 to-[#6C5CE7]/10 rounded-3xl blur-3xl" />
                        <div className="relative bg-[#111320]/80 border border-white/[0.06] rounded-3xl p-12 md:p-16">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Ready to take control<br />of your finances?</h2>
                            <p className="text-[#8B95A7] text-lg mb-8 max-w-lg mx-auto">Join thousands of users who've transformed their financial life with CoinTrack. Start free, no credit card required.</p>
                            <button
                                onClick={onEnterApp}
                                className="group px-10 py-4 rounded-2xl text-base font-bold text-white transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 inline-flex items-center space-x-3"
                                style={{ background: 'linear-gradient(135deg, #6C5CE7 0%, #A855F7 100%)' }}
                            >
                                <span>Get Started — It's Free</span>
                                <ArrowRight weight="bold" className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </AnimatedSection>
            </section>

            {/* ─── Footer ─── */}
            <footer className="border-t border-white/[0.06] py-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
                        <div>
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="bg-gradient-to-br from-[#6C5CE7] to-[#A855F7] p-2 rounded-xl">
                                    <TrendUp weight="bold" className="text-white w-4 h-4" />
                                </div>
                                <span className="text-lg font-bold">CoinTrack</span>
                            </div>
                            <p className="text-sm text-[#8B95A7] leading-relaxed">The modern finance tracker for people who care about their money — and their time.</p>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-[#8B95A7] uppercase tracking-wider mb-4">Product</h4>
                            <ul className="space-y-2.5">
                                {['Features', 'Pricing', 'Changelog', 'Roadmap'].map(l => (
                                    <li key={l}><a href="#" className="text-sm text-[#4B5568] hover:text-white transition-colors">{l}</a></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-[#8B95A7] uppercase tracking-wider mb-4">Company</h4>
                            <ul className="space-y-2.5">
                                {['About', 'Blog', 'Careers', 'Contact'].map(l => (
                                    <li key={l}><a href="#" className="text-sm text-[#4B5568] hover:text-white transition-colors">{l}</a></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-[#8B95A7] uppercase tracking-wider mb-4">Legal</h4>
                            <ul className="space-y-2.5">
                                {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'].map(l => (
                                    <li key={l}><a href="#" className="text-sm text-[#4B5568] hover:text-white transition-colors">{l}</a></li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-white/[0.06] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-xs text-[#4B5568]">© 2026 CoinTrack. All rights reserved.</p>
                        <div className="flex items-center space-x-4">
                            {['Twitter', 'GitHub', 'LinkedIn'].map(s => (
                                <a key={s} href="#" className="text-xs text-[#4B5568] hover:text-[#A78BFA] transition-colors font-medium">{s}</a>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
