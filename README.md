# Pokedex Lite

A simple, fast, and user-friendly web app to browse, search, and favorite Pokemon using the PokéAPI.

Built with React and Vite, this project focuses on practicing API integration and managing UI state cleanly, while keeping performance smooth and avoiding unnecessary complexity.

---

## Features

* **Real-time Search:** Search for Pokemon by name, with results updating as you type.
* **Type Filtering:** Easily filter Pokemon by their elemental type.
* **Pagination:** Browse results in clean increments of 20 per page.
* **Favorites System:** Save your favorite Pokemon (persisted using localStorage).
* **Detailed Modal View:** Click a Pokemon to view stats and types.
* **Dark Mode:** Toggle between light and dark themes.
* **Smooth UI:** Includes hover effects, modal transitions, and subtle animations.

---

## Tech Stack

* React
* Vite
* Tailwind CSS
* PokéAPI

---

## How It Works

* **Optimized Fetching:** On initial load, the app fetches only Pokemon names and IDs. Detailed data (images, stats, types) is fetched only when needed.
* **Type Caching:** When a type is selected, the app fetches that list once and caches it for instant reuse.
* **Smart Search & Filtering:** Search and filters work together, and pagination resets automatically to avoid empty result pages.

---

## Getting Started

Clone the repository:

```bash
git clone https://github.com/Aashutosh24/pokedex-lite
cd pokedex-lite
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open in your browser:

```
http://localhost:5173
```

---

## Project Structure

```
src/
  App.jsx            // main logic (fetching + state)
  components/        // UI components
  Context/           // theme handling
```

---

## Notes & Design Choices

* **State Management:** Kept simple and predictable without external libraries.
* **Type Colors:** Manually mapped since PokéAPI doesn’t provide them.
* **User Experience:** Added a capture animation for favoriting to make interactions feel more engaging.

---

## Possible Improvements

* Evolution chain view
* Advanced filters (stats, abilities)
* Enhanced animations and transitions

---

## Credits

* PokéAPI for the data
* Pokemon (Nintendo / Game Freak)
