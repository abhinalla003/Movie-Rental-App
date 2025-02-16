import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define Movie type
interface Movie {
  id: string;
  title: string;
  genre?: string;
  poster?: string;
}

// Define context type
interface RentedMoviesContextType {
  rentedMovies: Movie[];
  rentMovie: (movie: Movie) => Promise<void>;
  removeRentedMovie: (id: string) => Promise<void>;
}

// Define props for Provider
interface RentedMoviesProviderProps {
  children: ReactNode;
}

// Initialize context
const RentedMoviesContext = createContext<RentedMoviesContextType | undefined>(undefined);

export const RentedMoviesProvider: React.FC<RentedMoviesProviderProps> = ({ children }) => {
  const [rentedMovies, setRentedMovies] = useState<Movie[]>([]);

  const loadRentedMovies = async () => {
    try {
      const storedMovies = await AsyncStorage.getItem('rentedMovies');
      if (storedMovies) {
        setRentedMovies(JSON.parse(storedMovies));
      }
    } catch (error) {
      console.error('Error loading rented movies:', error);
    }
  };

  const rentMovie = async (movie: Movie) => {
    setRentedMovies(prevMovies => {
      const updatedMovies = [...prevMovies, movie];
      AsyncStorage.setItem('rentedMovies', JSON.stringify(updatedMovies));
      return updatedMovies;
    });
  };

  const removeRentedMovie = async (id: string) => {
    setRentedMovies(prevMovies => {
      const updatedMovies = prevMovies.filter(movie => movie.id !== id);
      AsyncStorage.setItem('rentedMovies', JSON.stringify(updatedMovies));
      return updatedMovies;
    });
  };

  useEffect(() => {
    loadRentedMovies();
  }, []);

  return (
    <RentedMoviesContext.Provider value={{ rentedMovies, rentMovie, removeRentedMovie }}>
      {children}
    </RentedMoviesContext.Provider>
  );
};

export const useRentedMovies = (): RentedMoviesContextType => {
  const context = useContext(RentedMoviesContext);
  if (!context) {
    throw new Error("useRentedMovies must be used within a RentedMoviesProvider");
  }
  return context;
};
