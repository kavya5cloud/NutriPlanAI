import React, { useState, useEffect } from 'react';
import { Recipe, UserPreferences } from '../types';
import { Clock, Flame, ChevronDown, ChevronUp, Share2, Check, Heart, Search, ArrowLeftRight, Loader2 } from 'lucide-react';
import { getIngredientSubstitutions } from '../services/geminiService';

interface Props {
  recipe: Recipe;
  type: string;
}

export const RecipeCard: React.FC<Props> = ({ recipe, type }) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Substitution States
  const [activeSubIndex, setActiveSubIndex] = useState<number | null>(null);
  const [loadingSub, setLoadingSub] = useState(false);
  const [substitutionsCache, setSubstitutionsCache] = useState<Record<number, string[]>>({});

  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('nutriplan_favorites');
      if (savedFavorites) {
        const favorites: Recipe[] = JSON.parse(savedFavorites);
        if (favorites.some(r => r.name === recipe.name)) {
          setIsFavorite(true);
        }
      }
    } catch (e) {
      console.error("Error loading favorites", e);
    }
  }, [recipe.name]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const savedFavorites = localStorage.getItem('nutriplan_favorites');
      let favorites: Recipe[] = savedFavorites ? JSON.parse(savedFavorites) : [];
      
      if (isFavorite) {
        // Remove
        favorites = favorites.filter(r => r.name !== recipe.name);
        setIsFavorite(false);
      } else {
        // Add
        // Avoid duplicates if multiple cards with same name exist
        if (!favorites.some(r => r.name === recipe.name)) {
           favorites.push(recipe);
        }
        setIsFavorite(true);
      }
      localStorage.setItem('nutriplan_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error("Error saving favorite", e);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Create deep link
    let shareUrl = window.location.origin;
    try {
        const encodedRecipe = btoa(unescape(encodeURIComponent(JSON.stringify(recipe))));
        shareUrl = `${window.location.origin}?r=${encodedRecipe}`;
    } catch (err) {
        console.error("Failed to encode recipe", err);
    }

    const text = `🍽️ ${recipe.name} (${type})\n\n🔥 ${recipe.calories} kcal | ⏱️ ${recipe.prepTime}\n💪 P: ${recipe.protein} | C: ${recipe.carbs} | F: ${recipe.fat}\n\n🛒 Ingredients:\n${recipe.ingredients.map(i => `• ${i}`).join('\n')}\n\n👩‍🍳 Instructions:\n${recipe.instructions.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n🔗 Open in NutriPlan AI:\n${shareUrl}\n\n#NutriPlanAI`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Recipe: ${recipe.name}`,
          text: text,
          url: shareUrl
        });
      } catch (err) {
        // Share cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
  };

  const getIngredientSearchUrl = (ing: string) => {
    // Simple heuristic to strip quantity/units for better search results
    // e.g. "2 cups chopped onions" -> "chopped onions"
    const term = ing.replace(/^[\d\s\u00BC-\u00BE\u2150-\u215E/.-]+(g|oz|lbs?|kgs?|ml|l|cups?|tbsp|tsp|slices?|pieces?|cans?|jars?|cloves?|pinches?|bunches?)s?\s+/i, '')
                    .replace(/^[\d\s\u00BC-\u00BE\u2150-\u215E/.-]+/, '') // Strip remaining numbers
                    .trim();
    return `https://www.google.com/search?q=nutrition+facts+${encodeURIComponent(term)}`;
  };

  const handleSubstitute = async (e: React.MouseEvent, ing: string, index: number) => {
    e.stopPropagation();
    
    // Toggle off if already open
    if (activeSubIndex === index) {
      setActiveSubIndex(null);
      return;
    }

    setActiveSubIndex(index);

    // Check cache
    if (substitutionsCache[index]) {
      return;
    }

    setLoadingSub(true);
    try {
      // Get User Prefs for better suggestions
      let diet = '';
      let allergies = '';
      try {
        const savedPrefs = localStorage.getItem('nutriplan_user_prefs');
        if (savedPrefs) {
          const prefs: UserPreferences = JSON.parse(savedPrefs);
          diet = prefs.diet;
          allergies = prefs.allergies;
        }
      } catch (err) {
        console.warn("Could not load user prefs for substitution");
      }

      const subs = await getIngredientSubstitutions(ing, recipe.name, diet, allergies);
      setSubstitutionsCache(prev => ({ ...prev, [index]: subs }));
    } catch (err) {
      console.error("Failed to get substitutions", err);
    } finally {
      setLoadingSub(false);
    }
  };

  return (
    <div 
      className={`
        bg-white rounded-xl border-2 border-slate-900 
        transition-all duration-200 overflow-hidden
        ${expanded ? 'shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] translate-x-[2px] translate-y-[2px]' : 'shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]'}
      `}
    >
      <div className="p-5 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex justify-between items-start">
          <div className="flex-1 pr-4">
            <span className="inline-block px-3 py-1 text-sm font-bold text-slate-900 bg-emerald-200 border border-slate-900 rounded-md mb-2 rotate-[-1deg]">
              {type}
            </span>
            <h3 className="font-bold text-2xl text-slate-900 leading-tight">{recipe.name}</h3>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={toggleFavorite}
              className={`
                p-1.5 rounded border-2 border-slate-900 transition-colors group relative
                ${isFavorite ? 'bg-rose-100 hover:bg-rose-200' : 'bg-slate-100 hover:bg-rose-100'}
              `}
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              <Heart 
                size={20} 
                className={`transition-all duration-300 ${isFavorite ? 'fill-rose-500 text-rose-500 scale-110' : 'text-slate-900 scale-100'}`} 
              />
            </button>
            <button 
              onClick={handleShare}
              className="bg-slate-100 p-1.5 rounded border-2 border-slate-900 hover:bg-blue-100 transition-colors group relative"
              title="Share Recipe"
            >
              {copied ? <Check size={20} className="text-emerald-600" /> : <Share2 size={20} className="text-slate-900" />}
              {copied && (
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1 px-2 rounded font-bold whitespace-nowrap animate-in fade-in zoom-in duration-200 z-10">
                  Copied!
                </span>
              )}
            </button>
            <div className="bg-slate-100 p-1.5 rounded border-2 border-slate-900">
              {expanded ? <ChevronUp className="text-slate-900" size={20} /> : <ChevronDown className="text-slate-900" size={20} />}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mt-4 text-slate-600 font-medium">
          <div className="flex items-center gap-1.5">
            <Flame size={20} className="text-orange-500 fill-orange-500" />
            <span>{recipe.calories} kcal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={20} className="text-blue-500 fill-blue-500" />
            <span>{recipe.prepTime}</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-sm font-bold text-slate-700">
           <span className="bg-orange-100 px-2 py-1 rounded border-2 border-slate-900">P: {recipe.protein}</span>
           <span className="bg-blue-100 px-2 py-1 rounded border-2 border-slate-900">C: {recipe.carbs}</span>
           <span className="bg-yellow-100 px-2 py-1 rounded border-2 border-slate-900">F: {recipe.fat}</span>
        </div>
      </div>

      {expanded && (
        <div className="px-5 pb-5 border-t-2 border-slate-900 bg-slate-50 relative">
          {/* Decorative doodle lines */}
          <div className="absolute top-0 left-0 w-full h-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMTBRNSAwIDEwIDBRMTUgMCAyMCAxMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTRhM2I4IiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=')] opacity-20"></div>

          <div className="mt-4">
            <h4 className="font-bold text-lg text-slate-900 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-900"></span> Ingredients
            </h4>
            <ul className="list-none text-base text-slate-700 space-y-1 ml-1">
              {recipe.ingredients.map((ing, idx) => (
                <li key={idx} className="flex flex-col border-b border-dashed border-slate-200 last:border-0 hover:bg-slate-100/50 rounded px-1 transition-colors relative">
                  <div className="flex justify-between items-center group py-1">
                    <div className="flex gap-2 items-start text-slate-700 leading-snug">
                      <span className="text-slate-400 mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0"></span>
                      <span>{ing}</span>
                    </div>
                    
                    <div className="flex gap-2 ml-2">
                       {/* Substitute Button */}
                       <button
                        onClick={(e) => handleSubstitute(e, ing, idx)}
                        className={`
                          opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 transition-all duration-200 flex items-center justify-center w-7 h-7 bg-white text-slate-500 border border-slate-300 rounded-md hover:bg-indigo-100 hover:text-indigo-700 hover:border-indigo-300 hover:scale-105 shadow-sm
                          ${activeSubIndex === idx ? 'opacity-100 bg-indigo-100 text-indigo-700 border-indigo-300' : ''}
                        `}
                        title="Find Substitutions"
                      >
                        <ArrowLeftRight size={14} />
                      </button>

                      {/* External Link for Nutrition Info */}
                      <a 
                        href={getIngredientSearchUrl(ing)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 transition-all duration-200 flex items-center gap-1.5 text-[10px] font-bold bg-white text-slate-500 border border-slate-300 px-2 py-1 rounded-md hover:bg-emerald-100 hover:text-emerald-700 hover:border-emerald-300 hover:scale-105 shadow-sm"
                        title="View approximate nutritional info"
                      >
                        <Search size={12} />
                        <span className="hidden xs:inline">INFO</span>
                      </a>
                    </div>
                  </div>

                  {/* Substitutions Dropdown/Panel */}
                  {activeSubIndex === idx && (
                    <div className="mb-2 ml-4 animate-in fade-in slide-in-from-top-1 duration-200">
                      <div className="bg-white border-2 border-slate-900 rounded-lg p-3 shadow-[4px_4px_0px_0px_rgba(15,23,42,0.1)] relative">
                        {/* Little triangle arrow */}
                        <div className="absolute -top-2 left-6 w-3 h-3 bg-white border-l-2 border-t-2 border-slate-900 transform rotate-45"></div>
                        
                        <h5 className="font-bold text-xs uppercase text-slate-400 mb-2 tracking-wider">Substitutes</h5>
                        
                        {loadingSub && !substitutionsCache[idx] ? (
                          <div className="flex items-center gap-2 text-slate-500 text-sm">
                            <Loader2 size={16} className="animate-spin" />
                            <span>Asking the chef...</span>
                          </div>
                        ) : substitutionsCache[idx] && substitutionsCache[idx].length > 0 ? (
                          <ul className="space-y-1">
                            {substitutionsCache[idx].map((sub, sIdx) => (
                              <li key={sIdx} className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                                {sub}
                              </li>
                            ))}
                          </ul>
                        ) : (
                           <div className="text-sm text-slate-500 italic">No substitutions found.</div>
                        )}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6">
            <h4 className="font-bold text-lg text-slate-900 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-900"></span> Instructions
            </h4>
            <ol className="list-decimal list-inside text-base text-slate-700 space-y-3 font-medium">
              {recipe.instructions.map((step, idx) => (
                <li key={idx} className="pl-1 leading-relaxed">
                   <span className="">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-8 pt-6 border-t-2 border-dashed border-slate-200 flex justify-center">
             <button
                onClick={handleShare}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-100 hover:bg-blue-200 text-slate-900 font-bold py-3 px-8 rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all group"
              >
                {copied ? <Check size={20} className="text-emerald-600" /> : <Share2 size={20} className="group-hover:rotate-12 transition-transform" />}
                {copied ? "Link Copied!" : "Share Recipe"}
              </button>
          </div>
        </div>
      )}
    </div>
  );
};