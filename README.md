<<<<<<< HEAD
# finalautogreg
=======
# AutoGreg - Premium Car Dealership Platform

A premium car dealership platform built with Next.js, featuring a clean Audi-inspired design and comprehensive admin panel for managing car inventory.

## Features

### Public Area
- **Homepage** - Clean landing page showcasing the dealership
- **Catalog** (`/katalog`) - Browse available cars for purchase
- **Sold Cars** (`/sprzedane`) - View previously sold vehicles

### Admin Panel
- **Secure Login** - Protected admin area with session-based authentication
- **Dashboard** - Overview of all inventory with statistics
- **Car Management** - Add, edit, delete, and mark cars as sold
- **Image Upload** - Single image upload with preview and validation
- **Status Management** - Toggle between active and sold status

## Tech Stack

- **Frontend**: Next.js 13+ (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Animations**: Framer Motion
- **Authentication**: NextAuth.js with credentials provider
- **State Management**: Zustand
- **Form Handling**: React Hook Form with Zod validation
- **Data Storage**: JSON file-based storage (easily replaceable with database)

## Setup Instructions

### 1. Environment Configuration

Create a `.env.local` file in the root directory:

```env
ADMIN_PATH="__admin-auto-greg-9c1b7f"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD_HASH="$2b$12$LQv3c1yqBWVHxkd0LQ4YCOHDuuBKEaAjQVukXNn6toSJue2kkHw6."
SECRET_KEY="your-super-secret-key-change-this-in-production"
UPLOAD_FOLDER="public/uploads"
NEXTAUTH_SECRET="your-nextauth-secret-key"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_ADMIN_PATH="__admin-auto-greg-9c1b7f"
```

### 2. Generate Password Hash

To create a secure password hash for admin login:

```bash
node scripts/generate_password_hash.js your-desired-password
```

Copy the generated hash to your `.env.local` file as `ADMIN_PASSWORD_HASH`.

### 3. Install Dependencies

```bash
npm install
```

### 4. Reset Inventory (Optional)

To start with a clean inventory:

```bash
node scripts/reset_inventory.js
```

### 5. Run Development Server

```bash
npm run dev
```

The application will be available at:
- **Public dealership site**: `http://localhost:3000`
- **Admin panel**: `http://localhost:3000/__admin-auto-greg-9c1b7f` (or your custom admin path)

## Usage

### Admin Panel Access

1. Navigate to `http://localhost:3000/{ADMIN_PATH}` (replace with your admin path)
2. Login with your configured username and password
3. Access the dashboard to manage car inventory

### Adding Cars

1. Login to admin panel
2. Click "Dodaj auto" (Add Car)
3. Fill in the form with car details
4. Upload an image (JPG, JPEG, PNG - max 5MB)
5. Save to add to inventory

### Managing Listings

- **Edit**: Modify car details and images
- **Mark as Sold**: Move cars from active to sold status
- **Delete**: Permanently remove listings

## File Structure

```
├── app/
│   ├── [adminPath]/          # Dynamic admin routes
│   ├── api/                  # API routes
│   ├── katalog/              # Public catalog page
│   ├── sprzedane/            # Public sold cars page
│   └── page.tsx              # Homepage
├── components/
│   ├── layout/               # Header, Footer
│   └── ui/                   # Reusable UI components
├── data/
│   └── cars.json             # Car data storage
├── lib/                      # Utilities and configurations
├── public/
│   └── uploads/              # Uploaded images
├── scripts/                  # Utility scripts
├── store/                    # Zustand state management
└── types/                    # TypeScript definitions
```

## Security Features

- **Protected Admin Routes**: Middleware-based authentication
- **Secure Sessions**: HTTP-only cookies with CSRF protection
- **File Upload Validation**: Type and size restrictions
- **Password Hashing**: bcrypt with salt rounds
- **Environment Variables**: Sensitive data in environment files

## Data Model

Cars are stored with the following structure:

```typescript
interface Car {
  id: string;              // UUID
  title: string;           // Car title/name
  year: number;            // Production year
  engine: string;          // Engine description
  mileage: number;         // Mileage in km
  price_text?: string;     // Optional price text
  status: 'active' | 'sold'; // Car status
  main_image_path?: string; // Image file path
  createdAt: string;       // ISO timestamp
  updatedAt: string;       // ISO timestamp
}
```

## Production Deployment

1. Set secure environment variables
2. Configure proper domain in `NEXTAUTH_URL`
3. Set up HTTPS for secure cookies
4. Consider migrating from JSON storage to a proper database
5. Implement proper image optimization and CDN

## Manual Testing Checklist

- [ ] Homepage loads with navigation buttons
- [ ] `/katalog` shows empty state when no cars
- [ ] `/sprzedane` shows empty state when no sold cars
- [ ] Admin login works with correct credentials
- [ ] Admin login rejects incorrect credentials
- [ ] Unauthenticated admin access redirects to login
- [ ] Can add new car with image upload
- [ ] Can mark car as sold (moves from catalog to sold)
- [ ] Can edit existing cars
- [ ] Can delete cars
- [ ] Image uploads work and validate file types

## License

This project is private and proprietary.

## Edit

This edit is public 
>>>>>>> 21b6db6 (Initial commit)
