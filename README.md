# EcoTrack - Sustainable Waste Management App

EcoTrack is a web application designed to help users manage waste sustainably, report illegal waste dumps, and track their environmental impact.

## Features

- **User Authentication**: Secure login and registration system
- **Waste Classification**: Learn how to properly segregate waste
- **Complaint Reporting**: Report illegal waste dumps with photo evidence and location
- **Admin Dashboard**: Admin-specific section for managing the application
  - **Overview**: View statistics and recent activity
  - **Complaints Management**: Review and respond to user complaints
  - **User Management**: View and manage user accounts
  - **Admin Settings**: Configure admin preferences and access

## Admin Access

The admin section is accessible only to users with admin privileges. Admin status is determined by the user's email address. Currently, the following email is configured as an admin:

- admin@ecotrack.com

To access the admin dashboard:
1. Log in with an admin account
2. Click on the "Admin Dashboard" button in the header
3. Use the admin dashboard to manage complaints, users, and settings

## Tech Stack

- React with TypeScript
- Tailwind CSS for styling
- Supabase for backend and authentication
- React Router for navigation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/eco-friendly-navigator.git
cd eco-friendly-navigator
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

- `/src`: Source code
  - `/components`: Reusable UI components
    - `/admin`: Admin-specific components
    - `/auth`: Authentication components
    - `/ui`: UI components
  - `/contexts`: React contexts
  - `/hooks`: Custom React hooks
  - `/lib`: Utility functions and libraries
  - `/pages`: Page components

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Icons from Lucide React
- UI components from shadcn/ui
