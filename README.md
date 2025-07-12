https://youtu.be/CLDsegIWTPw link to explanation video 
Odoo-Hackathon
Problem Statement 3:- ReWear – Community Clothing Exchange

Mahitha Chippa - mahitha.chippa05@gmail.com

Kush Modi - kushmodi.0505@gmail.com

Shashank Dornala - shashankfan@gmail.com

Badduri Harsha - harshabadduri@gmail.com


# ReWear - Clothing Exchange Platform

A modern web application for exchanging and selling pre-loved clothing, built with Next.js, TypeScript, Tailwind CSS, and Firebase.

## Features

- **User Authentication**: Secure login and registration with Firebase Auth
- **Item Management**: Browse, list, and manage clothing items
- **User Dashboard**: Track sales, purchases, and account activity
- **Admin Panel**: Platform management and analytics
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Database**: Firestore for data storage
- **File Storage**: Firebase Storage for item images

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Deployment**: Vercel (recommended)

## Project Structure

```
rewear/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   ├── dashboard/         # User dashboard
│   │   ├── browse/            # Item browsing
│   │   ├── item/[id]/         # Item detail pages
│   │   ├── admin/             # Admin panel
│   │   └── page.tsx           # Landing page
│   ├── components/            # Reusable UI components
│   │   ├── Navbar.tsx         # Navigation component
│   │   └── ItemCard.tsx       # Item display component
│   └── firebase/              # Firebase configuration
│       └── config.ts          # Firebase setup
├── public/                    # Static assets
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rewear
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication, Firestore Database, and Storage
   - Get your Firebase configuration

4. **Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Pages Overview

### Landing Page (`/`)
- Hero section with call-to-action
- Feature highlights
- Sustainable fashion messaging

### Login (`/login`)
- Email/password authentication
- Form validation
- Link to registration

### Register (`/register`)
- User registration form
- Terms and conditions
- Link to login

### Browse (`/browse`)
- Item filtering by category, size, condition
- Sort options
- Grid layout for items
- Load more functionality

### Dashboard (`/dashboard`)
- User statistics (items listed, sold, earnings)
- Recent activity
- Tabbed interface for different views

### Item Detail (`/item/[id]`)
- Detailed item information
- Image gallery
- Size selection
- Purchase options
- Seller information

### Admin Panel (`/admin`)
- Platform statistics
- User management
- Item management
- Reports and analytics

## Firebase Setup

### Authentication
- Email/password authentication enabled
- User profiles stored in Firestore

### Firestore Database
Collections structure:
- `users`: User profiles and preferences
- `items`: Clothing items with metadata
- `transactions`: Purchase/sale records
- `wishlists`: User wishlist items

### Storage
- Item images stored in Firebase Storage
- Organized by user and item IDs

## Development

### Adding New Features
1. Create new pages in `src/app/`
2. Add components in `src/components/`
3. Update Firebase configuration as needed
4. Test thoroughly before deployment

### Styling
- Use Tailwind CSS classes for styling
- Follow the existing design system
- Ensure responsive design

### State Management
- Use React hooks for local state
- Firebase real-time listeners for data
- Context API for global state if needed

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- Netlify
- Firebase Hosting
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
