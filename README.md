# Folio – Blog & Content Management Platform

A modern, full-featured content management and blogging platform built with React, TypeScript, and Vite. Folio provides an intuitive interface for creating, editing, and managing blog posts with a powerful editor, media library, and real-time analytics.

## 🌟 Features

- **User Authentication** – Secure sign-up and login with Firebase Authentication
- **Blog Editor** – Rich-text editor with real-time preview and editorial tips
- **Media Library** – Organize and manage media assets with UploadThing integration
- **Dashboard** – View analytics including recent activity, reader engagement, and top-performing posts
- **Post Management** – Create, edit, preview, and publish blog posts
- **Settings** – Customize user preferences and account settings
- **Responsive Design** – Mobile-first UI with tailored navigation for desktop and mobile
- **Real-time Updates** – Firebase Firestore integration for live data synchronization

## 🛠️ Tech Stack

### Frontend

- **React** 19.2.8 – Modern UI library with concurrent features
- **TypeScript** 6.0.2 – Type-safe development
- **Vite** 8.2.2 – Fast build tool with HMR
- **React Router** 7.18.3 – Client-side routing
- **Tailwind CSS** 4.3.3 – Utility-first CSS framework
- **Lucide React** 1.41.0 – Icon library
- **React Toastify** 11.1.0 – Toast notifications

### Backend & Services

- **Firebase** 12.18.0 – Authentication and Firestore database
- **Firebase Admin** 14.3.0 – Server-side Firebase operations
- **UploadThing** 7.7.4 – File upload management
- **@uploadthing/react** 7.3.3 – React integration for file uploads

### Developer Tools

- **Oxlint** 1.79.0 – Fast linter
- **TypeScript Compiler** – Type checking and compilation

## 📁 Project Structure

