import { useState, useEffect } from 'react';
import './MovieModal.css';

const MovieModal = ({ movie, onClose, isOpen }) => {
  const [movieDetails, setMovieDetails] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const API_KEY = import.meta.env.VITE_API_KEY;
  const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
  const BACKDROP_URL = 'https://image.tmdb.org/t/p/original';

  useEffect(() => {
    if (movie && isOpen) {
      fetchMovieDetails();
      fetchTrailer();
      fetchAIRecommendation();
    }
  }, [movie, isOpen]);

  const fetchMovieDetails = async () => {
    setIsLoadingDetails(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}`
      );
      const data = await response.json();
      setMovieDetails(data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const fetchTrailer = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}`
      );
      const data = await response.json();
      const trailer = data.results.find(
        (video) => video.type === 'Trailer' && video.site === 'YouTube'
      );
      if (trailer) {
        setTrailerKey(trailer.key);
      }
    } catch (error) {
      console.error('Error fetching trailer:', error);
    }
  };

  const fetchAIRecommendation = async () => {
    setIsLoadingAI(true);

    try {
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

      console.log('=== AI REQUEST DEBUG ===');
      console.log('API Key exists:', !!apiKey);
      console.log('API Key starts with sk-or:', apiKey?.startsWith('sk-or'));

      if (!apiKey) {
        setAiRecommendation('OpenRouter API key is missing. Please add it to your .env file.');
        setIsLoadingAI(false);
        return;
      }

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.trim()}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Flixster Movie App'
        },
        body: JSON.stringify({
          model: 'openrouter/auto',
          messages: [
            {
              role: 'user',
              content: `You are a movie critic. Based on this movie, give a brief 2-3 sentence recommendation on whether someone should watch it.

Movie: ${movie.title}
Overview: ${movie.overview || 'No overview available'}
Rating: ${movie.vote_average}/10

Give an enthusiastic but honest recommendation:`
            }
          ]
        })
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (data.choices && data.choices[0] && data.choices[0].message) {
        setAiRecommendation(data.choices[0].message.content);
      } else if (data.error) {
        console.error('OpenRouter Error:', data.error);
        const errorMsg = data.error.message || JSON.stringify(data.error);
        setAiRecommendation(`Error: ${errorMsg}. Check console for details.`);
      } else {
        setAiRecommendation('Unexpected response format. Check console for details.');
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      setAiRecommendation(`Network error: ${error.message}`);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleRegenerateAI = () => {
    fetchAIRecommendation();
  };

  if (!isOpen || !movie) return null;

  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  const backdropUrl = movie.backdrop_path
    ? `${BACKDROP_URL}${movie.backdrop_path}`
    : null;

  const runtime = movieDetails?.runtime
    ? `${movieDetails.runtime} min`
    : 'N/A';

  const genres = movieDetails?.genres
    ? movieDetails.genres.map((g) => g.name).join(', ')
    : 'Loading...';

  const releaseDate = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A';

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close-button"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        {backdropUrl && (
          <div className="modal-backdrop-image">
            <img
              src={backdropUrl}
              alt={`${movie.title} backdrop`}
              className="backdrop-img"
            />
            <div className="backdrop-overlay"></div>
          </div>
        )}

        <div className="modal-body">
          <div className="modal-poster-section">
            <img
              src={posterUrl}
              alt={`${movie.title} poster`}
              className="modal-poster"
            />
          </div>

          <div className="modal-info-section">
            <h2 id="modal-title" className="modal-title">
              {movie.title}
            </h2>

            <div className="modal-meta">
              <span className="modal-rating" aria-label={`Rating: ${movie.vote_average} out of 10`}>
                ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}/10
              </span>
              <span className="modal-runtime">{runtime}</span>
              <span className="modal-release-date">{releaseDate}</span>
            </div>

            <div className="modal-genres">
              <strong>Genres:</strong> {genres}
            </div>

            <div className="modal-overview">
              <h3>Overview</h3>
              <p>{movie.overview || 'No overview available.'}</p>
            </div>

            {trailerKey && (
              <div className="modal-trailer-section">
                <h3>🎬 Trailer</h3>
                <div className="trailer-container">
                  <iframe
                    width="100%"
                    height="315"
                    src={`https://www.youtube.com/embed/${trailerKey}`}
                    title="Movie trailer"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            <div className="modal-ai-section">
              <div className="ai-header">
                <h3>🤖 AI Recommendation</h3>
                <button
                  className="ai-regenerate-button"
                  onClick={handleRegenerateAI}
                  aria-label="Regenerate AI recommendation"
                  disabled={isLoadingAI}
                >
                  ↻ Regenerate
                </button>
              </div>
              {isLoadingAI ? (
                <div className="ai-loading">
                  <div className="ai-spinner"></div>
                  <p>Generating recommendation...</p>
                </div>
              ) : (
                <p className="ai-recommendation">{aiRecommendation}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
