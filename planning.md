# Flixster Project Planning

## 1. Component Architecture

**Components to define:**

#### App
- **Responsibility**: Coordinate the entire application, manage global state, and handle data fetching from TMDb API
- **Renders**: The entire application layout including Header, SearchBar, SortDropdown, MovieList, MovieModal, and Footer
- **Props**: None (top-level component)
- **State**: 
  - `movies` (array) - list of movies to display
  - `selectedMovie` (object/null) - currently selected movie for modal
  - `searchQuery` (string) - current search term
  - `sortOption` (string) - current sort selection ('rating', 'title', 'release_date')
  - `isLoading` (boolean) - loading state for API calls
  - `error` (string/null) - error message if API fails
  - `currentPage` (number) - for pagination

#### Header
- **Responsibility**: Display the app branding and title
- **Renders**: App logo/title "Flixster" and tagline in a header bar
- **Props**: None
- **State**: None

#### SearchBar
- **Responsibility**: Accept user search input and trigger search functionality
- **Renders**: An input field with search icon and submit button
- **Props**: 
  - `onSearch` (function) - callback to parent when search is submitted
  - `currentQuery` (string) - current search value to display
- **State**: 
  - `inputValue` (string) - tracks what user is currently typing

#### SortDropdown
- **Responsibility**: Allow users to change the sorting order of movies
- **Renders**: A dropdown menu with sort options (Rating High-Low, Rating Low-High, Title A-Z, Release Date)
- **Props**: 
  - `currentSort` (string) - currently selected sort option
  - `onSortChange` (function) - callback when user changes sort
- **State**: None (controlled by parent)

#### MovieList
- **Responsibility**: Display a grid of movie cards
- **Renders**: A responsive grid container with multiple MovieCard components
- **Props**: 
  - `movies` (array) - array of movie objects to display
  - `onMovieClick` (function) - callback when a movie card is clicked
  - `isLoading` (boolean) - to show loading state
- **State**: None

#### MovieCard
- **Responsibility**: Display a single movie's basic information as a clickable card
- **Renders**: A card with movie poster, title, rating, and release year
- **Props**: 
  - `movie` (object) - movie data including title, poster_path, vote_average, release_date, id
  - `onClick` (function) - callback when card is clicked
- **State**: None (purely presentational)

#### MovieModal
- **Responsibility**: Display detailed information about a selected movie in a modal overlay
- **Renders**: Modal overlay with movie poster, title, overview, runtime, genres, rating, release date, and AI-generated recommendation
- **Props**: 
  - `movie` (object/null) - selected movie object with basic info
  - `onClose` (function) - callback to close the modal
  - `isOpen` (boolean) - whether modal should be visible
- **State**: 
  - `movieDetails` (object/null) - full movie details from API (runtime, genres)
  - `aiRecommendation` (string/null) - AI-generated watch recommendation
  - `isLoadingDetails` (boolean) - loading state for movie details API
  - `isLoadingAI` (boolean) - loading state for AI response

#### Footer
- **Responsibility**: Display credits and attribution
- **Renders**: Footer bar with creator name and TMDb attribution/logo
- **Props**: None
- **State**: None

### Component Hierarchy
```
App
├── Header
├── SearchBar
├── SortDropdown
├── MovieList
│   └── MovieCard (multiple instances)
├── MovieModal (conditional render)
└── Footer
```

---

## 2. API Contracts

#### Now Playing Endpoint
- **URL**: `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&page=${pageNumber}`
- **Required params**: 
  - `api_key` (string) - your TMDb API key
  - `page` (number, optional) - page number for pagination (default: 1)
- **Response fields needed**: 
  - `results` (array) - array of movie objects
  - `results[].id` (number) - movie ID
  - `results[].title` (string) - movie title
  - `results[].poster_path` (string) - poster image path
  - `results[].vote_average` (number) - rating
  - `results[].release_date` (string) - release date
  - `results[].overview` (string) - movie description
  - `total_pages` (number) - for pagination
- **Error cases**: 
  - Invalid API key (401)
  - Network failure
  - Rate limit exceeded (429)
  - Invalid page number

#### Search Endpoint
- **URL**: `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchQuery}&page=${pageNumber}`
- **Required params**: 
  - `api_key` (string) - your TMDb API key
  - `query` (string) - search term from user
  - `page` (number, optional) - page number
- **Response fields needed**: 
  - Same as Now Playing endpoint (results array with movie objects)
- **Error cases**: 
  - Empty query string
  - No results found (empty results array)
  - Invalid API key (401)
  - Network failure

