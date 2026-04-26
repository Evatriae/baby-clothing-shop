# Baby Clothing Shop - Ionic Angular App

A modern, cross-platform mobile e-commerce application built with **Ionic**, **Angular**, and **Supabase**. This app provides a complete baby clothing store experience, including user authentication, product browsing, cart management, and user profiles.

## Tech Stack
- **Frontend Framework**: [Ionic Framework](https://ionicframework.com/) & [Angular](https://angular.dev/)
- **Backend/BaaS**: [Supabase](https://supabase.com/) (PostgreSQL, Authentication, Storage)
- **Native Runtime**: [Capacitor](https://capacitorjs.com/) (for Android & iOS deployment)

## Features
- **User Authentication**: Secure Login & Registration using Supabase Auth.
- **Product Catalog**: Browse and search a variety of baby clothing products (`/shop`).
- **Shopping Cart**: Add, remove, and manage items before checkout (`/cart`).
- **User Profile**: Manage account details and track orders (`/profile`).
- **Modern UI**: Smooth animations, haptic feedback, and a fully responsive layout tailored for mobile devices.

## Project Structure
- `src/app/` - Contains the core Angular application.
  - `home/`, `landing/`, `about/` - General navigation and landing pages.
  - `shop/`, `cart/` - E-commerce features.
  - `login/`, `register/`, `profile/` - Authentication and user management.
  - `services/` - Injectable services for Supabase integration, state, and cart logic.
  - `shared/` - Shared UI components.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (LTS recommended)
- [Ionic CLI](https://ionicframework.com/docs/cli) (`npm install -g @ionic/cli`)

### Installation
1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Configure your Supabase connection strings inside `src/environments/environment.ts` and `environment.prod.ts`.

### Running Locally
To start a local development server with live reload:
```bash
ionic serve
```

### Building for Mobile
To build the application for Android:
```bash
ionic build
npx cap sync android
npx cap open android
```
*(For detailed steps on building the APK, refer to the included [APK Build Guide](APK_BUILD_SUCCESS.md))*

## Documentation & Guides
We have extensive internal documentation available in the root directory:
- **System Architecture**: [SYSTEM_ARCHITECTURE_DFD.md](SYSTEM_ARCHITECTURE_DFD.md), [DATA_FLOW_DIAGRAM.md](DATA_FLOW_DIAGRAM.md), [VISUAL_DFD.md](VISUAL_DFD.md)
- **Database & Storage**: [SUPABASE_STORAGE_SETUP.md](SUPABASE_STORAGE_SETUP.md), [STORAGE_SETUP.md](STORAGE_SETUP.md)
- **Development Guides**: [FILE_MAPPING_GUIDE.md](FILE_MAPPING_GUIDE.md), [IMAGE_UPLOAD_GUIDE.md](IMAGE_UPLOAD_GUIDE.md)

Admin Credentials:
Email: admin@babyshop.com
Password: Admin@12345

## License
Private / Proprietary.
