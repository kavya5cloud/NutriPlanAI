import React, { useState, useEffect } from 'react';
import { AppView, Recipe } from './types';
import { Dashboard } from './components/Dashboard';
import { MealPlanner } from './components/MealPlanner';
import { FridgeChef } from './components/FridgeChef';
import { ChatCoach } from './components/ChatCoach';
import { LandingPage } from './components/LandingPage';
import { OnboardingTour, TourStep } from './components/OnboardingTour';
import { 
  LayoutDashboard, 
  Utensils, 
  ChefHat, 
  MessageSquareHeart, 
  Menu,
  X
} from 'lucide-react';

const TOUR_STORAGE_KEY = 'nutriplan_tour_completed';

const TOUR_STEPS: TourStep[] = [
  {
    title: "Welcome to NutriPlan!",
    description: "I'm your AI wellness buddy. Let me show you around your new kitchen workspace.",
    targetView: AppView.DASHBOARD
  },
  {
    title: "Plan Your Day",
    description: "Tell us what you like to eat, and we'll sketch out a perfect full-day meal plan in seconds.",
    targetView: AppView.MEAL_PLANNER
  },
  {
    title: "Empty Fridge?",
    description: "Take a photo of your ingredients. I'll recognize them and suggest recipes instantly!",
    targetView: AppView.FRIDGE_CHEF
  },
  {
    title: "Chat with Coach",
    description: "Have questions about macros or diet? Chat with me anytime for science-backed advice.",
    targetView: AppView.CHAT_COACH
  },
  {
    title: "You're All Set!",
    description: "That's the basics. Start exploring and let's make healthy eating fun again!",
    targetView: AppView.DASHBOARD
  }
];

const App: React.FC = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sharedRecipe, setSharedRecipe] = useState<Recipe | null>(null);

  // Tour State
  const [isTourActive, setIsTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  // Check for shared recipe in URL on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const recipeParam = params.get('r');
    
    if (recipeParam) {
      try {
        const json = decodeURIComponent(escape(atob(recipeParam)));
        const recipe = JSON.parse(json);
        setSharedRecipe(recipe);
        setCurrentView(AppView.MEAL_PLANNER);
        setShowLanding(false);
        // Don't show tour if coming from a shared link
        localStorage.setItem(TOUR_STORAGE_KEY, 'true');
        // Clean up URL without refreshing
        window.history.replaceState({}, '', window.location.pathname);
      } catch (e) {
        console.error("Failed to parse shared recipe", e);
      }
    }
  }, []);

  const startApp = () => {
    setShowLanding(false);
    
    // Check if tour has been completed
    const tourCompleted = localStorage.getItem(TOUR_STORAGE_KEY);
    if (!tourCompleted) {
      setIsTourActive(true);
    }
  };

  const handleTourNext = () => {
    const nextStep = tourStep + 1;
    if (nextStep < TOUR_STEPS.length) {
      setTourStep(nextStep);
      // Auto-navigate to the relevant view for the tour step
      if (TOUR_STEPS[nextStep].targetView) {
        setCurrentView(TOUR_STEPS[nextStep].targetView as AppView);
      }
    } else {
      completeTour();
    }
  };

  const completeTour = () => {
    setIsTourActive(false);
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    setTourStep(0);
    setCurrentView(AppView.DASHBOARD);
  };

  const navItems = [
    { view: AppView.DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
    { view: AppView.MEAL_PLANNER, label: "Meal Planner", icon: Utensils },
    { view: AppView.FRIDGE_CHEF, label: "Fridge Chef", icon: ChefHat },
    { view: AppView.CHAT_COACH, label: "Coach", icon: MessageSquareHeart },
  ];

  const renderView = () => {
    switch(currentView) {
      case AppView.DASHBOARD: return <Dashboard />;
      case AppView.MEAL_PLANNER: return <MealPlanner initialSharedRecipe={sharedRecipe} />;
      case AppView.FRIDGE_CHEF: return <FridgeChef />;
      case AppView.CHAT_COACH: return <ChatCoach />;
      default: return <Dashboard />;
    }
  };

  if (showLanding) {
    return <LandingPage onStart={startApp} />;
  }

  return (
    <div className="min-h-screen flex animate-in fade-in duration-500 relative">
      
      {/* Onboarding Tour Overlay */}
      {isTourActive && (
        <OnboardingTour 
          step={tourStep}
          totalSteps={TOUR_STEPS.length}
          currentStepData={TOUR_STEPS[tourStep]}
          onNext={handleTourNext}
          onSkip={completeTour}
        />
      )}

      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r-2 border-slate-900 h-screen sticky top-0 z-10">
        <div className="p-6">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowLanding(true)}>
            <div className="w-10 h-10 bg-emerald-500 rounded-lg border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] flex items-center justify-center text-white font-bold text-xl rotate-3">
              N
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">NutriPlan AI</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-3">
          {navItems.map(item => (
            <button
              key={item.view}
              onClick={() => setCurrentView(item.view)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 font-bold text-lg transition-all ${
                currentView === item.view 
                  ? 'bg-emerald-100 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] -translate-y-1' 
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <item.icon size={24} strokeWidth={2.5} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6">
          <div className="bg-indigo-500 rounded-xl p-4 text-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            <h4 className="font-bold text-lg mb-1">Pro Plan</h4>
            <p className="text-indigo-100 mb-3 leading-tight">Get advanced macro tracking and more sketches.</p>
            <button className="w-full py-2 bg-white text-indigo-600 rounded-lg text-sm font-bold border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
              UPGRADE NOW
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b-2 border-slate-900 p-4 flex justify-between items-center sticky top-0 z-50">
           <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowLanding(true)}>
            <div className="w-8 h-8 bg-emerald-500 rounded border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] flex items-center justify-center text-white font-bold rotate-[-2deg]">
              N
            </div>
            <span className="font-bold text-xl text-slate-900">NutriPlan AI</span>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-900">
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </header>

        {/* Mobile Nav Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
             <div className="absolute right-0 top-0 h-full w-72 bg-[#fdfbf7] border-l-2 border-slate-900 p-4 pt-20 space-y-3" onClick={e => e.stopPropagation()}>
                {navItems.map(item => (
                  <button
                    key={item.view}
                    onClick={() => {
                      setCurrentView(item.view);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 font-bold text-lg transition-all ${
                      currentView === item.view 
                        ? 'bg-emerald-100 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]' 
                        : 'border-transparent text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <item.icon size={24} />
                    {item.label}
                  </button>
                ))}
             </div>
          </div>
        )}

        <div className="flex-1 overflow-auto">
          {renderView()}
        </div>
      </main>

      {/* Bottom Nav Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-slate-900 px-6 py-2 flex justify-between items-center z-30 pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        {navItems.map(item => (
          <button
            key={item.view}
            onClick={() => setCurrentView(item.view)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              currentView === item.view ? 'text-emerald-600' : 'text-slate-400'
            }`}
          >
            <item.icon size={24} strokeWidth={currentView === item.view ? 3 : 2} />
            <span className="text-[12px] font-bold">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
