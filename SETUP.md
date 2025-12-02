# Portfolio Website Generator - Setup Guide

## Features Implemented

✅ **Dashboard Page**: Users can view, manage, and delete their uploaded resumes and portfolios
✅ **Functional Deploy Button**: Instantly triggers portfolio deployment and provides live website URL
✅ **Resume Parsing**: Automatically extracts and displays professional information from uploaded resumes
✅ **Portfolio Generation**: Creates complete portfolio websites with all resume details
✅ **Edit Functionality**: Users can modify portfolio information through inline editing
✅ **Live Deployment**: Portfolios are deployed to unique subdomains (e.g., `username.portfoliogen.app`)

## Quick Start

1. **Install Dependencies**
```bash
npm install
```

2. **Set up Supabase**
- Create a new Supabase project
- Copy your project URL and anon key to `.env.local`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. **Run Database Migrations**
```bash
npx supabase db push
```

4. **Start Development Server**
```bash
npm run dev
```

## How It Works

### 1. Resume Upload & Parsing
- Users upload PDF/DOCX resumes (max 10MB)
- AI-powered parsing extracts:
  - Personal information (name, title, contact)
  - Professional summary
  - Skills and technologies
  - Work experience with achievements
  - Projects with metrics
  - Education and certifications

### 2. Portfolio Generation
- Automatically creates responsive portfolio website
- Includes sections: Hero, About, Skills, Projects, Experience, Contact
- Mobile-first design with professional styling
- SEO-optimized with meta tags

### 3. Dashboard Management
- View all uploaded resumes
- Manage multiple portfolio variants
- Deploy/undeploy portfolios
- Delete resumes and portfolios
- Track deployment status

### 4. Live Deployment
- One-click deployment to unique subdomain
- Instant SSL certificate provisioning
- CDN-powered fast loading
- Public/private visibility controls

### 5. Editing & Customization
- Inline editing for all portfolio sections
- Real-time preview
- Auto-save functionality
- Version history

## Key Components

- **ResumeUpload**: Handles file upload and parsing
- **Dashboard**: Portfolio and resume management
- **Preview**: Live editing and deployment
- **Portfolio**: Public portfolio display
- **Auth**: User authentication

## Database Schema

- `profiles`: User profile information
- `resumes`: Uploaded resume files and metadata
- `portfolios`: Generated portfolio data and settings
- Storage bucket for secure file storage

## Deployment URLs

Portfolios are deployed to: `https://{subdomain}.portfoliogen.app`

Example: `https://sarah-frontend-1701234567.portfoliogen.app`

## Security Features

- Row Level Security (RLS) on all tables
- Secure file upload with type validation
- User isolation (users only see their own data)
- Encrypted storage at rest
- HTTPS everywhere

## Sample Portfolio Data

The system generates rich portfolio content including:
- Professional metrics (years experience, projects completed, users impacted)
- Detailed project descriptions with technologies used
- Achievement-focused experience bullets
- Direct links to GitHub repositories and live demos
- Contact information and social links

Ready to create professional portfolios in minutes! 🚀