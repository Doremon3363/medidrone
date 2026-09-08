# MediDrone — Emergency Medicine Network Prototype

A student innovation prototype for coordinating emergency medicine requests with registered pharmacies and a simulated drone delivery workflow.

## Features
- Emergency medicine request form
- Pharmacy registration
- Pharmacy search by area/name/medicine
- Local browser database using `localStorage`
- Nearest matching pharmacy demo logic
- Emergency control-center request list
- Simulated drone mission progress
- Responsive robotics-inspired UI
- GitHub Pages deployment workflow

## Important
This is a **prototype**, not a medical-delivery service. Do not use it for real patient care or medicine fulfillment. A production system would require appropriate clinical/pharmacy verification, privacy/security controls, prescription validation where applicable, identity and location controls, audit logs, authorized emergency-service integration, and compliance with applicable medicine and drone regulations.

## Run locally

No backend is required for this prototype.

1. Download/clone the repository.
2. Open `index.html` in a browser.

For a local development server, you can use VS Code Live Server or any static HTTP server.

## Publish on GitHub Pages

### Option A — GitHub website
1. Create a new GitHub repository, for example `medidrone`.
2. Upload all project files, including `.github/workflows/deploy.yml`.
3. Push/commit them to the `main` branch.
4. Open **Settings → Pages** in the repository.
5. Under **Build and deployment → Source**, select **GitHub Actions**.
6. Open the **Actions** tab and wait for the deployment workflow to finish.
7. Open **Settings → Pages → Visit site**.

Your project site will normally be:
`https://YOUR-USERNAME.github.io/medidrone/`

### Option B — Git command line

```bash
git init
git add .
git commit -m "Create MediDrone prototype"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/medidrone.git
git push -u origin main
```

Then enable GitHub Actions as the Pages source in **Settings → Pages**.

## Project structure

```text
medidrone/
├── index.html
├── style.css
├── app.js
├── README.md
└── .github/
    └── workflows/
        └── deploy.yml
```

## Next development stage

Replace browser `localStorage` with a secure backend/database and add authenticated pharmacy accounts, verified medicine inventory, real geolocation/maps, request audit logs, pharmacist approval, and a controlled drone/operations integration.
