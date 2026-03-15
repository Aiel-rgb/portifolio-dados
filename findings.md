# 🔍 Findings - Portfolio Persistence & Migration

- **Discovery**: Repository Name Mismatch!
    - Local Repo (Downloads): `Portifolio_dados` (underscore)
    - Vercel Repo: `portifolio-dados` (dash)
    - Vercel is deploying from a different repository than the one being pushed to locally.
- **Current Issue**: Projects are stored in an in-memory array or specific DB, but redeploys aren't picking up code changes because of the repo mismatch.
- **Current Deployment**: Vercel (reported as unstable/unreliable for this specific use case).
- **Proposed Solution**: 
    1.  Implement a persistent database (Supabase or PostgreSQL on Railway).
    2.  Migrate the API to interact with the database.
    3.  Move deployment to a platform that supports persistent environments better or simply provide a stable DB link.

## Piton Coder Buttons
- **Active File:** `/home/gabriel/Downloads/Portifolio_novo-main/src/app/page.tsx`
- **Goal:** Add two buttons to "Piton Coder" card.
- **Links:**
    - Streamlit: `https://aiel-rgb-piton-coder-ia-coder-qklja7.streamlit.app/`
    - GitHub: TBD
