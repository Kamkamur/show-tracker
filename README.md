# TV Tracker

A clean, minimalistic TV show tracking app with PWA support.

## Features
- Track shows across 4 categories: Plan to Watch, Watching, Completed, Waiting for New Season
- Add/edit/delete shows with title, description, genre, and notes
- Favorite shows with star toggle
- Search across all shows
- Theme system (Dark, Light, Purple Accent, Custom colors)
- All data saved in localStorage
- PWA — installable on mobile (Add to Home Screen)

## Development

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages

1. **Build the project:**
   ```bash
   npm run build
   ```
   This outputs to the `dist/` folder.

2. **Push to GitHub** and enable GitHub Pages:
   - Go to **Settings → Pages**
   - Set source to **GitHub Actions** or **Deploy from branch** (`gh-pages`)

3. **Using `gh-pages` package (easiest):**
   ```bash
   npm install -D gh-pages
   npx gh-pages -d dist
   ```

4. **Or use a GitHub Actions workflow** — create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [main]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: 20
         - run: npm ci
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

The app uses `base: "./"` in Vite config, so all paths are relative and work correctly on any subdirectory (like `https://username.github.io/repo-name/`).
