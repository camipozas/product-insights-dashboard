# Product Insights Dashboard

A minimal product analytics dashboard that fetches data from DummyJSON and displays key metrics and product information.

🔗 **Live Demo**: [[product-insights-dashboard-rosy.vercel.app](https://product-insights-dashboard-rosy.vercel.app/)](<[product-insights-dashboard-rosy.vercel.app](https://product-insights-dashboard-rosy.vercel.app/)>)

## Features

- **Product List**: Browse all products with thumbnail, price, and category
- **Search & Filter**: Filter by name, category, and price range
- **Product Details**: View complete product information including images, rating, and stock
- **Insights Dashboard**: See aggregated metrics like average price, top category, and total products
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript (strict mode)
- **Data Validation**: Zod
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Code Quality**: ESLint + Prettier
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm start
```

### Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage

# Interactive UI
npm run test:ui
```

### Code Quality

```bash
# Lint
npm run lint

# Format
npm run format

# Check everything
npm run check
```

> [!NOTE] We don't need environment variables for this project.

## Key Decisions

### Architecture

**Why Next.js App Router?**
Went with the App Router because it gives better server-side rendering out of the box and the file-based routing is cleaner for a dashboard like this.

**Why Zod validation?**
Added runtime validation to catch issues from the external API early. It's saved me in other projects when the API returns unexpected data.

**API Structure**
Created a shared utility (`src/lib/dummyjson.ts`) to handle all API calls with proper pagination. This avoids hitting the API limit and keeps the code DRY.

### Product & UX

**Inline Filtering**
The filters update results instantly instead of requiring a "Submit" button. Users seem to prefer this for quick exploration, though I added an explicit "Apply" button based on feedback.

**Dashboard First**
Decided to show insights at the top of the main page rather than hiding them in a separate view. The goal was to surface the most important metrics immediately.

**Client-side Filtering**
Filters run on the client after fetching all products. This makes the UX snappier, though it wouldn't scale well with thousands of products (see Limitations).

## Limitations

### Current Constraints

1. **Client-side filtering only**
   - All products are fetched upfront and filtered in the browser
   - Works fine for ~200 products, but would struggle with 10,000+
   - Should move to server-side filtering with proper pagination for production

2. **No data caching strategy**
   - Relies on Next.js default caching (1 hour revalidation)
   - No SWR or React Query for optimistic updates
   - Page refresh loses filter state

3. **Limited error handling**
   - Shows generic error messages to users
   - No retry logic for failed API calls
   - No offline mode or graceful degradation

4. **No authentication or personalization**
   - Everyone sees the same data
   - No user preferences or saved filters
   - No way to bookmark or share specific views

5. **Accessibility gaps**
   - Keyboard navigation works but could be smoother
   - No screen reader testing done
   - Color contrast is okay but not WCAG AAA

## Next Steps

If I had more time, here's what I'd tackle next:

### Short term (1-2 days)

- [ ] Add skeleton loaders instead of generic "Loading..." text
- [ ] Implement proper error boundaries with retry options
- [ ] Add URL params for shareable filter states
- [ ] Create a mobile-optimized card view for products
- [ ] Add "sort by" functionality (price, name, rating)

### Medium term (1 week)

- [ ] Add infinite scroll or "load more" pagination
- [ ] Implement server-side filtering and search
- [ ] Add chart visualizations for insights (price distribution, category breakdown)
- [ ] Create a comparison view to compare 2-3 products side-by-side

### Long term (if this were a real product)

- [ ] User authentication and saved preferences
- [ ] Admin panel to manage products
- [ ] Export functionality (CSV, PDF reports)
- [ ] Proper monitoring and observability (DataDog, Sentry, New Relic)

## Deployment

The app is deployed on Vercel with automatic deployments on push to `main`.

For Docker deployment:

```bash
docker build -t product-insights .
docker run -p 3000:3000 product-insights
```
