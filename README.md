#Nutriplan-AI
AI-powered nutrition planner built using React, TypeScript, Vite, and Google GenAI.
Nutriplan-AI helps users generate personalized nutrition plans, meal recommendations, and diet breakdowns using the Google GenAI API, paired with a clean & interactive UI built with Recharts, Lucide Icons, and React Markdown.

#Features
🔹 AI-Powered Nutrition Generation
Uses @google/genai for creating meal plans
Supports custom prompts & personalised inputs
🔹 Interactive UI Components
Beautiful charts powered by Recharts
Clean icon set using Lucide-react
🔹 Markdown Rendering
Renders AI output beautifully using react-markdown
🔹 Fast & Modern Stack
⚡ Built with Vite for lightning-fast builds
🧩 Written in TypeScript
🎨 React components organized in /components
📦 Tech Stack

Technology	Purpose

React 19	Frontend UI
Vite 6	  Bundler & Dev Server
TypeScript Type safety
@google/genai	AI text generation
Recharts	Data visualization
Lucide-react	Icons
React Markdown	Render AI responses
📁 Project Structure
nutriplan-ai/
│
├── App.tsx
├── index.tsx
├── index.html
├── constants.ts
├── types.ts
├── metadata.json
├── vite.config.ts
│
├── components/
├── services/
└── README.md
🛠️ Installation & Setup
1. Install dependencies
npm install
2. Start development server
npm run dev
Your app runs at:
👉 http://localhost:5173
3. Build for production
npm run build
4. Preview production build
npm run preview
🔑 Environment Variables
Create a .env file in the project root:
VITE_GOOGLE_GENAI_API_KEY=your_api_key_here
🚀 Deployment
This project can be deployed on:
Vercel (recommended)
Netlify
GitHub Pages (needs base config)
For Vercel, no config needed:
Just import the repo → auto-detects Vite → Deploy.
🤝 Contributing
Pull requests are welcome. If you want to make major changes, please open an issue first to discuss the change.
📄 License
This project is private and not licensed for external use unless explicitly permitted.

