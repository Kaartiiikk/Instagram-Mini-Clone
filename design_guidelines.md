# Mini-Instagram Design Guidelines

## Design Approach: Functionality-First Minimal UI

The user has explicitly requested an **extremely basic interface** with minimal styling, focusing entirely on functionality over aesthetics. This is NOT a polished, beautiful design - it's intentionally simple and utilitarian.

## Core Design Principles

1. **Plain and Functional**: No elaborate styling, gradients, shadows, or animations
2. **Developer-friendly**: Simple HTML elements with basic CSS
3. **Data Flow Focus**: UI exists to demonstrate backend functionality clearly
4. **No Polish**: Intentionally avoiding "AI-polished" appearance

## Layout System

- Use simple container divs with basic max-width (e.g., 600-800px for main content)
- Basic padding/margin: 8px, 16px, 24px units
- Single-column layouts throughout
- No complex grid systems - stack elements vertically

## Typography

- System fonts only: Arial, Helvetica, sans-serif
- Font sizes: 14px (body), 18px (headings), 12px (meta info)
- No custom web fonts
- Basic font weights: normal and bold only

## Components

### Navigation
- Simple horizontal bar with links
- Text-based navigation (no icons unless absolutely necessary)
- Basic username display and logout button

### Post Cards
- Simple bordered containers (1px solid border)
- Image displayed at full card width
- Username and timestamp as plain text above
- Caption below image
- Like count and comment count as plain text
- Simple "Like" and "Comment" text buttons

### Forms (Login/Signup/Create Post)
- Standard HTML form elements
- Plain text inputs with basic borders
- Simple labels above inputs
- Standard submit buttons with minimal styling

### Profile Page
- Username as heading
- Follower/following counts as plain text
- Follow/Unfollow as simple button
- User's posts in vertical list

### Feed
- Vertical stack of post cards
- No infinite scroll - simple load more button if needed
- Posts from followed users only

## Colors

Use basic, unstyled colors:
- Black text on white background
- Light gray borders (#ddd)
- Blue for links (#0066cc)
- Simple button background (#f0f0f0)

## Images

**No hero images or decorative imagery**. Only user-generated content images:
- Post images: Display at natural aspect ratio within card constraints
- No placeholder images - use text placeholders like "[Image URL]" if no image provided

## Interactions

- Standard browser button/link hover states
- No custom animations
- No transitions
- Basic form validation messages as plain text

## Key Screens Structure

1. **Login/Signup**: Centered form with username/password fields
2. **Home Feed**: Simple list of posts from followed users
3. **Profile**: User info at top, posts list below
4. **Create Post**: Basic form with image URL and caption inputs
5. **Post Detail**: Single post with comments list below

This design intentionally avoids visual sophistication to showcase the backend functionality clearly and simply.