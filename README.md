# Enterprise SaaS Dashboard

A production-grade Enterprise SaaS Dashboard application built with React, TypeScript, and modern frontend engineering practices. This application demonstrates scalable architecture patterns similar to those used by companies like Atlassian, HubSpot, and Freshworks.

## Features

- **Campaign Management**: Full CRUD operations with advanced filtering, sorting, and pagination
- **Campaign Detail Views**: Tab-based interface with Overview, Assets, and Performance sections
- **Job Simulation Engine**: Frontend-only async job processing with polling and lifecycle management
- **Mock API Layer**: Realistic API simulation with configurable delays and error rates
- **Optimistic UI Updates**: Immediate feedback with automatic rollback on errors
- **Drag & Drop Upload**: Simulated file upload with progress tracking
- **Advanced Charts**: Performance visualization using Recharts
- **Form Validation**: Robust validation using React Hook Form and Zod
- **Responsive Design**: Mobile-first design that works across all screen sizes

## Tech Stack

- **React 18**: Latest React with hooks and concurrent features
- **TypeScript**: Strict type checking enabled
- **Vite**: Fast build tool and dev server
- **React Router 6**: Client-side routing with lazy loading
- **Zustand**: Lightweight state management
- **React Hook Form**: Performant form handling
- **Zod**: TypeScript-first schema validation
- **Recharts**: Composable charting library
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Modern icon library

## Architecture Decisions

### Feature-Based Folder Structure

The project uses a feature-based architecture for better scalability and maintainability:

```
src/
├── app/                    # Application-level code
│   ├── layout/            # Layout components (Sidebar, Header)
│   ├── pages/             # Top-level pages (Dashboard, Analytics)
│   ├── router/            # Routing configuration
│   └── ErrorBoundary.tsx  # Error boundary component
├── features/              # Feature modules
│   ├── campaigns/         # Campaign listing feature
│   │   ├── components/    # Feature-specific components
│   │   ├── services/      # API service layer
│   │   ├── pages/         # Feature pages
│   │   ├── store.ts       # Zustand store
│   │   ├── types.ts       # TypeScript types
│   │   └── mockData.ts    # Mock data
│   └── campaign-detail/   # Campaign detail feature
│       ├── components/    # Tab components
│       ├── pages/         # Detail page
│       └── schemas/       # Zod validation schemas
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks
├── services/              # Core services (mockApi, jobEngine)
└── lib/                   # Utility functions
```

**Benefits:**
- Clear separation of concerns
- Easy to locate and modify feature-specific code
- Scalable as the application grows
- Supports independent feature development

### State Management Approach

**Zustand** was chosen over Redux Toolkit for several reasons:

1. **Simplicity**: Minimal boilerplate with a cleaner API
2. **Performance**: No provider overhead, direct subscription to slices
3. **Bundle Size**: Significantly smaller (~1KB vs ~12KB)
4. **Developer Experience**: Less ceremony, easier to learn and use
5. **TypeScript Support**: Excellent type inference out of the box

**Store Organization:**
- Feature-specific stores (e.g., `useCampaignStore`)
- Global stores for cross-cutting concerns (e.g., `useToastStore`)
- Stores are co-located with features for better modularity

### Data Simulation Strategy

The application implements a comprehensive mock API layer that simulates real backend behavior:

**Core Simulation Service (`src/services/mockApi.ts`):**
```typescript
simulateRequest<T>({
  delay: [300, 800],        // Random delay range
  failRate: 0.1,            // 10% chance of failure
  data: () => processData() // Data generator function
})
```

**Features:**
- Configurable network latency simulation
- Controlled error injection for testing error states
- Structured cloning to prevent data mutation
- Pagination, filtering, and sorting utilities
- Type-safe responses

**Why Frontend-Only Simulation?**
- Demonstrates frontend architecture patterns
- No backend dependencies during development
- Easy to test edge cases and error scenarios
- Realistic async behavior for UI development

### Job Engine Design

The Job Simulation Engine (`src/services/jobEngine.ts`) provides a realistic async job processing system:

**Architecture:**
- Singleton pattern for centralized job management
- Event-driven updates using subscription model
- Lifecycle states: `pending` → `processing` → `completed` | `failed`
- Automatic cleanup and memory management

**Job Lifecycle:**
```typescript
// Create job
const job = jobEngine.createJob('upload', { fileName: 'example.jpg' });

// Start processing with subscription
const unsubscribe = jobEngine.subscribe(job.id, (updatedJob) => {
  console.log('Progress:', updatedJob.progress);
});

await jobEngine.startJob(job.id, {
  duration: 5000,    // 5 second simulation
  failRate: 0.15,    // 15% failure chance
  steps: 10          // Progress steps
});

// Cleanup
jobEngine.cleanup(job.id);
```

**Use Cases:**
- File upload simulation with progress tracking
- Background task processing
- Long-running operation visualization
- Retry and error handling patterns

### Performance Considerations

**Optimization Techniques:**

1. **React.memo**: Memoize components that receive stable props
   - `Button`, `Badge`, `Tabs`, `Pagination`
   - Table rows and cells
   - Filter components

2. **useCallback**: Memoize event handlers
   - Row selection handlers
   - Filter change callbacks
   - Sort handlers

3. **useMemo**: Memoize computed values
   - Filtered and sorted data
   - Chart data transformations
   - Column definitions

