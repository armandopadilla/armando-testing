# Book Dashboard

An authenticated user dashboard displaying a personal book collection with aggregated statistics.

## Features

- **Category Pills**: Shows 4 summary pills at the top:
  - Total Books
  - Sci-Fi books count
  - Romance books count
  - Adventure books count
  
- **Book Collection Table**: Displays a comprehensive table of all owned books with:
  - Title
  - Author
  - Category (color-coded badges)
  - Year published
  - Page count

## Tech Stack

- **TypeScript** for type safety
- **Next.js 14** (App Router)
- **Zod** for runtime validation
- **Tailwind CSS** for styling
- **Jest** for testing

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test
```

Visit `http://localhost:3000` to view the dashboard.

## Project Structure

- `app/dashboard/` - Dashboard page and components
- `app/dashboard/BookDashboard.tsx` - Main dashboard component with mock data
- `app/dashboard/BookDashboard.test.tsx` - Tests (following house style: tests next to source)
