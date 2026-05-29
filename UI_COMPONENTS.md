# Smart Retail Frontend - UI Components Documentation

## Overview
This document provides a comprehensive guide to all enhanced UI components available in the Smart Retail Platform frontend.

## Core UI Components

### 1. SkeletonLoader
Loading state placeholder for data-heavy components.

**Props:**
- `count` (number): Number of skeleton items to display. Default: 1
- `type` (string): Type of skeleton - 'card', 'table-row', 'chart', 'text'. Default: 'card'
- `className` (string): Additional CSS classes

**Usage:**
```jsx
import { SkeletonLoader } from '@/components/ui'

// Loading skeleton for 3 cards
<SkeletonLoader count={3} type="card" />

// Loading skeleton for table rows
<SkeletonLoader count={8} type="table-row" />

// Loading skeleton for chart
<SkeletonLoader type="chart" />
```

### 2. EmptyState
Display empty state when no data is available.

**Props:**
- `type` (string): 'noData', 'noResults', 'noPermission'. Default: 'noData'
- `title` (string): Custom title (overrides default)
- `description` (string): Custom description (overrides default)
- `action` (object): { label, onClick } for action button
- `icon` (component): Custom Lucide React icon

**Usage:**
```jsx
import { EmptyState } from '@/components/ui'

// Basic empty state
<EmptyState type="noData" />

// With custom action
<EmptyState 
  type="noResults" 
  action={{ label: 'Create New', onClick: handleCreate }}
/>

// With custom icon
<EmptyState title="No Items" description="Start by creating an item" icon={CustomIcon} />
```

### 3. ErrorScreen
Full-page error display with retry and home navigation.

**Props:**
- `code` (string): HTTP error code or custom code. Default: '500'
- `title` (string): Custom error title
- `message` (string): Custom error message
- `action` (object): { label, onClick } for action button
- `showHome` (boolean): Show "Go to Dashboard" button. Default: true

**Usage:**
```jsx
import { ErrorScreen } from '@/components/ui'

// 404 error
<ErrorScreen code="404" />

// With custom action
<ErrorScreen 
  code="500" 
  action={{ label: 'Retry', onClick: handleRetry }}
/>
```

### 4. PageLoader
Loading indicator for page transitions.

**Props:**
- `message` (string): Loading message. Default: 'Loading...'
- `fullScreen` (boolean): Full-screen overlay or inline. Default: true

**Usage:**
```jsx
import { PageLoader } from '@/components/ui'

// Full-screen loader
<PageLoader message="Loading reports..." />

// Inline loader
<PageLoader message="Loading data..." fullScreen={false} />
```

### 5. Badge
Status indicator badge.

**Props:**
- `variant` (string): 'default', 'primary', 'success', 'warning', 'danger', 'purple'
- `size` (string): 'sm', 'md', 'lg'
- `children` (string): Badge text

**Usage:**
```jsx
import { Badge } from '@/components/ui'

<Badge variant="success" size="sm">Active</Badge>
<Badge variant="warning" size="md">Pending</Badge>
<Badge variant="danger">Error</Badge>
```

### 6. FormField
Labeled form field wrapper with error and hint support.

**Props:**
- `label` (string): Field label
- `error` (string): Error message
- `required` (boolean): Show required indicator
- `hint` (string): Hint text
- `children` (node): Input element

**Usage:**
```jsx
import { FormField } from '@/components/ui'

<FormField label="Email" error={errors.email} required>
  <input type="email" className="form-input" />
</FormField>

<FormField label="Name" hint="Your full name">
  <input type="text" className="form-input" />
</FormField>
```

### 7. Button
Customizable button with loading state and icons.

**Props:**
- `variant` (string): 'primary', 'secondary', 'danger', 'outline', 'ghost'
- `size` (string): 'sm', 'md', 'lg'
- `disabled` (boolean): Disable button
- `loading` (boolean): Show loading spinner
- `icon` (component): Lucide React icon

**Usage:**
```jsx
import { Button } from '@/components/ui'
import { Save } from 'lucide-react'

<Button variant="primary">Save</Button>
<Button variant="danger" size="lg">Delete</Button>
<Button variant="outline" disabled>Disabled</Button>
<Button loading>Processing...</Button>
<Button icon={Save}>Save</Button>
```

### 8. Alert
Status message alert.

**Props:**
- `variant` (string): 'info', 'success', 'warning', 'error'
- `title` (string): Alert title
- `message` (string): Alert message
- `action` (object): { label, onClick }
- `dismissible` (boolean): Show dismiss button
- `onDismiss` (function): Dismiss callback

**Usage:**
```jsx
import { Alert } from '@/components/ui'

<Alert variant="success" title="Success" message="Operation completed" />
<Alert variant="error" title="Error" message="Please try again" dismissible onDismiss={handleDismiss} />
```

### 9. Tabs
Tabbed interface.

**Props:**
- `tabs` (array): Array of { id, label, icon? }
- `activeTab` (string): Active tab ID
- `onTabChange` (function): Callback on tab change
- `className` (string): Additional classes

**Usage:**
```jsx
import { Tabs } from '@/components/ui'

const tabs = [
  { id: 'sales', label: 'Sales' },
  { id: 'inventory', label: 'Inventory' },
]

<Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
```

### 10. Container
Responsive container wrapper.

**Props:**
- `size` (string): 'sm', 'md', 'lg'. Default: 'md'
- `children` (node): Content

**Usage:**
```jsx
import { Container } from '@/components/ui'

<Container>
  <h1>Page Title</h1>
  <p>Content here</p>
</Container>
```

### 11. Stack
Flex layout helper for spacing.

