import { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import SearchBar from './components/SearchBar/SearchBar';
import SortDropdown from './components/SortDropdown/SortDropdown';
import MovieList from './components/MovieList/MovieList';
import MovieModal from './components/MovieModal/MovieModal';
import Sidebar from './components/Sidebar/Sidebar';
import './App.css';

const App = () => {
  const [movies, setMovies] = useState([]);
  const [displayedMovies, setDisplayedMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('rating-desc');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [currentView, setCurrentView] = useState('home');
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [watched, setWatched] = useState(() => {
    const saved = localStorage.getItem('watched');
    return saved ? JSON.parse(saved) : [];
  });

  const API_KEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('watched', JSON.stringify(watched));
  }, [watched]);

  useEffect(() => {
    if (currentView === 'home') {
      fetchMovies();
    }
  }, [searchQuery, currentPage, currentView]);

  useEffect(() => {
    sortMovies();
  }, [movies, sortOption, currentView, favorites, watched]);

  const fetchMovies = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = searchQuery
        ? `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchQuery}&page=${currentPage}`
        : `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&page=${currentPage}`;

      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();

      if (currentPage === 1) {
        setMovies(data.results);
      } else {
        setMovies((prevMovies) => [...prevMovies, ...data.results]);
      }

      setHasMorePages(currentPage < data.total_pages);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching movies:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const sortMovies = () => {
    let moviesToSort = [];

    if (currentView === 'favorites') {
      moviesToSort = favorites;
    } else if (currentView === 'watched') {
      moviesToSort = watched;
    } else {
      moviesToSort = movies;
    }

    const sorted = [...moviesToSort].sort((a, b) => {
      switch (sortOption) {
        case 'rating-desc':
          return b.vote_average - a.vote_average;
        case 'rating-asc':
          return a.vote_average - b.vote_average;
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'release-desc':
          return new Date(b.release_date) - new Date(a.release_date);
        case 'release-asc':
          return new Date(a.release_date) - new Date(b.release_date);
        default:
          return 0;
      }
    });
    setDisplayedMovies(sorted);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setMovies([]);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    setCurrentPage(1);
  };

  const toggleFavorite = (movie) => {
    setFavorites((prev) => {
      const isFavorited = prev.some((fav) => fav.id === movie.id);
      if (isFavorited) {
        return prev.filter((fav) => fav.id !== movie.id);
      } else {
        return [...prev, movie];
      }
    });
  };

  const toggleWatched = (movie) => {
    setWatched((prev) => {
      const isWatched = prev.some((w) => w.id === movie.id);
      if (isWatched) {
        return prev.filter((w) => w.id !== movie.id);
      } else {
        return [...prev, movie];
      }
    });
  };

  const isFavorited = (movieId) => {
    return favorites.some((fav) => fav.id === movieId);
  };

  const isWatched = (movieId) => {
    return watched.some((w) => w.id === movieId);
  };

  return (
    <div className="App">
      <Sidebar
        currentView={currentView}
        onViewChange={handleViewChange}
        favoritesCount={favorites.length}
        watchedCount={watched.length}
      />

      <div className="app-with-sidebar">
        <Header />

        <main className="main-content">
          {currentView === 'home' && (
            <>
              <SearchBar onSearch={handleSearch} currentQuery={searchQuery} />
              <SortDropdown currentSort={sortOption} onSortChange={handleSortChange} />
            </>
          )}

          {currentView === 'favorites' && (
            <div className="view-header">
              <h2>❤️ My Favorites</h2>
              <SortDropdown currentSort={sortOption} onSortChange={handleSortChange} />
            </div>
          )}

          {currentView === 'watched' && (
            <div className="view-header">
              <h2>👁️ Watched Movies</h2>
              <SortDropdown currentSort={sortOption} onSortChange={handleSortChange} />
            </div>
          )}

          {error && (
            <div className="error-message" role="alert">
              <p>⚠️ Error: {error}</p>
            </div>
          )}

          <MovieList
            movies={displayedMovies}
            onMovieClick={handleMovieClick}
            isLoading={isLoading && currentPage === 1}
            toggleFavorite={toggleFavorite}
            toggleWatched={toggleWatched}
            isFavorited={isFavorited}
            isWatched={isWatched}
          />

          {currentView === 'home' && !isLoading && hasMorePages && displayedMovies.length > 0 && (
            <div className="load-more-container">
              <button
                className="load-more-button"
                onClick={handleLoadMore}
                aria-label="Load more movies"
              >
                Load More Movies
              </button>
            </div>
          )}

          {isLoading && currentPage > 1 && (
            <div className="loading-more">
              <div className="loading-spinner-small"></div>
              <p>Loading more movies...</p>
            </div>
          )}
        </main>

        <Footer />
      </div>

      <MovieModal
        movie={selectedMovie}
        onClose={handleCloseModal}
        isOpen={!!selectedMovie}
      />
    </div>
  );
};

export default App;
