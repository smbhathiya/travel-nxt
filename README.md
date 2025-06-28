# TravelNxt - Discover Sri Lanka

TravelNxt is a personalized travel recommendation app that helps users discover amazing destinations in Sri Lanka based on their interests. Using AI-powered recommendations, users can find perfect spots that match their preferences for beaches, mountains, cultural sites, national parks, and more.

## 🚀 Features

- **Interest-Based Recommendations**: Users can select their travel interests and get personalized destination recommendations
- **Sri Lanka Focus**: Specialized recommendations for destinations within Sri Lanka
- **AI-Powered Matching**: Python API integration for intelligent recommendation engine
- **Modern UI**: Beautiful, responsive interface built with Next.js and Tailwind CSS
- **User Authentication**: Secure authentication with Clerk
- **Personalized Scores**: Each recommendation includes a personalized score based on user interests

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Database**: PostgreSQL with Prisma ORM
- **UI Components**: Radix UI
- **Recommendation Engine**: Python API (separate service)

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL database
- Python recommendation API running on `http://localhost:8000`
- Clerk account for authentication

## 🔧 Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd travel-nxt
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Database
DATABASE_URL=your_postgresql_database_url

# Python API Base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Optional APIs
OPENWEATHER_API_KEY=your_openweather_api_key
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Optional: View database in Prisma Studio
npx prisma studio
```

### 4. Start the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## 🔗 Python API Integration

The app integrates with a Python recommendation API that should be running on `http://localhost:8000`. The API should have the following endpoint:

### POST `/recommend`

**Request Body:**

```json
{
  "interests": ["beaches", "mountains", "historic sites"]
}
```

**Response:**

```json
{
  "recommendations": [
    {
      "Location_Name": "Bentota Beach",
      "Location_Type": "beaches",
      "Rating": 4.587982832618025,
      "personalized_score": 0.5470251834251078
    }
  ]
}
```

## 🗺️ User Flow

1. **Sign Up/Sign In**: Users authenticate using Clerk
2. **Set Interests**: New users are directed to select their travel interests
3. **Get Recommendations**: Users can get personalized recommendations based on their interests
4. **Explore Results**: View recommendations with ratings and personalized scores

## 📝 Interest Categories

The app supports the following interest categories for Sri Lanka:

- Beaches
- Bodies of Water
- Farms
- Gardens
- Historic Sites
- Museums
- National Parks
- Nature & Wildlife Areas
- Waterfalls
- Zoological Gardens
- Religious Sites

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production

Make sure to set all environment variables in your deployment platform:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `DATABASE_URL`
- `NEXT_PUBLIC_API_BASE_URL`

## 📁 Project Structure

```
travel-nxt/
├── app/                        # Next.js App Router
│   ├── (auth)/                # Authentication routes
│   ├── api/                   # API routes
│   ├── components/            # Page-specific components
│   ├── discover/     # Main recommendation page
│   ├── interests/             # Interest selection page
│   └── globals.css           # Global styles
├── components/                # Reusable UI components
├── lib/                       # Utilities and database
├── prisma/                    # Database schema and migrations
└── public/                    # Static assets
```

## 🔧 Key Components

### API Routes

- `/api/user/interests` - Manage user interests (GET/POST)
- `/api/recommendations` - Get recommendations from Python API

### Main Pages

- `/` - Landing page
- `/interests` - Interest selection for users
- `/discover` - View personalized recommendations
- `/sign-in`, `/sign-up` - Authentication pages

## 🧪 Development

### Running Tests

```bash
npm run test
```

### Linting

```bash
npm run lint
```

### Database Management

```bash
# Reset database
npx prisma migrate reset

# Create new migration
npx prisma migrate dev --name migration_name

# View database
npx prisma studio
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Note**: Make sure your Python recommendation API is running on `http://localhost:8000` before starting the Next.js application.
