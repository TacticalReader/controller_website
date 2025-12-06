

# 🎮 GameSphere GS4 Controller Website

A fully responsive, feature-rich landing page showcasing the GameSphere GS4 gaming controller with interactive elements, smooth animations, and modern UI/UX design. This project demonstrates advanced front-end development skills including interactive color switching, modal systems, carousel functionality, and dynamic user engagement features.

[**Live Demo →**](https://tacticalreader.github.io/controller_website/)

***

## ✨ Key Features

### Interactive Elements
- **Color Variant Switcher** - Real-time controller image updates (Black, White, Red variants)
- **Responsive Navigation** - Mobile-friendly hamburger menu with smooth transitions
- **Dynamic Modals** - Multiple modal systems for login, testimonials, features, and developer profile
- **Scroll Animations** - Intersection Observer API for element reveal on scroll
- **Smooth Scroll Navigation** - Seamless section transitions with offset adjustment

### User Engagement
- **Flash Sale Banner** - Countdown timer with localStorage persistence
- **Exit-Intent Popup** - Triggers offer banner on cursor exit
- **Newsletter Subscription** - Email validation with success feedback
- **Testimonial Carousel** - Auto-rotating reviews with manual controls and swipe support
- **Feature Cards** - Expandable cards with detailed modal views
- **Spec Pop-ups** - Hover-triggered technical specification details

### Technical Highlights
- **Pure Vanilla JavaScript** - No frameworks, lightweight and fast
- **CSS Animations** - Smooth transitions and keyframe animations
- **Accessibility Features** - ARIA labels, keyboard navigation support
- **Mobile-Optimized** - Touch gestures and responsive breakpoints
- **LocalStorage Integration** - Persistent user preferences

***

## 🛠️ Technologies Used

- **HTML5** - Semantic markup with accessibility considerations
- **CSS3** - Custom properties, Flexbox, Grid, animations
- **JavaScript (ES6+)** - Modern syntax, DOM manipulation, event handling
- **Font Awesome 6.2.0** - Icon library
- **Google Fonts** - Mulish font family

***

## 📂 Project Structure

```
controller_website/
├── index.html              # Main HTML structure
├── PS_Controller.css       # Styling and animations (38KB)
├── PS_Controller.js        # Interactive functionality (22KB)
├── controller.png          # Favicon
├── ps4-controller-png-42098.png   # Black controller (671KB)
├── ps4-controller-png-42099.png   # White controller (450KB)
├── ps4-controller-png-42109.png   # Red controller (153KB)
├── te5.jpg                 # Haptic feedback feature image
├── te6.jpg                 # Adaptive triggers feature image
└── te7.jpg                 # Ergonomic design feature image
```

***

## 🚀 Getting Started

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/TacticalReader/controller_website.git
   cd controller_website
   ```

2. **Open in browser**
   - Simply open `index.html` in your preferred browser
   - Or use a local server (recommended):
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   ```

3. **View the site**
   - Navigate to `http://localhost:8000` (or your server's port)

### Deployment
This project is ready for deployment on static hosting platforms like GitHub Pages, Netlify, or Vercel.

***

## 📱 Sections Overview

### Home
Hero section with dynamic controller image and call-to-action buttons.

### Features
Six interactive feature cards showcasing:
- 4K / 120fps gaming capability
- Ultra-fast SSD performance
- 3D AudioTech immersion
- Dynamic haptic feedback
- Adaptive trigger resistance
- Ergonomic comfort design

### Colors
Interactive color selector with smooth image transitions for three controller variants.

### Specs
Technical specifications grid with hover pop-ups displaying detailed information:
- Haptic feedback system
- Adaptive triggers
- Connectivity options
- Battery life (12 hours)
- Weight (280g)
- Built-in microphone

### Testimonials
Auto-rotating carousel with user reviews, featuring:
- Navigation controls
- Touch swipe support
- Expandable modal view
- Pagination dots

***

## 🎨 JavaScript Functionality

### Core Features Implementation

**Color Switching**
```javascript
// Smooth fade transition between controller images
changeControllerColor(color)
```

**Modal Management**
- Login modal with social login options
- Feature detail modals with images
- Testimonial modal with full reviews
- Developer profile modal

**Carousel System**
- Auto-rotation every 5 seconds
- Manual navigation (prev/next)
- Touch swipe gestures
- Pause on hover
- Pagination indicators

**Offer Banner**
- Countdown timer to midnight
- LocalStorage persistence
- "View Later" functionality (2-hour delay)
- Exit-intent trigger

**Form Validation**
- Email format validation
- Success/error states
- ARIA attributes for accessibility

***

## 🎯 Accessibility Features

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Focus management for modals
- Screen reader friendly
- Alternative text for images
- Color contrast compliance

***

## 🌐 Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

***

## 🤝 Contributing

This project is beginner-friendly and welcomes contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Good First Issues
- Add more color variants
- Implement dark/light theme toggle
- Add product comparison table
- Create FAQ accordion section
- Improve mobile responsiveness
- Add animation effects

***

## 📄 License

This project is open source and available for learning purposes.

***

## 👨‍💻 Developer

**Tanmay Srivastava**  
Full-Stack Developer | [GitHub: @TacticalReader](https://github.com/TacticalReader)

***

## 🙏 Acknowledgments

- Original project concept from [nipolki09/controller_website](https://github.com/nipolki09/controller_website)
- Font Awesome for icons
- Google Fonts for typography
- Unsplash for feature images

***

## 📧 Contact

For questions or suggestions, feel free to open an issue or reach out through GitHub.

***


**⭐ Star this repository if you find it helpful!**



[1](https://github.com/TacticalReader/controller_website)