**Props:**
- `direction` (string): 'vertical', 'horizontal'
- `spacing` (string): 'sm', 'md', 'lg'
- `children` (node): Content

**Usage:**
```jsx
import { Stack } from '@/components/ui'

<Stack direction="vertical" spacing="md">
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</Stack>
```

### 12. Input
Styled input field with icon support.

**Props:**
- `error` (boolean): Show error state
- `disabled` (boolean): Disable input
- `icon` (component): Lucide React icon
- `variant` (string): 'default', 'filled'
- All standard HTML input props

**Usage:**
```jsx
import { Input } from '@/components/ui'
import { Mail } from 'lucide-react'

<Input type="text" placeholder="Enter value" />
<Input icon={Mail} placeholder="Email" error={hasError} />
<Input variant="filled" />
```

### 13. Select
Styled select/dropdown.

**Props:**
- `error` (boolean): Show error state
- `disabled` (boolean): Disable select
- `options` (array): Array of { value, label }
- `placeholder` (string): Placeholder text
- All standard HTML select props

**Usage:**
```jsx
import { Select } from '@/components/ui'

<Select 
  options={[
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
  ]} 
  placeholder="Select..."
/>
```

### 14. Tooltip
Hover tooltip helper.

**Props:**
- `text` (string): Tooltip text
- `position` (string): 'top', 'bottom', 'left', 'right'. Default: 'top'
- `children` (node): Trigger element

**Usage:**
```jsx
import { Tooltip } from '@/components/ui'

<Tooltip text="Click to delete">
  <button>Delete</button>
</Tooltip>
```

### 15. Divider
Visual separator.

**Props:**
- `variant` (string): 'solid', 'dashed', 'dotted'
- `spacing` (string): 'sm', 'md', 'lg', 'xl'

**Usage:**
```jsx
import { Divider } from '@/components/ui'

<Divider spacing="lg" />
<Divider variant="dashed" />
```

## Hooks

### useResponsive
Detect current breakpoint and window size.

```jsx
import { useResponsive } from '@/hooks/useUIEnhancements'

const { isMobile, isTablet, isDesktop, width, height } = useResponsive()

return isMobile ? <MobileNav /> : <DesktopNav />
```

### useOutsideClick
Detect clicks outside element.

```jsx
import { useOutsideClick } from '@/hooks/useUIEnhancements'

const menuRef = useRef()
useOutsideClick(menuRef, () => setMenuOpen(false))

return <div ref={menuRef}>Menu</div>
```

### useDebounce
Debounce value changes.

```jsx
import { useDebounce } from '@/hooks/useUIEnhancements'

const [searchTerm, setSearchTerm] = useState('')
const debouncedSearchTerm = useDebounce(searchTerm, 300)

useEffect(() => {
  // Perform search with debouncedSearchTerm
}, [debouncedSearchTerm])
```

## Utility Classes

### Animations
```css
.animate-slide-in       /* Slide in from right */
.animate-fade-in        /* Fade in */
.animate-scale-in       /* Scale up fade */
.animate-bounce-subtle  /* Subtle bounce */
.animate-pulse-subtle   /* Subtle pulse */
```

### Visibility
```css
.hidden-mobile   /* Hidden on mobile, visible on md+ */
.visible-mobile  /* Visible on mobile only */
.hidden-tablet   /* Hidden on tablet */
```

### Hover Effects
```css
.hover-lift    /* Lift on hover with shadow */
.hover-scale   /* Scale up on hover */
.hover-dim     /* Dim opacity on hover */
```

### Text Truncation
```css
.truncate-1    /* Single line truncate */
.truncate-2    /* 2-line truncate */
.truncate-3    /* 3-line truncate */
```

### Responsive Grid
```css
.grid-responsive  /* 1 col (sm) → 2 cols (md) → 3 cols (lg) → 4 cols (xl) */
.grid-2-col       /* 1 col → 2 cols (md) */
```

## Accessibility Features

### Keyboard Navigation
- All interactive elements support Tab navigation
- Buttons support Enter/Space activation
- Modals trap focus within the dialog
- Dropdowns support arrow keys

### Screen Readers
- All images have alt text
- Form labels properly associated with inputs
- ARIA labels on icon-only buttons
- Live regions for dynamic updates
- Semantic HTML (button, nav, main, etc.)

### Focus Management
- Visible focus indicators on all interactive elements
- Focus trapped in modals
- Focus restored after modal closes

## Best Practices

1. **Use FormField for all form inputs**
   ```jsx
   <FormField label="Name" error={errors.name}>
     <Input type="text" />
   </FormField>
   ```

2. **Show loading states during async operations**
   ```jsx
   <Button loading={isLoading}>Save</Button>
   ```

3. **Provide empty states for empty lists**
   ```jsx
   {items.length === 0 ? (
     <EmptyState type="noData" />
   ) : (
     <ItemList items={items} />
   )}
   ```

4. **Use Badges for status indicators**
   ```jsx
   <Badge variant={getStatusColor(status)}>{status}</Badge>
   ```

5. **Provide helpful error messages**
   ```jsx
   <Alert variant="error" message="Email is already in use" dismissible />
   ```

## CSS Utilities

### Form Styling
```css
.form-input     /* Styled input field */
.form-label     /* Styled label */
.form-error     /* Error message styling */
.form-hint      /* Hint text styling */
```

### Card Styling
```css
.card           /* Standard card */
.card-sm        /* Small card */
.card-lg        /* Large card */
```

### Focus Styling
```css
.focus-visible  /* Visible focus ring */
.sr-only        /* Screen reader only text */
```

---

**Last Updated:** Day 9 - UI/UX Enhancement and Application Polish
**Version:** 1.0.0
