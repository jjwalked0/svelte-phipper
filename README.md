# Reselling Suite

A beautiful, fast webapp for inventory management designed for resellers. Built with SvelteKit and Supabase.

## Features

- User authentication (login/signup)
- Inventory management
- Minimal dependencies for maximum performance

## Tech Stack

- **Frontend**: SvelteKit
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- npm
- A Supabase account

### Setup Steps

1. Clone the repository
   ```bash
   git clone <your-repo-url>
   cd reselling-suite
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a Supabase project at [https://supabase.com](https://supabase.com)

4. Set up the following table in your Supabase database:
   ```sql
   CREATE TABLE inventory (
     id SERIAL PRIMARY KEY,
     name TEXT NOT NULL,
     user_id TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
   );
   ```

5. Create a `.env` file in the root directory with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

6. Run the development server
   ```bash
   npm run dev
   ```

## Development

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally

## License

MIT
