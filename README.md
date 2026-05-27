# SALTEDHASH FlashFocus

FlashFocus is a standalone PWA designed for solo founders to quickly create dynamic landing pages using drag-and-drop blocks.

It is a lightweight, local-first product leveraging JSON file storage without the need for external database providers, offering an installable, mobile-first, offline-capable experience.

## Stack
- Frontend: Vue 3, Vite, Tailwind CSS, Pinia, Vue Router
- Backend: Express, Node.js, TypeScript
- Storage: Local file-system JSON

## Setup & Run Locally

1. Install dependencies from the root directory:
   \`\`\`bash
   npm install
   \`\`\`
2. Start both Frontend and Backend concurrently using the workspace scripts:
   \`\`\`bash
   npm run dev &
   \`\`\`

## Development

- Frontend code is located in \`/frontend\`.
- Backend code is located in \`/backend\`.
- Shared code (types, utilities) is in \`/shared\`.
- JSON Data is stored in \`/data\`.

## Features
- Offline fallback page and Install Prompt (PWA).
- Offline editor capabilities leveraging localStorage drafts.
- Salted hash authentication natively handled with JSON data.
- Drag-and-drop block based landing page builder.
