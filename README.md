# Portfolio Generator

A modern web application that converts resumes into beautiful, professional portfolios.

## 🚀 Live Demo

Visit: [https://portfoliogenerator.com](https://portfoliogenerator.com)

## ✨ Features

- **Resume Upload & Parsing**: Upload PDF/DOC/DOCX files and automatically extract portfolio data
- **Live Preview**: Real-time portfolio preview with editing capabilities
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Custom Domains**: Get personalized subdomains (e.g., yourname.portfoliogenerator.com)
- **One-Click Deployment**: Deploy your portfolio live with a single click
- **Modern UI**: Clean, professional design with smooth animations

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **Routing**: React Router
- **UI Components**: Radix UI, Lucide Icons
- **Deployment**: Netlify/Vercel ready

## 🏃‍♂️ Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:8080
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components
│   ├── portfolio/      # Portfolio-specific components
│   └── ResumeUpload.tsx
├── pages/              # Route components
│   ├── Index.tsx       # Home page
│   ├── Preview.tsx     # Portfolio preview
│   └── Dashboard.tsx   # User dashboard
└── main.tsx           # App entry point
```

## 🚀 Deployment

### Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy!

### Vercel
1. Import your GitHub repository
2. Framework preset: Vite
3. Deploy!

## 🔧 Environment Variables

```env
VITE_APP_URL=https://portfoliogenerator.com
VITE_PORTFOLIO_DOMAIN=portfoliogenerator.com
```

## 📝 License

MIT License - feel free to use this project for your own portfolio generator!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.