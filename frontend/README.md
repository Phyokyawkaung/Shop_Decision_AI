# ShopAI Frontend

Multi-page React application for the ShopAI AI-Based Import & Business Decision Support System.

## Stack

- React 18 + Vite
- Tailwind CSS
- React Router v6

## Run locally

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Architecture

```
src/
├── data/mockData.js      # All mock JSON — swap for live API later
├── services/api.js       # Async service layer (components import ONLY from here)
├── components/Navbar.jsx
├── pages/
│   ├── Dashboard.jsx
│   ├── Products.jsx
│   ├── Analysis.jsx
│   └── Inventory.jsx
├── App.jsx               # Layout + shared context
└── routes.jsx
```

## API service functions

| Function | Description |
|---|---|
| `searchProducts(query)` | Product search with 500ms mock delay |
| `getProductById(id)` | Single product lookup |
| `analyzeProduct({ product_id, quantity, selling_price_mmk, urgency })` | Full AI analysis payload |
| `getInventoryStatus()` / `getInventoryData()` | Stock list + decision log |

To connect the live backend, replace the function bodies in `src/services/api.js` with `fetch()` calls — no component changes required.

## Theme

- **White** — page backgrounds
- **Sky Blue** (`sky-500/600`) — navbar, primary actions, headers
- **Light Yellow** (`yellow-100`) — profit highlights, reorder alerts
