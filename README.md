# 🪄 Giphy Search

React app for discovering trending and searchable GIFs using the Giphy API.

🌐 **[Live Demo](https://giphy-search-bb4e84c88b24.herokuapp.com/?q=dogs)**

<img
src="https://github.com/user-attachments/assets/37a0e407-6ab3-48ec-a386-3566c44c87b1"
width="400"
style="border-radius: 12px; margin-right: 10px; overflow: hidden;"
/>
<img
src="https://github.com/user-attachments/assets/7fcbaac5-6747-49c4-a771-15e2b9b067aa"
width="400"
style="border-radius: 12px; overflow: hidden;"
/>

---

## ✨ Features

- 🔍 **Search any GIF** by keyword or phrase
- 🔥 **Discover trending GIFs** with no input
- ⚡️ **Lazy loading & virtualization** for infinite scroll performance
- 📤 **Share-friendly** interface
- 🎯 Keyboard-friendly search box with autocompletion
- 💾 **In-memory caching** for previously fetched results (Can be easily substituted by other source of cache)
- 🔬 **Fully testable** architecture using `vitest`, `@testing-library/react`, and `ts-mockito`

---

## ✨ Architecture & Design

### ♻️ Data Layer
- Abstracted with the **Repository Pattern** via a `giphyRepository` module, allowing easy substitution of data sources (e.g. REST API, GraphQL, mock service, or static fixtures for testing)

### 🧱 Feature-based Modular Architecture

- Follows a **feature-first** folder structure under `features/giphy`, where each feature encapsulates its:
    - UI components
    - Hooks and state
    - Domain logic and types
    - DI setup and API integration

### ⚙️ Tech Stack

| Tool                 | Purpose                             |
|----------------------|-------------------------------------|
| `Vite`               | Ultra-fast dev/build toolchain      |
| `React 18`           | Component library                   |
| `React Router v7`    | Client-side routing                 |
| `masonic`            | High-perf masonry layout            |
| `@testing-library/react` | Declarative test framework     |
| `Vitest`             | Blazing fast unit testing           |
| `ts-mockito`         | Type-safe mocking for unit tests    |
| `Heroku`             | Deployment target                   |

---

## 🚀 Running Locally

```bash
npm install
npm run dev         # start dev server
npm run build       # build production bundle
npm run preview     # preview built version locally
