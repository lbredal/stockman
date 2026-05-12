---
description: Review a React component or page for mobile usability issues. Use before marking a UI feature as done — Stockman is a mobile-first app.
---

Review a component or page for mobile usability.

## What to check

### Touch targets
- Buttons, links, and inputs must be at least **44×44px**
- Avoid elements that are close together and easy to mis-tap
- Icon-only buttons need a visible label or `aria-label`

### Layout
- No horizontal scrolling at 390px viewport width
- Content should not be clipped or overflow on small screens
- Use `flex-wrap` or stack elements vertically on narrow screens

### Typography
- Minimum font size: 16px for body text (prevents iOS auto-zoom on input focus)
- Line length should be readable (45–75 characters)

### Forms
- Inputs use appropriate `type` attributes: `number`, `date`, `email`, `tel`
- Use `inputMode` where helpful: `inputMode="decimal"` for quantities
- Labels are visible (not just placeholder text)
- Submit button is reachable without scrolling on short screens

### Lists and tables
- Tables should scroll horizontally or reflow into cards on mobile
- List items should have enough vertical padding to tap comfortably

### Performance
- No large unoptimized images
- No layout shifts on load

## How to review
1. Read the component code and flag any of the above issues
2. List each issue with the line number and a suggested fix
3. If the dev server is running, take a screenshot at 390px width

## Notes
- This is a mobile-first app — if something works on desktop but not mobile, mobile wins
