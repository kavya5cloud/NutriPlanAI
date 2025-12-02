import React from 'react';
import { ArrowRight, ChefHat, MessageSquareHeart, Utensils, Sparkles } from 'lucide-react';

interface Props {
  onStart: () => void;
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  accent: string;
}

export const LandingPage: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="min-h-screen text-slate-900 font-['Patrick_Hand'] overflow-x-hidden">
        {/* Navbar */}
        <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-20">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-lg border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] flex items-center justify-center text-white font-bold text-xl rotate-3">
                  N
                </div>
                <span className="text-2xl font-bold tracking-tight">NutriPlan AI</span>
            </div>
            <button 
                onClick={onStart}
                className="text-lg font-bold hover:underline decoration-2 underline-offset-4 decoration-emerald-500"
            >
                Log In
            </button>
        </nav>

        {/* Hero */}
        <header className="max-w-5xl mx-auto px-6 pt-10 md:pt-16 pb-24 text-center relative z-10">
            {/* Decorative Doodles */}
            <div className="absolute top-10 left-10 hidden lg:block animate-bounce duration-[3000ms]">
                <Sparkles size={48} className="text-yellow-400 fill-yellow-100" />
            </div>
             <div className="absolute top-20 right-20 hidden lg:block rotate-12 opacity-80">
                <svg width="60" height="60" viewBox="0 0 100 100" className="text-blue-400">
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="10 5" />
                </svg>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] mb-8 relative z-10">
                Eat Healthy.<br/>
                <span className="text-emerald-600 relative inline-block transform -rotate-2 mt-2">
                    Start Doodling.
                    <svg className="absolute w-[110%] h-4 -bottom-2 -left-[5%] text-yellow-400 pointer-events-none" viewBox="0 0 100 10" preserveAspectRatio="none">
                         <path d="M0 5 Q 50 15 100 5" stroke="currentColor" strokeWidth="8" fill="none" opacity="0.6" strokeLinecap="round" />
                    </svg>
                </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
                The most fun way to plan meals, scan your fridge, and chat with an AI nutritionist. No boring spreadsheets allowed.
            </p>
            
            <button 
                onClick={onStart}
                className="group relative inline-flex items-center gap-3 bg-emerald-500 text-white text-2xl font-bold py-4 px-10 rounded-2xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] active:shadow-none active:translate-x-[6px] active:translate-y-[6px] transition-all"
            >
                Get Started Free
                <ArrowRight className="group-hover:translate-x-1 transition-transform" strokeWidth={3} />
            </button>

            {/* Hero Image Representation */}
             <div className="mt-20 relative max-w-4xl mx-auto">
                 <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] aspect-video overflow-hidden flex items-center justify-center bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
                     <div className="text-center p-8 w-full h-full flex flex-col items-center justify-center relative">
                        {/* Abstract Interface Doodle */}
                         <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
                         
                         <div className="flex gap-6 justify-center mb-8 relative z-10">
                             <div className="w-24 h-24 bg-orange-100 rounded-2xl border-2 border-slate-900 flex items-center justify-center rotate-[-6deg] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-transform hover:scale-110">
                                 <Utensils size={40} className="text-orange-600" />
                             </div>
                              <div className="w-24 h-24 bg-blue-100 rounded-2xl border-2 border-slate-900 flex items-center justify-center rotate-[6deg] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] mt-8 transition-transform hover:scale-110">
                                 <ChefHat size={40} className="text-blue-600" />
                             </div>
                              <div className="w-24 h-24 bg-emerald-100 rounded-2xl border-2 border-slate-900 flex items-center justify-center rotate-[-3deg] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-transform hover:scale-110">
                                 <MessageSquareHeart size={40} className="text-emerald-600" />
                             </div>
                         </div>
                         <p className="text-3xl md:text-4xl font-bold text-slate-400 transform rotate-[-2deg]">"It's like magic, but with food!"</p>
                     </div>
                 </div>
                 
                 {/* Decorative elements behind container */}
                 <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full bg-slate-900 rounded-3xl opacity-10"></div>
             </div>
        </header>

        {/* Features */}
        <section className="bg-white py-24 border-t-2 border-slate-900 border-b-2 relative overflow-hidden">
             {/* Background Pattern */}
            <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none" style={{backgroundImage: 'radial-gradient(#cbd5e1 1.5px, transparent 1.5px)', backgroundSize: '24px 24px'}}></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <span className="bg-yellow-100 border-2 border-slate-900 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider mb-4 inline-block shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">Features</span>
                    <h2 className="text-4xl md:text-5xl font-bold relative inline-block">
                        What's in the Box?
                        <div className="absolute -right-8 -top-8 text-emerald-500 animate-pulse">
                            <Sparkles size={32} />
                        </div>
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard 
                        icon={<Utensils size={32} />}
                        title="Meal Planner"
                        description="Tell us your diet, we'll draw up the plan. Keto, Vegan, Paleo? We got you covered for the whole day."
                        color="bg-orange-100"
                        accent="text-orange-600"
                    />
                    <FeatureCard 
                        icon={<ChefHat size={32} />}
                        title="Fridge Chef"
                        description="Snap a photo of your sad fridge. We'll recognize ingredients and turn leftovers into 5-star meals."
                        color="bg-blue-100"
                        accent="text-blue-600"
                    />
                     <FeatureCard 
                        icon={<MessageSquareHeart size={32} />}
                        title="AI Coach"
                        description="Chat with your supportive doodle friend. No judgment, just healthy vibes and solid advice."
                        color="bg-emerald-100"
                        accent="text-emerald-600"
                    />
                </div>
            </div>
        </section>

        {/* Footer */}
        <footer className="py-12 text-center text-slate-500 font-bold relative">
            <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 via-emerald-400 to-blue-400 opacity-50"></div>
            <p className="mb-4">© {new Date().getFullYear()} NutriPlan AI.</p>
            <p className="text-sm opacity-60">Made with 💚 and lots of coffee.</p>
        </footer>
    </div>
  );
};

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, color, accent }) => (
    <div className="bg-[#fdfbf7] p-8 rounded-2xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-2 transition-transform duration-300">
        <div className={`w-16 h-16 ${color} ${accent} rounded-xl border-2 border-slate-900 flex items-center justify-center mb-6 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]`}>
            {icon}
        </div>
        <h3 className="text-2xl font-bold mb-3 text-slate-900">{title}</h3>
        <p className="text-lg text-slate-600 leading-relaxed font-medium">{description}</p>
    </div>
);
