import React, { createContext, useContext, useEffect, useState } from 'react';

const MovieContext = createContext(null);
const TMDB_API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNjU4NjlkNDQzNWUxZjhjNDZmNjJiMjlhOWQwM2E2NiIsIm5iZiI6MTY4MTk3NjIyOS44NTIsInN1YiI6IjY0NDBlYmE1Y2VlMmY2MDRjOTM1M2M5MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4xRIDEMw53S1istUweFWcdbsqVeDbaZ02LsiHCmDd18';

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);

  const fetchMovies = async () => {
    try {
        const response = await fetch('https://api.themoviedb.org/3/movie/popular', {
            headers: { Authorization: `Bearer ${TMDB_API_KEY}` }
          });
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const removeMovie = (id) => {
    setMovies((prevMovies) => prevMovies.filter(movie => movie.id !== id));
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <MovieContext.Provider value={{ movies, removeMovie }}>
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => {
  return useContext(MovieContext);
}; 