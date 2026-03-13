# 💎 B.L.A.S.T. Data Schema - Piton Coder Buttons

## 📊 Input Payload (Project Object)
The current `Project` type in `src/app/api/projects/route.ts` needs to be expanded to support secondary links for specific projects.

```json
{
  "id": "number",
  "name": "string",
  "link": "string (GitHub)",
  "siteLink": "string (Optional Streamlit/Site link)",
  "description": "string",
  "stacks": "string"
}
```

## 📊 Output Payload (UI Component)
The `ProjectCard` component will render:
1.  **Primary Button (GitHub):** 
    - Text: "GitHub" or "Código"
    - Style: Outline, fills black on hover.
2.  **Secondary Button (Site):**
    - Text: "Live Demo" or "Ver Site"
    - Style: Premium accent color button.

## 🛠️ Implementation Strategy
- Update `api/projects/route.ts` to include `siteLink`.
- Update `ProjectCard` in `page.tsx` to render two buttons if `siteLink` exists.
