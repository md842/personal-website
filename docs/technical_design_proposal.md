# Personal Website: Technical Design Proposal
Author: Max Deng  
Last Updated: January 5, 2026

### Objective
I am creating a personal website with which I can showcase my personal portfolio.

### Requirements
The website shall be responsive, adaptive to mobile devices, and look modern and professional. The website shall support all modern browsers and platforms.

### Detailed Design
The web page will be implemented in React/TSX and CSS 3.

- **Technological Modernity:** The web page shall use React to deliver dynamic content in a way that feels responsive to the user. For example, using React Router can avoid re-rendering content that is common between different pages, improving performance. Modern CSS frameworks, such as React Bootstrap, will be utilitized to give the web page a modern and professional appearance.
- **Mobile Compatibility:** The webpage shall adapt to viewing on mobile devices by rearranging elements to suit a vertical screen layout. This will be implemented within the CSS.

### Alternatives Considered
- I considered using frameworks such as Angular or Svelte. Angular is a bit excessive for the use case, and I chose React over Svelte due to familiarity and more established community support (e.g., React libraries).
- I considered using Tailwind CSS or Material UI as alternatives to React Bootstrap, but ultimately chose React Bootstrap due to familiarity.
- JavaScript is less effort to work with than TypeScript, but it can be more difficult to debug runtime errors in JavaScript. Ultimately, I believe type safety is worth the small effort tradeoff.