#### Movie Details Endpoint
- **URL**: `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
- **Required params**: 
  - `api_key` (string) - your TMDb API key
  - `movieId` (number) - ID of the movie (from URL path)
- **Response fields needed**: 
  - `runtime` (number) - movie runtime in minutes
  - `genres` (array) - array of genre objects with `id` and `name`
  - `budget` (number) - movie budget
  - `revenue` (number) - movie revenue
  - All fields from Now Playing (title, overview, poster_path, etc.)
- **Error cases**: 
  - Invalid movie ID (404)
  - Movie not found
  - Invalid API key (401)
  - Network failure

#### Other endpoints
- **Image Base URL**: `https://image.tmdb.org/t/p/w500${poster_path}` for displaying poster images
- **Potential future endpoint**: Videos/Trailers endpoint if implementing trailer feature

---

## 3. State Architecture

#### Movie List State
- **Variable name**: `movies`
- **Type**: Array of movie objects
- **Initial value**: `[]` (empty array)
- **Owner component**: App
- **Update triggers**: 
  - App loads (fetch Now Playing)
  - User submits search (fetch Search results)
  - User changes page (fetch new page)
  - User clears search (fetch Now Playing again)

#### Search Query State
- **Variable name**: `searchQuery`
- **Type**: String
- **Initial value**: `""` (empty string)
- **Owner component**: App
- **Update triggers**: 
  - User submits search from SearchBar
  - User clears search

#### Page Number State
- **Variable name**: `currentPage`
- **Type**: Number
- **Initial value**: `1`
- **Owner component**: App
- **Update triggers**: 
  - User clicks "Next" or "Previous" pagination buttons
  - User submits new search (reset to 1)

#### Selected Movie State (for modal)
- **Variable name**: `selectedMovie`
- **Type**: Object or null
- **Initial value**: `null`
- **Owner component**: App
- **Update triggers**: 
  - User clicks a MovieCard (set to clicked movie object)
  - User closes modal (set to null)

#### Sort Option State
- **Variable name**: `sortOption`
- **Type**: String
- **Initial value**: `"rating-desc"` (rating high to low)
- **Owner component**: App
- **Update triggers**: 
  - User selects different option from SortDropdown
  - After state updates, movies array is sorted client-side

#### Loading State
- **Variable name**: `isLoading`
- **Type**: Boolean
- **Initial value**: `false`
- **Owner component**: App
- **Update triggers**: 
  - Set to `true` when API fetch starts
  - Set to `false` when API fetch completes (success or error)

#### Error State
- **Variable name**: `error`
- **Type**: String or null
- **Initial value**: `null`
- **Owner component**: App
- **Update triggers**: 
  - Set to error message string when API fetch fails
  - Set to `null` when new successful fetch starts

#### Other state identified:
- **SearchBar Input State**:
  - Variable: `inputValue`
  - Type: String
  - Owner: SearchBar component
  - Tracks what user is typing in real-time (before submit)

- **MovieModal Details State**:
  - Variable: `movieDetails`
  - Type: Object or null
  - Owner: MovieModal component
  - Fetches full details when modal opens

- **MovieModal AI State**:
  - Variable: `aiRecommendation`
  - Type: String or null
  - Owner: MovieModal component
  - Stores AI-generated recommendation text

---

## 4. Data Flow

### 1. API to Component Flow

**When the app loads:**
1. App component mounts
2. `useEffect` hook in App triggers on mount
3. App makes API call to TMDb "Now Playing" endpoint
4. App sets `isLoading = true`
5. API returns JSON response with movies array
6. App sets `movies` state with response data
7. App sets `isLoading = false`

**Data transformation:**
- Poster paths need to be prefixed with TMDb image base URL: `https://image.tmdb.org/t/p/w500${poster_path}`
- Can transform in App before passing to children, or in MovieCard when rendering

**Data path:**
```
TMDb API → App (stores in movies state) → MovieList (receives movies prop) → MovieCard (receives individual movie prop) → Renders on screen
```

### 2. User Interaction Flow

**When user clicks a MovieCard:**
1. User clicks on a MovieCard
2. MovieCard's `onClick` prop is triggered with the movie object
3. This calls App's `handleMovieClick` function
4. App sets `selectedMovie` state to the clicked movie object
5. App passes `selectedMovie` as prop to MovieModal
6. MovieModal receives non-null movie prop, sets `isOpen = true`
7. MovieModal makes API call to Movie Details endpoint using `movie.id`
8. MovieModal stores runtime, genres in its own `movieDetails` state
9. MovieModal also triggers AI API call with movie data
10. Modal displays with all information

