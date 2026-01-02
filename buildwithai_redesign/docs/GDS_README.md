# ODBWAIL — GDS (Design tokens & components)

This file documents usage examples for the core GDS components added for Phase 5.

Import tokens

Add the tokens CSS to your global layout (example: `src/app/layout.tsx`):

```tsx
import '@/assets/gds.css'
```

Button

```jsx
import Button from '@/components/gds/Button'

<Button>Primary</Button>
<Button variant="secondary">Cancel</Button>
<Button loading>Saving…</Button>
<Button leftIcon={<svg/>}>With Icon</Button>
```

Input

```jsx
import Input from '@/components/gds/Input'

<Input label="Domain" placeholder="example.com" />
```

Card

```jsx
import Card from '@/components/gds/Card'

<Card header="Release v1.1.0">
  <p>Short summary</p>
</Card>
```

ReleaseCard

```jsx
import ReleaseCard from '@/components/gds/ReleaseCard'
import { releases } from '@/data/releases'

releases.map(r => (
  <ReleaseCard key={r.slug} {...r} />
))
```

Nav

```jsx
import Nav from '@/components/gds/Nav'

<Nav items={[{href:'/',label:'Home'},{href:'/builder',label:'Builder'}]} />
```

Notes

- These examples are minimal — expand components with ARIA states, keyboard interactions, and Storybook docs next.
- The smoke-test page `/gds-test` demonstrates tokens and component rendering.