4. **Lazy Loading**: Route-based code splitting
   - All page components are lazy-loaded
   - Reduces initial bundle size
   - Improves time-to-interactive

5. **Debouncing**: Search input with 300ms debounce
   - Reduces unnecessary API calls
   - Improves perceived performance

6. **Optimistic Updates**: Immediate UI feedback
   - Status changes apply instantly
   - Automatic rollback on failure
   - Better user experience

**Bundle Optimization:**
- Tree shaking enabled
- Production builds minified
- CSS purging with Tailwind
- Dynamic imports for routes

### Trade-offs Made

#### 1. Zustand vs Redux Toolkit
**Choice**: Zustand
**Trade-off**: Less middleware ecosystem, but simpler API and better DX

#### 2. Frontend-Only Simulation
**Choice**: No real backend
**Trade-off**: Can't demonstrate server-side features, but showcases frontend patterns

#### 3. Feature-Based vs Domain-Driven
**Choice**: Feature-based folders
**Trade-off**: Some code duplication, but better feature isolation

#### 4. Recharts vs D3
**Choice**: Recharts
**Trade-off**: Less flexibility, but much easier to use and maintain

#### 5. Controlled vs Uncontrolled Components
**Choice**: Mostly controlled
**Trade-off**: More boilerplate, but predictable state management

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run type checking
npm run typecheck

# Run linter
npm run lint
```

## Project Structure Details

### Components (`src/components/`)

Reusable UI components following a consistent design system:

- **Form Components**: `Button`, `Input`, `Textarea`, `Select`
- **Data Display**: `Table`, `Badge`, `Tabs`, `Pagination`
- **Feedback**: `Modal`, `Toast`, `Spinner`
- **States**: `LoadingState`, `ErrorState`, `EmptyState`

All components:
- Use TypeScript for type safety
- Support className prop for customization
- Include accessibility attributes
- Use React.memo where appropriate

### Hooks (`src/hooks/`)

Custom hooks for common patterns:

- **useDebounce**: Debounce value changes (search input)
- **useToast**: Toast notification management
- **useJob**: Subscribe to job updates
- **useUnsavedChanges**: Warn before leaving with unsaved changes

### Services (`src/services/`)

Core business logic abstraction:

- **mockApi.ts**: Simulated API layer with realistic delays/errors
- **jobEngine.ts**: Job lifecycle management with polling
- **delay.ts**: Async delay utilities

### Features

#### Campaigns Feature (`src/features/campaigns/`)

**Components:**
- `CampaignTable`: Sortable, selectable table with memoized columns
- `CampaignFilters`: Multi-criteria filtering with local state
- `BulkActions`: Batch operations on selected rows

**Store:**
- Zustand store with pagination, sorting, filtering
- Optimistic updates for status changes
- Selection state management

**Service:**
- Full CRUD operations
- Advanced filtering logic
- Bulk update operations

#### Campaign Detail Feature (`src/features/campaign-detail/`)

**Tabs:**
1. **Overview**: Form with validation, unsaved changes warning
2. **Assets**: Drag & drop upload with progress, delete confirmation
3. **Performance**: Multiple chart types, aggregated metrics

**Validation:**
- Zod schemas for type-safe validation
- React Hook Form integration
- Custom validation rules (date ranges)

## Key Implementation Patterns

### Optimistic UI Updates

```typescript
// Update UI immediately
const optimisticData = campaigns.map(c =>
  c.id === id ? { ...c, status: newStatus } : c
);
set({ campaigns: optimisticData });

try {
  // Attempt actual update
  await service.updateStatus(id, newStatus);
  fetchCampaigns(); // Refresh from source
} catch (error) {
  // Rollback on error
  set({ campaigns: originalData });
  throw error;
}
```

### Debounced Search

```typescript
const [searchValue, setSearchValue] = useState('');
const debouncedSearch = useDebounce(searchValue, 300);

useEffect(() => {
  setFilters({ ...filters, search: debouncedSearch });
}, [debouncedSearch]);
```

### Job Subscription Pattern

```typescript
useEffect(() => {
  if (!jobId) return;

  const unsubscribe = jobEngine.subscribe(jobId, (job) => {
    setJob(job);
    if (job.status === 'completed') {
      toast.success('Upload completed');
    }
  });

  return unsubscribe;
}, [jobId]);
```

### Route Protection & Error Boundaries

```typescript
<ErrorBoundary>
  <Routes>
    <Route element={<Suspense fallback={<LoadingState />}>
      <AppLayout />
    </Suspense>}>
      <Route path="/" element={<DashboardPage />} />
      {/* More routes */}
    </Route>
  </Routes>
</ErrorBoundary>
```

## Testing Approach

While tests are not implemented in this version, here's the recommended testing strategy:

**Unit Tests:**
- Service layer functions (mockApi, jobEngine)
- Utility functions
- Custom hooks

**Component Tests:**
- UI components with various props
- User interactions
- Edge cases and error states

**Integration Tests:**
- Feature workflows (create, update, delete)
- Form validation
- Navigation flows

**Recommended Tools:**
- Vitest for unit tests
- React Testing Library for components
- MSW for API mocking
- Playwright for E2E tests

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

MIT

## Credits

Built with modern frontend engineering practices demonstrating production-grade patterns used by leading SaaS companies.
