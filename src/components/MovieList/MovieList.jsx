import MovieCard from '../MovieCard/MovieCard';
import './MovieList.css';

const MovieList = ({
  movies,
  onMovieClick,
  isLoading,
  toggleFavorite,
  toggleWatched,
  isFavorited,
  isWatched
}) => {
  if (isLoading) {
    return (
      <div className="movie-list-loading">
        <div className="loading-spinner"></div>
        <p>Loading movies...</p>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="movie-list-empty">
        <p className="empty-message">No movies found. Try a different search!</p>
      </div>
    );
  }

  return (
    <section className="movie-list" aria-label="Movie grid">
      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onClick={onMovieClick}
            toggleFavorite={toggleFavorite}
            toggleWatched={toggleWatched}
            isFavorited={isFavorited}
            isWatched={isWatched}
          />
        ))}
      </div>
    </section>
  );
};

export default MovieList;
