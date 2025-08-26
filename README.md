# Pokédex — Frontend Engineering Challenge (Bloq.it)

Bloq.it Frontend Engineering Challenge: Build a Pokédex app using Vue 3;
Challenge details: [link](https://github.com/bloqit/fe-engineering-challenge/blob/main/README.md)

> Powered by the public [PokéAPI](https://pokeapi.co/). No keys, no fuss.

---

## 🧩 Tech Stack

- **Vue 3** + **TypeScript** (Composition API)
- **Pinia** for state management
- **Vite** dev/build tooling
- **Vue Router**
- **Axios** for API
- **LocalStorage** (simple repo layer) for persistence
- **Vitest** for unit tests
- **Shadcn-Vue** for UI elements

---

## 🚀 Getting Started

\`\`\`bash
# 1) Set correct Node version
nvm use

# 2) Install dependencies
npm install

# 3) Run dev server
npm run dev

# 4) Open in browser
http://localhost:5174/
\`\`\`

You can also access the deployed app directly via:  [this link](https://alexop.dev/posts/how-to-structure-vue-projects/)

---

## 🗂️ Project Structure

I followed [this article](https://alexop.dev/posts/how-to-structure-vue-projects/) as a reference.  
Since this is a small project, I opted for the simpler structure.  
I am aware this approach is **not the most scalable** and would adjust for a larger production app.

---

## 🗺️  TODO

- Improve accessibility
- Add e2e tests
- Use GraphQL (provided by Pokemon API)
- Use virtual scroll
- Loading on scroll / Lazy loading scroll
- Improve test coverage
- Support internationalization (i18n)
- Improve offline support (store number of available Pokémon in local storage)
- Improve offline image support (SVG fallback or SW caching)
- Externalize component properties for better testing  
- A LOT of TODOs to solve :/
