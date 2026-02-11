# Instructor Dashboard (V2)

## Architectural Design

### Core Philosophy
- **Data-Heavy & Minimal**: Focus on density and readability logic.
- **Architectural**: Thin borders, structured spacing, no heavy cards/shadows.
- **Inline Stats**: Strip layout with separators instead of boxes.

### Features

#### 1️⃣ Header
- **Layout**: Left-aligned structure.
- **Micro-Detail**: Thin structural divider below.
- **Action**: Primary "Create Course" button.

#### 2️⃣ Stat Strip
**Design**:
- Inline text blocks.
- Thin vertical separators (`h-8 w-px bg-borderLight`).
- Large `text-2xl` numeric typography.
- Muted uppercase labels.
- No background surfaces.

#### 3️⃣ Course Table
**Structure**:
- `bg-white` surface.
- Thin border (`border-borderLight`).
- Dense rows with 1px borders.
- **No** zebra stripes or shadows.

**Columns**:
1. **Thumbnail**: Small standardized aspect ratio.
2. **Title**: Medium weight, primary color.
3. **Status**: Minimal badge (Green/Gray).
4. **Enrollments**: Right-aligned, tabular nums + **Micro-Bar**.
5. **Last Updated**: Right-aligned, relative time.
6. **Actions**: Text link (Edit) + Minimal Switch (Publish).

#### 4️⃣ Micro-Interactions
- **Sorting**: Click headers to sort (Title, Enrollments, Time).
- **Visuals**: Primary color arrow indicators for sort direction.
- **Feedback**: Subtle row hover (`bg-gray-50/50`).
- **Toggle**: Optimistic UI update for publish status.

### Tech Stack
- **Next.js 16** (App Router)
- **Tailwind CSS v4**
- **Lucide React** (Icons)
- **date-fns** (Time formatting)

### File Structure
- `src/app/(dashboard)/instructor/page.tsx` - Main Logic & Layout
- `src/components/ui/Switch.tsx` - Custom Toggle Component
- `src/components/ui/StatusBadge.tsx` - Status Indicator
- `src/lib/services/instructor.service.ts` - Data Layer

### Responsive Strategy
- **Desktop**: Full dense data table.
- **Mobile**: Stacked architectural cards with dashed internal dividers.
