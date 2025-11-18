<p align="center">
    <b align="center"><a href="https://spb.hh.ru/resume/4ae51cd8ff0fa6792e0039ed1f706757556277" title="CV link on hh.ru">Nevedrova Anastasiia</a></b>
</p>
<p align="center">
    <b align="center"><a href="https://development.kameleoon.net/akovalev/frontend-interview-task" title="Task repo link">Frontend Interview Task for Kameleoon</a></b>
</p>
<p align="center">
  <h4 align="center">Demo published on GitHub Pages - <a href="https://nastyanev.github.io/test-chart/" title="GitHub Pages project link">link</a></h4>
  <p align="center">Please, don't forget to click "Open link in new tab" :wink:</p>
</p>

<p align="center">
  <img src="./assets/demo.gif" alt="Application Demo" width="100%">
</p>

---

## Features Overview

An interactive **A/B testing analytics dashboard** that visualizes conversion rate data across multiple test variations:

### Core Functionality
- **📊 Interactive Line Chart** - Visualize conversion rates (conversions/visits × 100) using Chart.js
- **🎯 Multi-Variation Comparison** - Compare multiple test variations
- **📅 Date Range Selection** - Interactive calendar picker to filter data by custom date ranges

### Additional Features
- **🔍 Zoom In/Out** - Scale chart up to 3x
- **🎨 Line Style Selector** - Switch between 4 line styles
- **📱 Light/Dark Theme** - Toggle between themes
- **📥 Chart Export to PNG** - Download current chart view as PNG image

### Bonus Features
- **🔄 Quick Reset** - One-click reset to default settings
- **🔗 Shareable URLs** - Filter encoded in URL for easy sharing


All data is mocked using MSW (Mock Service Worker) for demonstration purposes.

---

## Setup Instructions

1. Clone repo
   ```bash
   git clone https://github.com/NastyaNev/test-chart.git
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start development server
   ```bash
   npm run dev
   ```

## Available Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build locally
```

---

## Tech Stack

<a href="https://reactjs.org/" title="React"><img src="https://img.shields.io/badge/React-%23FFFFFF%20?logo=react&logoColor=%23000000%20&color=%2361DAFB" alt="React" height="30px"></a>
<a href="https://www.w3.org/TR/CSS/" title="CSS3"><img src="https://img.shields.io/badge/Sass-C69?logo=sass&logoColor=fff" alt="SCSS" height="30px"></a>
<a href="https://www.typescriptlang.org/" title="TypeScript"><img src="https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white" alt="TypeScript" height="30px"></a>
<a href="https://vitejs.dev/" title="Vite"><img src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white" alt="Vite" height="30px"></a>
<a href="https://getbem.com/" title="BEM — Block Element Modifier"><img src="https://img.shields.io/badge/BEM-00B1E6?logo=bem&logoColor=white" alt="BEM" height="30px"></a>
<a href="https://github.com/css-modules/css-modules" title="CSS Modules"><img src="https://img.shields.io/badge/CSS_Modules-000?logo=css3&logoColor=white" alt="CSS Modules" height="30px"></a>

**Libraries & Tools:**

- **For chart:** <a href="https://www.chartjs.org/" title="Chart.js"><img src="https://img.shields.io/badge/Chart.js-FF6384?logo=chartdotjs&logoColor=white" alt="Chart.js" height="30px"></a>
- **To mock data:** <a href="https://mswjs.io/" title="MSW"><img src="https://img.shields.io/badge/MSW-FF6A33?logo=msw&logoColor=white" alt="MSW" height="30px"></a>

---

## Project Structure

```
src/
├── components/          # Highest level components
│   └── UI/             # Basic UI components
├── hooks/              # Custom hooks
├── mocks/              # Mocking data functions
├── types/              # TypeScript types
└── utils/              # Constants, SCSS vars, fonts, util functions
```
