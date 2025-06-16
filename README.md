# Meicho Shimbun RPG

A ticket entry and media management web application built with React, TypeScript, and modern UI components. The application simulates an RPG-style interface for creating journal entries with multimedia content, featuring a cyberpunk/neon aesthetic with Tokyo-themed elements.

## Live Demo
[View Live Application](https://lovable.dev/projects/fafe259a-ff46-45f0-812e-1c598bf4b505)

## Technology Stack

- **Frontend**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.1
- **Styling**: Tailwind CSS 3.4.11 with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui
- **State Management**: React Hooks (useState)
- **Icons**: Lucide React 0.462.0
- **Routing**: React Router DOM 6.26.2

## Current Application State

### ✅ Implemented Features

#### Main Dashboard (MissionControl)
- Level badge with XP progression system
- Streak tracker showing consecutive days
- Tokyo time/date display
- Recent entries mockup
- Prompt of the day section
- "Draft New Entry" button functionality

#### Ticket Entry Modal System
- TicketModal: Main modal container with proper scrolling
- MediaUploadSection: File upload with preview thumbnails
- EntryFormFields: Form inputs for title, description, research notes, location, tags

#### Media Upload Functionality
- Multiple file upload (images and videos)
- 96x96px thumbnail previews with proper aspect ratio
- Crown selection for preview image
- Remove media functionality with hover effects
- Proper file type detection and icons
- Memory leak prevention with URL cleanup

#### UI/UX Features
- Dynamic title header that updates as user types
- Scrollable modal content using Radix UI ScrollArea
- Responsive design with grid layouts
- Neon-themed styling with custom gradients
- Accessibility improvements (DialogDescription)

### ⚠️ Known Issues & Limitations
- Data Persistence: No backend integration - all data is lost on page refresh
- Form Validation: No input validation or error handling
- Media Storage: Files stored in browser memory only
- State Management: Basic useState - no global state management
- Tags System: Static tags display, no dynamic tag creation/management
- Save Functionality: "Save Draft" button has no implementation

## Project Structure

```
src/
├── components/
│   ├── ui/                    # Shadcn UI components
│   ├── TicketModal.tsx        # Main modal orchestrator
│   ├── MediaUploadSection.tsx # Media handling component
│   ├── EntryFormFields.tsx    # Form inputs component
│   ├── MissionControl.tsx     # Main dashboard
│   ├── Header.tsx             # Top navigation
│   └── [other components]     # Level, Streak, Recent tickets, etc.
├── pages/
│   ├── Index.tsx             # Main page component
│   └── NotFound.tsx          # 404 page
├── hooks/                    # Custom React hooks
├── lib/
│   └── utils.ts             # Utility functions
├── App.tsx                  # Root application component
├── main.tsx                 # Application entry point
├── index.css               # Global styles & design system
└── vite-env.d.ts          # TypeScript declarations
```

## Design System

### Color Palette
- Primary: Neon Pink (hsl(320 100% 65%))
- Accent: Neon Teal (hsl(180 100% 55%))
- Background: Tokyo Navy (hsl(220 25% 8%))
- Secondary: Asphalt Grey (hsl(220 25% 15%))
- Highlight: Royal Blue (hsl(240 100% 50%))

### Custom CSS Classes
- `.feature-card`: Gradient cards with hover effects
- `.run-button`: Primary action buttons with glow effects
- `.neon-glow`: Text shadow effects
- `.ticket-card`: Entry card styling

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn package manager

### Installation
```bash
# Clone the repository
git clone [repository-url]
cd meicho-shimbun-rpg

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Server
- Local: http://localhost:5173
- Production build: `npm run build`

## Implementation Guide

### Phase 1: Core Functionality Fixes (Priority: HIGH)
1. Implement Save/Load System
2. Add Form Validation
3. Implement Tag Management

### Phase 2: State Management & Data Flow (Priority: MEDIUM)
1. Implement Context/Zustand Store
2. Connect Recent Tickets Component

## Testing Strategy

### Manual Testing Checklist
- [ ] Media upload (multiple files)
- [ ] Preview selection with crown
- [ ] Media removal functionality
- [ ] Form scrolling with overflow content
- [ ] Title header dynamic updates
- [ ] All form field interactions
- [ ] Modal open/close with cleanup
- [ ] Responsive design on mobile/tablet

### Browser Compatibility
- Chrome/Edge (Chromium-based)
- Firefox
- Safari (WebKit)

## Future Roadmap
- Backend Integration (Recommended: Supabase)
  - User authentication
  - Cloud file storage
  - Real-time collaboration

## Common Development Issues & Solutions

### Lucide React Icon Errors
```typescript
// ✅ Correct usage
import { Upload, X, Image, Video, Crown } from 'lucide-react';

// ❌ Avoid dynamic imports in this codebase
const Icon = icons[iconName]; // This can cause TypeScript errors
```

### File Upload Memory Leaks
```typescript
// ✅ Always cleanup URLs
useEffect(() => {
  return () => {
    mediaFiles.forEach(media => URL.revokeObjectURL(media.url));
  };
}, []);
```

### Modal Scrolling Issues
```typescript
// ✅ Use Radix ScrollArea for proper scrolling
<ScrollArea className="flex-1">
  <div className="p-6 space-y-6">
    {/* Content */}
  </div>
</ScrollArea>
```

## Contributing
Please read our contributing guidelines before submitting pull requests.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
