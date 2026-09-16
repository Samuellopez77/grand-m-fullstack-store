# GRAND_M React frontend

This is the primary GRAND_M storefront, built with React and Vite. Its product catalog, images, UI, and interactions live entirely in this directory.

## Run locally

```bash
npm install
npm run dev
```

Use `npm run build` to create the production bundle in `dist`. The Express server serves that bundle after it has been built.

## Features

- Hash-based React views for home, collections, category pages, about, sign-in, and sign-up
- Search, category filters, sorting, product quantities, and an in-memory shopping bag
- Responsive navigation and a saved light/dark color preference
- Self-contained product assets in `public/images`
- An endlessly rotating landing gallery using professionally named images in `public/images/landing`

## Landing gallery assets

The display images use descriptive filenames such as `grandm-look-statement-sneaker.jpg`,
`grandm-look-comfort-hoodie.jpg`, and `grandm-look-designer-dress-shoe.jpg`. Keep new gallery
images in `public/images/landing` and reference them through the `landingSlides` list in `src/App.jsx`.
