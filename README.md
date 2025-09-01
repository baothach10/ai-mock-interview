# AI Mock Interview Project 🚀

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/) 
[![Convex](https://img.shields.io/badge/Convex-1F2937?style=for-the-badge&logo=none)](https://convex.dev/) 
[![Clerk](https://img.shields.io/badge/Clerk-4F46E5?style=for-the-badge&logo=none)](https://clerk.com/) 
[![Shadcn UI](https://img.shields.io/badge/ShadcnUI-14B8A6?style=for-the-badge&logo=none)](https://shadcn.dev/) 
[![Aceternity UI](https://img.shields.io/badge/AceternityUI-F59E0B?style=for-the-badge&logo=none)](https://aceternity.com/) 
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/) 
[![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=none)](https://greensock.com/gsap/) 
[![HeyGen](https://img.shields.io/badge/HeyGen-FF3E00?style=for-the-badge&logo=none)](https://www.heygen.com/) 

---

## Overview

The **AI Mock Interview Project** is a full-stack web application designed to help users practice interviews using AI-generated questions, example answers, and interactive feedback. It also provides resume analysis and AI avatars for a realistic interview experience.

**Live Demo:** *(Insert your deployed link here)*

---

## Features ✨

- **User Authentication & Subscription**: Secure login via OAuth using Clerk.
- **AI-Powered Interview Generation**: Generate personalized interview questions and example answers with Google Gemini NLP.
- **Resume Analysis**: Scan and process resumes using Python for tailored interview preparation.
- **Interactive AI Avatar**: HeyGen-powered AI-generated videos for immersive interview practice.
- **Smooth Animations**: GSAP animations for smooth page transitions and interactions.
- **Resume Cloud Archive**: Store resumes safely using ImageKit.
- **Real-Time Feedback**: Track past interviews, feedback, and performance.
- **Rate Limit Protection**: Secure APIs with ArcJet.
- **Workflow Automation**: Integrate AI pipelines using Pipedream.

---

## Tech Stack 🛠️

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js, Shadcn UI, Aceternity UI, GSAP |
| **Backend & DB** | Convex |
| **AI & NLP** | Google Gemini, Python, Pipedream |
| **Authentication** | Clerk |
| **Media & Video** | ImageKit, HeyGen |
| **Security & Rate Limit** | ArcJet |

---

## Getting Started 🚀

### Prerequisites

Before running the project locally, make sure you have API keys for the following services:

- **[Google Gemini](https://developers.google.com/)** – AI-generated questions and answers  
- **[ArcJet](https://arcjet.io/)** – Rate limit protection  
- **[Clerk](https://clerk.com/)** – Authentication & subscription management  
- **[Convex](https://convex.dev/)** – Database access  
- **[Pipedream](https://pipedream.com/)** – AI workflow automation  
- **[ImageKit](https://imagekit.io/)** – Cloud storage of resumes  
- **[HeyGen](https://www.heygen.com/)** – AI-generated interactive video avatars  

Create a `.env.local` file in your project root and add all required keys:

```env
NEXT_PUBLIC_CLERK_FRONTEND_API=<your-clerk-frontend-api>
CLERK_API_KEY=<your-clerk-api-key>
CONVEX_URL=<your-convex-url>
GOOGLE_GEMINI_KEY=<your-google-gemini-key>
ARCJET_KEY=<your-arcjet-key>
PIPEDREAM_KEY=<your-pipedream-key>
IMAGEKIT_PUBLIC_KEY=<your-imagekit-public-key>
IMAGEKIT_PRIVATE_KEY=<your-imagekit-private-key>
HEYGEN_KEY=<your-heygen-key>
````

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd <project-directory>

# Install dependencies
npm install

# Run the development server
npm run dev

# Run the development server for the convex db
npx convex dev
```

Open [http://localhost:3000](http://localhost:3000) to see the project in action.

---

## Folder Structure 📂

```
├── app/                 # Next.js pages and API routes
├── components/          # Reusable UI components
├── _components/         # Feature-specific components (e.g., InterviewCard, CreateInterviewDialog)
├── convex/              # Database schemas and API queries
├── public/              # Static assets (images, icons)
├── styles/              # Tailwind or custom CSS files
└── utils/               # Utility functions and helpers
```

---

## Contributing 🤝

Contributions are welcome! Please open an issue or submit a pull request.

---

## License

MIT License © \[Ngo Tran Bao Thach]

---

## Contact 📧

For inquiries, contact **\[Ngo Tran Bao Thach]** at \[[baothach10@gmail.com](mailto:baothach10@gmail.com)].