**Flow diagram:**
```
Click MovieCard → MovieCard calls onClick(movie) → App's handleMovieClick(movie) → App updates selectedMovie state → MovieModal receives movie prop → MovieModal fetches details → Modal displays
```

### 3. Search Flow

**When user searches:**
1. User types in SearchBar input field
2. SearchBar updates its local `inputValue` state on each keystroke
3. User presses Enter or clicks Search button
4. SearchBar calls `onSearch(inputValue)` prop function
5. This triggers App's `handleSearch` function with the search query
6. App sets `searchQuery` state and `currentPage = 1`
7. App's `useEffect` watching `searchQuery` triggers
8. App makes API call to Search endpoint with the query
9. App sets `isLoading = true`
10. API returns search results
11. App updates `movies` state with search results
12. App sets `isLoading = false`
13. MovieList re-renders with new movies
14. MovieCards display search results

**Flow diagram:**
```
Type in SearchBar → Update inputValue state → Submit → Call App's handleSearch → Update searchQuery state → useEffect triggers API call → Update movies state → MovieList re-renders → Display results
```

---

## 5. AI Feature Spec

### 1. Component Integration
- **Display component**: MovieModal
- **Trigger**: Automatically when modal opens with a selected movie
- **Placement**: Below the movie overview, in a dedicated "AI Recommendation" section with a distinct background color or border

### 2. Data Context
**Movie data to send to AI:**
- `title` (string) - movie name
- `genres` (array) - list of genres
- `overview` (string) - movie description
- `vote_average` (number) - rating score
- `release_date` (string) - when it was released

**System prompt approach:**
```
"You are a movie recommendation assistant. Based on the following movie details, provide a brief 2-3 sentence recommendation on whether someone should watch this movie and why. Be enthusiastic but honest.

Movie: [title]
Genres: [genres]
Overview: [overview]
Rating: [rating]/10
Release Year: [year]

Provide your recommendation:"
```

### 3. AI Response
- **Format**: 2-3 sentences in paragraph form
- **Tone**: Friendly, enthusiastic, conversational
- **Content**: Should include:
  - Who would enjoy this movie (audience)
  - What makes it worth watching
  - Any notable strengths or cautions
- **Example**: "If you love sci-fi epics with stunning visuals, Dune is a must-watch. Denis Villeneuve crafts a mesmerizing adaptation with breathtaking cinematography and a powerful score. Perfect for fans of complex world-building and political intrigue."

### 4. State Management
- **State location**: `aiRecommendation` (string/null) lives in **MovieModal** component
- **Loading state**: `isLoadingAI` (boolean) also in MovieModal
- **Trigger**: When MovieModal opens and receives a movie prop
- **Fetch logic**:
  ```javascript
  useEffect(() => {
    if (movie) {
      setIsLoadingAI(true);
      // Call AI API (Claude API or similar)
      fetchAIRecommendation(movie)
        .then(response => setAiRecommendation(response))
        .catch(error => setAiRecommendation("Unable to generate recommendation"))
        .finally(() => setIsLoadingAI(false));
    }
  }, [movie]);
  ```
- **Error handling**: Display fallback message "AI recommendation unavailable" if request fails

### 5. User Experience
- **Visual display**:
  - Section header: "🤖 AI Recommendation"
  - Light background color to distinguish from movie details
  - Loading spinner with text "Generating recommendation..." while fetching
  - Fade-in animation when recommendation loads
  
- **Regenerate option**: 
  - Include a "↻ Regenerate" button next to section header
  - Clicking re-triggers AI API call with same movie data
  - Useful if user wants a different perspective

- **Caching strategy**: 
  - Fetch fresh each time modal opens (don't cache)
  - Reasoning: Keeps recommendations feeling dynamic and personalized
  - Alternative: Could cache by movie ID to save API calls, but less engaging

### AI API Integration Plan
- **Service**: Use Claude API (Anthropic) or OpenAI API
- **Endpoint**: Will need backend proxy to hide API key (or use Vercel serverless function)
- **Rate limiting**: Consider limiting to one request per movie per modal open
- **Cost consideration**: Monitor usage, potentially add caching if API costs become high

---

## Next Steps

- [x] Complete component architecture
- [x] Define all API contracts
- [x] Map out state architecture
- [x] Document data flow
- [x] Spec out AI feature
- [ ] Review this spec with Claude for gaps
- [ ] Commit this file to repo
- [ ] Begin implementation starting with Milestone 1
