import './MovieCard.css';

const MovieCard = ({ movie, onClick, toggleFavorite, toggleWatched, isFavorited, isWatched }) => {
  const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : 'N/A';

  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  const favorited = isFavorited ? isFavorited(movie.id) : false;
  const watched = isWatched ? isWatched(movie.id) : false;

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (toggleFavorite) {
      toggleFavorite(movie);
    }
  };

  const handleWatchedClick = (e) => {
    e.stopPropagation();
    if (toggleWatched) {
      toggleWatched(movie);
    }
  };

  return (
    <article
      className="movie-card"
      onClick={() => onClick(movie)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick(movie);
        }
      }}
      aria-label={`View details for ${movie.title}`}
    >
      <div className="movie-card-image-container">
        <img
          src={posterUrl}
          alt={`${movie.title} movie poster`}
          className="movie-card-image"
          loading="lazy"
        />
        <div className="movie-card-overlay">
          <span className="movie-card-click-text">Click for details</span>
        </div>
        {(toggleFavorite || toggleWatched) && (
          <div className="movie-card-actions">
            {toggleFavorite && (
              <button
                className={`action-button favorite-button ${favorited ? 'active' : ''}`}
                onClick={handleFavoriteClick}
                aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
                title={favorited ? 'Remove from favorites' : 'Add to favorites'}
              >
                {favorited ? '❤️' : '🤍'}
              </button>
            )}
            {toggleWatched && (
              <button
                className={`action-button watched-button ${watched ? 'active' : ''}`}
                onClick={handleWatchedClick}
                aria-label={watched ? 'Mark as unwatched' : 'Mark as watched'}
                title={watched ? 'Mark as unwatched' : 'Mark as watched'}
              >
                {watched ? '👁️' : '👀'}
              </button>
            )}
          </div>
        )}
      </div>
      <div className="movie-card-content">
        <h3 className="movie-card-title">{movie.title}</h3>
        <div className="movie-card-info">
          <span className="movie-card-rating" aria-label={`Rating: ${rating} out of 10`}>
            ⭐ {rating}
          </span>
          <span className="movie-card-year">{releaseYear}</span>
        </div>
      </div>
    </article>
  );
};

export default MovieCard;
