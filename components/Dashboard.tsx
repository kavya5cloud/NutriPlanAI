import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, Apple, UtensilsCrossed, TrendingUp } from 'lucide-react';

const mockData = [
  { name: 'Mon', calories: 2100 },
  { name: 'Tue', calories: 1950 },
  { name: 'Wed', calories: 2200 },
  { name: 'Thu', calories: 1800 },
  { name: 'Fri', calories: 2400 },
  { name: 'Sat', calories: 2150 },
  { name: 'Sun', calories: 2000 },
];

export const Dashboard: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 pb-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-emerald-500 rounded-2xl p-6 text-white border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] relative overflow-hidden group hover:-translate-y-1 transition-transform">
           {/* Doodle decoration */}
           <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/20 rounded-full border-2 border-slate-900 border-dashed"></div>

           <div className="flex justify-between items-start mb-4 relative z-10">
             <div className="p-2 bg-white text-slate-900 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">
                <Activity size={24} />
             </div>
             <span className="text-sm font-bold bg-slate-900 text-white px-2 py-1 rounded border border-white/50 -rotate-2">Today</span>
           </div>
           <h3 className="text-4xl font-bold mb-1 relative z-10">1,840</h3>
           <p className="text-emerald-100 font-bold text-lg relative z-10">Calories consumed</p>
           <div className="mt-4 w-full bg-black/20 rounded-full h-3 border border-slate-900 overflow-hidden relative z-10">
             <div className="bg-white h-full rounded-full border-r border-slate-900" style={{width: '75%'}}></div>
           </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 transition-transform">
           <div className="flex justify-between items-start mb-4">
             <div className="p-2 bg-orange-100 text-orange-600 rounded-lg border-2 border-slate-900">
                <UtensilsCrossed size={24} />
             </div>
           </div>
           <h3 className="text-4xl font-bold text-slate-900 mb-1">3</h3>
           <p className="text-slate-500 font-bold text-lg">Meals planned</p>
        </div>

         <div className="bg-white rounded-2xl p-6 border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 transition-transform">
           <div className="flex justify-between items-start mb-4">
             <div className="p-2 bg-blue-100 text-blue-600 rounded-lg border-2 border-slate-900">
                <Apple size={24} />
             </div>
           </div>
           <h3 className="text-4xl font-bold text-slate-900 mb-1">92g</h3>
           <p className="text-slate-500 font-bold text-lg">Protein intake</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
           <div className="flex items-center gap-2 mb-6">
             <TrendingUp size={24} className="text-slate-900" />
             <h3 className="text-2xl font-bold text-slate-900">Weekly Trend</h3>
           </div>
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={mockData}>
                 <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#0f172a', fontSize: 14, fontFamily: 'Patrick Hand'}} 
                    dy={10} 
                  />
                 <YAxis hide />
                 <Tooltip 
                    cursor={{fill: '#f1f5f9', radius: 4}} 
                    contentStyle={{
                      borderRadius: '8px', 
                      border: '2px solid #0f172a', 
                      boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
                      fontFamily: 'Patrick Hand',
                      fontWeight: 'bold'
                    }}
                 />
                 <Bar dataKey="calories" radius={[4, 4, 4, 4]}>
                    {mockData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === 6 ? '#10b981' : '#cbd5e1'} 
                        stroke="#0f172a"
                        strokeWidth={2}
                      />
                    ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] relative">
          <div className="absolute top-4 right-4 text-yellow-400 transform rotate-12">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" stroke="#0f172a" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-6 border-b-2 border-slate-100 pb-2">Quick Tips</h3>
          <ul className="space-y-4">
            {[
              "Drink 500ml of water before your next meal.",
              "Swap white rice for cauliflower rice.",
              "Add a handful of spinach to your smoothie.",
              "Eat slowly to improve satiety."
            ].map((tip, i) => (
              <li key={i} className="flex gap-4 text-lg text-slate-700 items-start group">
                <span className="w-6 h-6 rounded-full bg-emerald-200 border-2 border-slate-900 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5 group-hover:bg-emerald-400 transition-colors">
                  {i + 1}
                </span>
                <span className="leading-snug">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};