```
Folio/
├── api/                          # API route handlers
│   ├── media.ts                  # Media endpoint
│   ├── posts.ts                  # Posts endpoint
│   └── uploadthing.ts            # File upload endpoint
├── public/                        # Static assets
├── src/
│   ├── app/                       # Application core
│   │   ├── App.tsx               # Main app component
│   │   ├── routes.tsx            # Route configuration
│   │   └── providers/            # Context providers
│   │       └── AuthProvider.tsx  # Authentication context
│   ├── components/               # Reusable components
│   │   ├── feedback/             # Feedback UI (toasts, dialogs)
│   │   ├── layout/               # Layout components (headers, sidebars)
│   │   ├── routing/              # Route guards
│   │   └── ui/                   # Atomic UI components
│   ├── features/                 # Feature modules
│   │   ├── auth/                 # Authentication feature
│   │   ├── dashboard/            # Dashboard analytics
│   │   ├── editor/               # Blog editor
│   │   ├── home/                 # Home/landing page
│   │   ├── media/                # Media library
│   │   └── posts/                # Posts management
│   ├── pages/                    # Page components
│   ├── server/                   # Server-side utilities
│   │   ├── firebase-*.ts         # Firebase initialization files
│   │   ├── post-service.ts       # Post business logic
│   │   ├── media-*.ts            # Media handling
│   │   └── uploadthing*.ts       # File upload handling
│   ├── services/                 # API and integration services
│   │   ├── api/                  # API client functions
│   │   ├── firebase/             # Firebase service modules
│   │   └── uploadthing/          # UploadThing client
│   ├── hooks/                    # Custom React hooks
│   ├── styles/                   # Global styles
│   ├── types/                    # TypeScript type definitions
│   ├── config/                   # Configuration files
│   └── main.tsx                  # Application entry point
├── package.json
├── vite.config.ts                # Vite configuration
├── tsconfig.json                 # TypeScript configuration
├── tsconfig.app.json             # App-specific TypeScript config
├── tsconfig.node.json            # Node-specific TypeScript config
├── vercel.json                   # Vercel deployment config
└── index.html

```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm/yarn
- **Firebase Project** – Create one at [firebase.google.com](https://firebase.google.com)
- **UploadThing Account** – Sign up at [uploadthing.com](https://uploadthing.com)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Folio
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_UPLOADTHING_API_KEY=your_uploadthing_api_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

## 🔧 Development

### Available Scripts

- **`npm run dev`** – Start the development server with HMR
- **`npm run build`** – Build for production (TypeScript check + Vite build)
- **`npm run preview`** – Preview production build locally
- **`npm run lint`** – Run Oxlint code quality checks

### Code Quality

The project uses **Oxlint** for fast code linting. Lint configuration can be customized in `.oxlintrc.json`.

Run linting:

```bash
npm run lint
```

### TypeScript

TypeScript configuration is split across:

- `tsconfig.json` – Base configuration
- `tsconfig.app.json` – Application-specific settings
- `tsconfig.node.json` – Node.js/build tool settings

Type checking happens automatically during the build process:

```bash
npm run build  # Runs tsc -b before vite build
```

## 🏗️ Architecture

### Authentication Flow

The app uses Firebase Authentication with a custom `AuthProvider` context that wraps the entire application. Protected routes use `ProtectedRoute` component to ensure users are authenticated.

### Feature Modules

Each feature module (auth, dashboard, editor, etc.) is self-contained with:

- **types.ts** – TypeScript interfaces and types
- **validation.ts** – Input validation schemas
- **components/** – UI components
- **hooks/** – Feature-specific custom hooks
- **services/** – API and data fetching logic

### Database & Storage

- **Firestore** – Structured data (posts, user profiles)
- **Firebase Storage** – Media assets
- **UploadThing** – Managed file uploads with validation

## 📱 UI Components

### Layout Components

- **AppShell** – Main application wrapper with navigation
- **Header** – Top navigation bar
- **Sidebar** – Side navigation with sections and items
- **MobileNavigation** – Mobile-optimized navigation
- **PublicHeader** – Header for non-authenticated pages

### Feedback Components

- **Toast** – Notifications for user actions
- **ConfirmDialog** – Confirmation modals

### Routing Components

- **ProtectedRoute** – Guards routes requiring authentication
- **GuestRoute** – Routes accessible only to non-authenticated users

## 🚀 Deployment

The project is configured for **Vercel** deployment.

### Deploy to Vercel

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard (same as `.env.local`)
3. **Deploy** – Vercel will automatically build and deploy on push

Configuration file: `vercel.json`

### Build Process

```bash
npm run build
```

This runs:

1. TypeScript compilation check (`tsc -b`)
2. Vite production build

## 📚 API Routes

### `/api/posts` – Post Management

- Get, create, update, delete blog posts
- Integrated with Firestore

### `/api/media` – Media Management

- Upload, retrieve, delete media files
- UploadThing integration

### `/api/uploadthing` – File Upload Handler

- Direct file upload endpoint
- Manages file validation and storage

## 🔐 Security

- **Firebase Authentication** – Secure user authentication and authorization
- **Firestore Security Rules** – Database access control (configure in Firebase Console)
- **Environment Variables** – Sensitive data stored in `.env.local` (never committed)
- **Protected Routes** – Route guards prevent unauthorized access

## 📦 Dependencies Overview

| Package            | Purpose             |
| ------------------ | ------------------- |
| `react`            | UI framework        |
| `react-router-dom` | Client-side routing |
| `firebase`         | Backend services    |
| `uploadthing`      | File management     |
| `tailwindcss`      | Styling             |
| `lucide-react`     | Icons               |
| `react-toastify`   | Notifications       |

## 🛠️ Troubleshooting

### Development Server Not Starting

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Firebase Authentication Issues

- Verify Firebase credentials in `.env.local`
- Check Firebase Console for enabled authentication methods
- Ensure redirect URLs are configured correctly

### UploadThing Upload Failures

- Verify UploadThing API key
- Check file size and type restrictions
- Review UploadThing dashboard for error logs

## 📝 Contributing

1. Create a feature branch (`git checkout -b feature/your-feature`)
2. Commit changes (`git commit -m "Add feature"`)
3. Push to branch (`git push origin feature/your-feature`)
4. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

## 🤝 Support

For issues, feature requests, or questions, please open an issue in the repository.

---

**Built with ❤️ using React, TypeScript, and Vite**
