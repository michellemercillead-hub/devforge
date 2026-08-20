# DevForge

## Overview

DevForge is a Specialized Developer Workspace Dashboard created as the capstone project for my Web Development course. The project is developed over eight weeks, with each week's milestone preserved in its own folder to demonstrate the progression from a basic design system to a polished, production-ready web application.

DevForge is designed to provide developers with a centralized workspace for organizing projects, tracking tasks, monitoring repositories, and managing productivity tools through a modern, responsive interface.

---

## Week 02

The Week 02 milestone focuses on creating the project's Design System Token Page.

This milestone includes:

- CSS custom properties (design tokens)
- OKLCH color palette
- Light and Dark Mode support
- Fluid typography using `clamp()`
- Responsive spacing system using `rem`
- Sample UI components
- Accessible color contrast that meets WCAG AA guidelines

These design tokens will become the foundation for all future dashboard components.

---

## Planned Weekly Milestones

### Week 02
- Design System
- Color Palette
- Typography Scale
- Spacing Tokens

### Week 03
- Dashboard Layout
- Sidebar Navigation
- Main Workspace
- Context Panel

### Week 04
- Responsive Layout
- CSS Grid
- Flexbox
- Container Queries

### Week 05
- Interactive Components
- JavaScript Functionality
- Dashboard Widgets

### Week 06
- API Integration
- Dynamic Dashboard Data

### Week 07
- Accessibility Improvements
- Animations
- Performance Optimization

### Week 08
- Final Production Dashboard
- Testing
- Deployment

### Week 05 Interactive Issue Creation

The Week 05 dashboard includes a New Issue modal. Visitors can enter an issue title, choose a label, and add a description without opening GitHub manually.

The issue request follows this path:

```text
Week 05 modal
    -> Cloudflare Worker
    -> GitHub Issues API
    -> New issue in michellemercillead-hub/devforge
```

The browser sends the form data to the Cloudflare Worker at
`https://devforge.michellemercillead.workers.dev`. The Worker keeps the GitHub
token on the server side, validates the request, and returns the created issue
number and URL or a useful error message.

The Worker validates the following:

- The request uses `POST` and comes from the GitHub Pages origin.
- The request contains valid JSON and a non-empty title.
- The title and description stay within their maximum lengths.
- The label is `bug`, `enhancement`, or `task`.

The modal also loads public repository activity from the GitHub API and reads
deployment information from `data/github-pages.json`.

## GitHub Pages API Integration

The Week 04 dashboard reads deployment status from `data/github-pages.json`.
The `.github/workflows/update-pages.yml` workflow securely calls
the GitHub Pages API with GitHub's built-in Actions token, so no personal token
is exposed in the browser.

To enable the integration after pushing this project to GitHub:

1. Enable GitHub Pages for the repository in **Settings > Pages**.
2. In **Settings > Actions > General**, allow the workflow to read and write repository contents.
3. Run **Update GitHub Pages data** from the repository's Actions tab, or push to `main` or `master`.

## Cloudflare Worker Configuration

The Worker code is located in `worker/src/index.js`, and its Wrangler
configuration is in `worker/wrangler.toml`.

The Worker uses these non-secret settings:

```toml
GITHUB_REPO = "michellemercillead-hub/devforge"
ALLOWED_ORIGIN = "https://michellemercillead-hub.github.io"
```

`GITHUB_TOKEN` must be stored as a Cloudflare Worker secret. It must never be
placed in `index.html`, JavaScript sent to the browser, `wrangler.toml`, or
committed to GitHub.

To add or replace the secret from the `worker` directory:

```powershell
cd worker
npx.cmd --yes wrangler secret put GITHUB_TOKEN
```

The GitHub fine-grained token needs access to the `michellemercillead-hub/devforge`
repository and the **Issues: Read and write** repository permission. The
`ALLOWED_ORIGIN` setting and the GitHub token have different purposes:

- `ALLOWED_ORIGIN` allows the GitHub Pages website to call the Worker.
- `GITHUB_TOKEN` allows the Worker to create issues in the repository.

To confirm that the secret name exists without displaying its value:

```powershell
npx.cmd --yes wrangler secret list
```

The expected result includes `GITHUB_TOKEN`.

---

## Technologies Used

- HTML5
- CSS3
- CSS Custom Properties
- OKLCH Color Space
- CSS Cascade Layers
- CSS Grid
- Flexbox
- Responsive Design
- Git
- GitHub
- GitHub Pages
- Cloudflare Workers
- GitHub REST API

---

## Running the Project

1. Clone the repository.
2. Open the project folder in Visual Studio Code.
3. Open the root `index.html` file in your browser or use the Live Server extension.
4. Navigate to each week's milestone from the landing page.

---

## Project Structure

```text
my-capstone-project/
│
├── index.html
├── README.md
│
├── week02/
│   ├── index.html
│   └── styles.css
│
├── week03/
│   ├── index.html
│   └── styles.css
│
├── week04/
│   ├── index.html
│   └── styles.css
│
├── week05/
│   ├── index.html
│   └── styles.css
│
├── week06/
│   ├── index.html
│   └── styles.css
│
├── week07/
│   ├── index.html
│   └── styles.css
│
├── week08/
    ├── index.html
    └── styles.css

├── data/
│   └── github-pages.json
│
├── worker/
│   ├── wrangler.toml
│   └── src/
│       └── index.js
│
└── .github/
    └── workflows/
        └── update-pages.yml
```

---

## AI Assistance

Generative AI was used to assist with:

- Developing the OKLCH color palette
- Calculating fluid typography using `clamp()`
- Explaining the mathematics behind responsive typography
- Organizing the project folder structure
- Reviewing accessibility considerations and modern CSS best practices
- Reviewing the Cloudflare Worker and GitHub API integration

The HTML structure, project organization, implementation, testing, and final integration were completed by the project author.

---

## Author

**Michelle**

Web Development Capstone Project

2026