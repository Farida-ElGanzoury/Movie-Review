import React, { useState, useRef, useEffect } from "react";
import "./styles.css";

interface Movie {
  id: number;
  name: string;
  review: string;
  rating: number;
}

interface StarRatingProps {
  rating: number;
  onRate: (rating: number) => void;
}

interface MovieItemProps {
  movie: Movie;
  onRemove: (id: number) => void;
  onUpdate: (id: number, field: keyof Movie, newValue: string | number) => void;
}

function StarRating({ rating, onRate }: StarRatingProps) {
  if (rating === 0) {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((starNumber) => (
          <span
            key={starNumber}
            className="star dim"
            onClick={() => onRate(starNumber)}
          >
            ★
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="star-rating">
      {Array.from({ length: rating }).map((_, index) => (
        <span
          key={index}
          className="star lit"
          onClick={() => onRate(0)}
          title="Click to reset rating"
        >
          ★
        </span>
      ))}
    </div>
  );
}

function MovieItem({ movie, onRemove, onUpdate }: MovieItemProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Automatically adjust height based on scrollHeight
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [movie.review]);

  return (
    <div className="movie-card">
      <div className="movie-header">
        <h3 className="movie-title">{movie.name}</h3>
        <button
          className="delete-btn"
          onClick={() => onRemove(movie.id)}
          aria-label="Remove movie"
        >
          ✕ Remove
        </button>
      </div>

      <StarRating
        rating={movie.rating}
        onRate={(chosenNumber) => onUpdate(movie.id, "rating", chosenNumber)}
      />

      <textarea
        ref={textareaRef}
        className="review-textarea"
        value={movie.review}
        placeholder="Share your raw thoughts here—whether you are saving them for later, skipping spoilers for friends, or just having a deep conversation with yourself and your imagination."
        onChange={(e) => onUpdate(movie.id, "review", e.target.value)}
        rows={1}
      />
    </div>
  );
}

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [newTitle, setNewTitle] = useState("");

  const addMovie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newMovie: Movie = {
      id: Date.now(),
      name: newTitle.trim(),
      review: "",
      rating: 0,
    };

    setMovies((prevMovies) => [...prevMovies, newMovie]);
    setNewTitle("");
  };

  const removeMovie = (id: number) => {
    setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== id));
  };

  const updateMovie = (
    id: number,
    field: keyof Movie,
    newValue: string | number
  ) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === id ? { ...movie, [field]: newValue } : movie
      )
    );
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>My Movie WatchList</h1>
        <p className="subtitle">
          Keep track of cinema moments and record your personal thoughts on
          every watch. Customize a unique Expirience
        </p>
      </header>

      <form className="add-movie-form" onSubmit={addMovie}>
        <input
          type="text"
          className="movie-input"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Enter movie title..."
        />
        <button type="submit" className="add-btn">
          Add Movie
        </button>
      </form>

      <div className="movie-list">
        {movies.map((movie) => (
          <MovieItem
            key={movie.id}
            movie={movie}
            onRemove={removeMovie}
            onUpdate={updateMovie}
          />
        ))}
      </div>
    </div>
  );
}
