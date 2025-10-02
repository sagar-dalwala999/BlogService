# BlogServices AI Coding Instructions

## Important Guidelines
- Do not run npm run dev because that is already done in the terminal.
- Do not run cd commands, you are already in the project directory.

## Project Architecture

This is a **React + Vite** blog services application with **shadcn/ui** components and **Tailwind CSS**. The project follows a modern frontend architecture focused on authentication and user management.

### Key Technical Stack
- **Build System**: Vite with React plugin
- **UI Framework**: shadcn/ui with "new-york" style configuration
- **Styling**: Tailwind CSS with CSS variables for theming
- **Form Management**: react-hook-form with Zod validation
- **Icons**: Lucide React icons throughout
- **State Management**: React hooks (no external state library)

## Development Patterns

### Component Structure
- **UI Components**: Located in `src/components/ui/` - these are shadcn components, modify carefully
- **Feature Components**: Located in `src/components/{feature}/` (e.g., `auth/`)
- **Utilities**: `src/lib/utils.js` contains the essential `cn()` utility for className merging

### Form Validation Pattern
All forms use this established pattern:
```jsx
// 1. Define Zod schema with cross-field validation
const schema = z.object({...}).refine((data) => /* cross-validation */, { message, path });

// 2. Setup react-hook-form with zodResolver
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
  mode: "onChange"
});

// 3. Conditional error styling with Alert components
className={`${errors.fieldName ? 'border-red-500' : ''}`}
{errors.fieldName && (
  <Alert className="py-2 border-red-200 bg-red-50">
    <AlertDescription className="text-red-600 text-xs">
      {errors.fieldName.message}
    </AlertDescription>
  </Alert>
)}
```

### Import Conventions
- Use **barrel exports** for shadcn components: `import { Button, Input } from "@/components/ui/button"`
- **Absolute imports** with `@/` alias for all internal modules
- Import icons individually: `import { Eye, EyeOff, User } from "lucide-react"`

### Authentication Layout Pattern
The established pattern uses **split-screen layout**:
- Left: Gradient background (`from-blue-500 to-blue-600`) with illustration
- Right: Form in a Card component with `shadow-lg border-0`
- Responsive: Stack on mobile (`hidden lg:flex lg:w-1/2`)

### Input Field Structure
Standard pattern for all form inputs:
```jsx
<div className="space-y-2">
  <Label htmlFor="field" className="text-sm font-medium text-gray-700">Label</Label>
  <div className="relative">
    <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
    <Input className="pl-10" {...register("field")} />
  </div>
</div>
```

## Development Commands

- **Dev Server**: `npm run dev` - Starts Vite dev server
- **Build**: `npm run build` - Production build
- **Lint**: `npm run lint` - ESLint checking
- **Preview**: `npm run preview` - Preview production build

## File Organization

```
src/
├── components/
│   ├── ui/           # shadcn components (don't modify structure)
│   └── auth/         # Authentication components
├── hooks/            # Custom React hooks
├── lib/
│   └── utils.js      # cn() utility and other helpers
└── assets/           # Static assets
```

## Critical Notes

- **shadcn Configuration**: `components.json` defines aliases and structure - maintain consistency
- **CSS Variables**: Tailwind config uses CSS variables for theming - use semantic colors
- **Password Fields**: Always include toggle visibility with Eye/EyeOff icons
- **Loading States**: Use `isLoading` state with button text changes ("Creating Account...")
- **Responsive Design**: Mobile-first with `lg:` breakpoints for desktop layouts
- **Form Accessibility**: All inputs have proper labels, IDs, and error associations

## Asset Management
- Static assets go in `public/` directory
- Reference with relative paths: `src="/signup.png"`
- Use descriptive alt text for accessibility