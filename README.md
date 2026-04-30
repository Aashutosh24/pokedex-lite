# Pokedex Lite

This is a small project I built to explore working with APIs and React in a more practical way.  
The idea was to create a simple Pokedex where you can browse Pokemon, search them, filter by type, and keep track of your favorites.

I didn’t want this to feel like a basic CRUD app, so I focused on keeping the UI smooth and the data handling clean.

---

## What this app does

- Search Pokemon by name (updates instantly)
- Filter Pokemon by type
- Add Pokemon to favorites (stored in browser)
- View detailed stats in a popup
- Toggle between light and dark mode
- Load Pokemon gradually instead of everything at once

---

## Tech used

- React  
- Vite  
- Tailwind CSS  
- PokeAPI  

Nothing fancy — just kept it simple and focused.

---

## How the app works

Instead of loading all Pokemon at once, the app loads them in parts.  
Every time you click "Load More", it fetches the next set and adds it to the list.

Search and filters run on whatever data is already loaded, which keeps things fast and avoids unnecessary API calls.

---

## Running the project

Clone the repo:

```bash
git clone <your-repo-url>
cd pokedex-lite
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install all required packages:
- **React** 19.2.5 - UI framework
- **React DOM** 19.2.5 - React rendering
- **Tailwind CSS** 4.2.4 - Utility-first CSS
- **Vite** 8.0.10 - Build tool and dev server
- **ESLint** 10.2.1 - Code quality tool

## Getting Started

Start the app:

```npm run dev

Open in browser:

http://localhost:5173
```

## Project Structure

```
src/
├── App.jsx                 # Main component with API logic and state management
├── App.css                 # Styles and animations (pokéball capture effect, etc.)
├── main.jsx                # Entry point
├── index.css               # Global styles (body background, typography)
├── components/
│   ├── pokemonCard.jsx     # Individual Pokémon card with favorite animation
│   ├── PokemonModal.jsx    # Detail modal showing stats and information
│   ├── favoritesToggle.jsx # Button to toggle favorite filter
│   ├── ThemeBtn.jsx        # Light/Dark theme toggle switch
│   ├── Search_Filter.jsx   # Search and filter controls
│   ├── pokeballBurst.jsx   # Pokéball animation effect (optional)
└── Context/
    └── theme.js            # Theme context for dark mode

public/                     # Static assets
vite.config.js             # Vite configuration
tailwind.config.js         # Tailwind CSS configuration
eslint.config.js           # ESLint rules
package.json               # Dependencies and scripts
```

## How It Works

### Search
The search feature filters Pokémon by name in real-time. As you type, the app searches through the complete Pokémon list and updates the grid instantly.

### Type Filtering
Select a type from the dropdown to filter Pokémon that have that type. The app fetches the Pokémon list for the selected type from PokéAPI.

### Favorites
Click the heart icon (♡) on any card to add it to favorites. The heart becomes filled (♥) and the app saves your favorites to browser localStorage so they persist between sessions.

### Details Modal
Click on any Pokémon card to open a modal showing:
- Full Pokémon image
- Name and Pokédex ID
- All types
- Stats: HP, Height, Attack, Defense, Speed

### Theme Toggle
Use the theme button in the header to switch between light and dark modes. Your preference is applied to all UI elements including the background, text, and cards.

### Pagination
The fixed footer at the bottom shows your current page and allows you to navigate through pages of 20 Pokémon each. The Prev button disables on the first page, and Next disables on the last page.

## Technologies Used

- **React** - JavaScript UI library for component-based development
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework for styling
- **PokéAPI** - Free Pokémon data API (https://pokeapi.co)
- **React Context** - For managing theme state across the app
- **localStorage** - Browser API for persisting favorites

## Key Dependencies

```json
{
  "@tailwindcss/vite": "^4.2.4",
  "react": "^19.2.5",
  "react-dom": "^19.2.5",
  "tailwindcss": "^4.2.4"
}
```

## Development Tools

```json
{
  "@vitejs/plugin-react": "^6.0.1",
  "eslint": "^10.2.1",
  "eslint-plugin-react-hooks": "^7.1.1",
  "vite": "^8.0.10"
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari 15+
- Edge (latest)

## Performance Optimizations

- **Lazy Loading**: Pokémon details are only fetched when needed
- **Memoization**: Search and filter results are memoized to prevent unnecessary re-renders
- **Code Splitting**: Vite automatically splits code for better performance
- **Image Optimization**: Official Pokémon artwork is served with responsive loading

## API Endpoints Used

- `GET /pokemon?limit=2000` - Fetch all Pokémon list
- `GET /type` - Fetch all types
- `GET /type/{name}` - Fetch Pokémon of a specific type
- `GET /pokemon/{id}` - Fetch details for a specific Pokémon

## Troubleshooting

### App won't start
- Make sure Node.js v18+ is installed: `node --version`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check if port 5173 is available

### Pokémon data not loading
- Check your internet connection
- PokéAPI might be temporarily down (check https://pokeapi.co)
- Clear browser cache and reload

### Dark theme not persisting
- Check if localStorage is enabled in your browser
- Clear browser data and try again

### Favorites not saving
- Ensure localStorage is enabled
- Check browser privacy settings aren't blocking storage

## Future Enhancements

Possible features to add:
- Pokemon evolution chains
- Move sets and abilities
- Team building feature
- Advanced filters (by stat ranges)
- Comparison tool for multiple Pokémon
- Offline support with service workers

## License

This project is open source and available for personal and educational use.

## Acknowledgments

- **PokéAPI** - Providing free Pokémon data
- **Pokémon** - Nintendo/Game Freak for the original Pokémon series
- **Tailwind CSS** - Beautiful utility-first CSS framework
- **React & Vite** - Amazing tools for modern web development
