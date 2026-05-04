# Academic Support Website - Plain HTML/CSS/JS Version

This is a plain HTML, CSS, and JavaScript version of the Academic Support website, converted from the original React application. No external libraries or frameworks are required - just open `index.html` in a web browser.

## Features

- **Single Page Application**: All pages are contained in one HTML file with JavaScript-based routing
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Blue and black theme with gradient effects and smooth animations
- **Interactive Components**:
  - Navigation with mobile menu support
  - Assignment submission form with validation
  - Handwritten assignment generator with PDF/image export
  - WhatsApp integration for contact

## Pages

1. **Home** - Landing page with hero section, services overview, and features
2. **How It Works** - Step-by-step process explanation
3. **Services** - Detailed service descriptions
4. **Pricing** - Pricing plans with popular badge
5. **Submit Assignment** - Form for submitting assignment requests
6. **Handwritten Generator** - Tool to generate handwritten-style assignments
7. **Terms & Conditions** - Legal terms
8. **Privacy Policy** - Privacy information

## File Structure

```
plain-html-version/
├── index.html              # Main HTML file with all pages
├── css/
│   ├── styles.css          # Global styles and variables
│   ├── header.css          # Header navigation styles
│   ├── footer.css          # Footer styles
│   ├── home.css            # Home page styles
│   ├── how-it-works.css    # How it works page styles
│   ├── services.css        # Services page styles
│   ├── pricing.css         # Pricing page styles
│   ├── submit-assignment.css # Assignment form styles
│   ├── handwritten-generator.css # Generator page styles
│   ├── terms-and-conditions.css # Terms page styles
│   └── privacy-policy.css  # Privacy page styles
├── js/
│   ├── main.js             # Main JavaScript functionality
│   └── handwritten-generator.js # Generator specific JS
└── README.md               # This file
```

## How to Use

1. **Download/Clone** the files to your local machine
2. **Open `index.html`** in any modern web browser
3. **Navigate** using the header menu or mobile menu
4. **Submit assignments** through the form or WhatsApp
5. **Generate handwritten assignments** using the generator tool

## Key Features Implemented

### Navigation System
- Hash-based routing for single-page application
- Active link highlighting
- Mobile-responsive menu
- Smooth scroll animations

### Form Handling
- Client-side validation
- Success/error messages
- WhatsApp integration with pre-filled messages
- File upload support

### Handwritten Generator
- Multiple handwriting fonts
- Adjustable font size
- Live preview
- PDF export via browser print
- PNG image download via canvas

### Responsive Design
- Mobile-first approach
- Grid and flexbox layouts
- Touch-friendly interface
- Optimized for all screen sizes

## Browser Compatibility

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## Technical Details

- **No build tools required** - pure HTML/CSS/JS
- **No external dependencies** - uses browser APIs only
- **Modern CSS features** - CSS Grid, Flexbox, Custom Properties
- **ES6+ JavaScript** - classes, arrow functions, template literals
- **Responsive images** - using SVG icons and CSS gradients

## WhatsApp Integration

The website integrates with WhatsApp for customer support:
- Contact buttons throughout the site
- Pre-filled messages for assignment submissions
- Direct WhatsApp number linking

## Notes

- All animations and transitions are CSS-based for performance
- Form validation happens client-side for immediate feedback
- PDF generation uses browser's native print functionality
- Image export uses HTML5 Canvas API
- No server-side processing required

## Original vs Plain Version

| Feature | Original (React) | Plain Version |
|---------|------------------|---------------|
| Framework | React + Vite | Vanilla JS |
| Routing | React Router | Hash-based routing |
| Animations | Framer Motion | CSS animations |
| PDF Generation | jsPDF | Browser print |
| Image Export | html2canvas | Canvas API |
| Icons | React Icons | Inline SVG |
| Build Step | Required | None |

This plain version maintains all the functionality of the original React application while being completely self-contained and dependency-free.
