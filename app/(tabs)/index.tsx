import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, TextInput, Button, TouchableOpacity, Alert, StyleSheet, Modal, Text, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import YoutubePlayer from 'react-native-youtube-iframe';

const TMDB_API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNjU4NjlkNDQzNWUxZjhjNDZmNjJiMjlhOWQwM2E2NiIsIm5iZiI6MTY4MTk3NjIyOS44NTIsInN1YiI6IjY0NDBlYmE1Y2VlMmY2MDRjOTM1M2M5MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4xRIDEMw53S1istUweFWcdbsqVeDbaZ02LsiHCmDd18';

export default function HomeScreen() {
  const [movies, setMovies] = useState<{ id: number; title: string; poster_path: string }[]>([]);
  const [rentedMovies, setRentedMovies] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);


  useEffect(() => {
    fetchPopularMovies();
    loadRentedMovies();
  }, []);

  const fetchPopularMovies = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.themoviedb.org/3/movie/popular', {
        headers: { Authorization: `Bearer ${TMDB_API_KEY}` }
      });
      const data = await response.json();
      setMovies(data.results || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
    setLoading(false);
  };

  const searchMovies = async () => {
    if (query.length < 2) return;
    setLoading(true);
    try {
      const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`, {
        headers: { 
          Authorization: `Bearer ${TMDB_API_KEY}` 
        }
      });
      const data = await response.json();
      setMovies(data.results || []);
    } catch (error) {
      console.error('Error searching movies:', error);
    }
    setLoading(false);
  };

  const clearSearch = () => {
    setQuery('');
    fetchPopularMovies(); // Reset to initial movies
  };

  const loadRentedMovies = async () => {
    try {
      const stored = await AsyncStorage.getItem('rentedMovies');
      const parsed = JSON.parse(stored || '[]');
      setRentedMovies(parsed);
      console.log('Loaded rented movies:', parsed);
    } catch (error) {
      console.error('Error loading rented movies:', error);
    }
  };

  const logStorage = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const data = await AsyncStorage.multiGet(keys);
    console.log("AsyncStorage Data:", data);
  };

  const rentMovie = async (movie: any) => {
    console.log('rentMovie called for:', movie.title);

    if (Platform.OS === 'web') {
        // Web version - use confirm instead of Alert
        const confirmed = window.confirm(`Would you like to rent ${movie.title}?`);
        if (!confirmed) return;
        try {
            console.log('Starting rental process for:', movie.title);
            const newRentedMovies = [...rentedMovies, movie];
            await AsyncStorage.setItem('rentedMovies', JSON.stringify(newRentedMovies));
            setRentedMovies(newRentedMovies);
            setMovies(movies.filter(m => m.id !== movie.id));
            console.log('Movie rented successfully:', movie.title);
        } catch (error) {
            console.error('Detailed storage error:', error);
            window.alert('Failed to save rental');
        }
    } else {
        // Mobile version - use Alert.alert()
        Alert.alert(
            'Rent Movie',
            `Would you like to rent ${movie.title}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Rent',
                    onPress: async () => {
                        try {
                            console.log('Starting rental process for:', movie.title);
                            const newRentedMovies = [...rentedMovies, movie];
                            await AsyncStorage.setItem('rentedMovies', JSON.stringify(newRentedMovies));
                            setRentedMovies(newRentedMovies);
                            setMovies(movies.filter(m => m.id !== movie.id));
                            console.log('Movie rented successfully:', movie.title);
                            Alert.alert('Success', 'Movie rented successfully!');
                        } catch (error) {
                            console.error('Detailed storage error:', error);
                            Alert.alert('Error', 'Failed to save rental');
                        }
                    },
                },
            ]
        );
    }
};

  const fetchMovieTrailer = async (movieId: number) => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos`, {
        headers: { 
          Authorization: `Bearer ${TMDB_API_KEY}` 
        }
      });
      const data = await response.json();
      const youtubeVideo = data.results.find((video:any) => video.site === 'YouTube');

      if (youtubeVideo) {
        setTrailerKey(youtubeVideo.key);
        setModalVisible(true);
      } else {
        Alert.alert('Error', 'No trailer available.');
      }
    } catch (error) {
      console.error('Error fetching movie trailer:', error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search movies..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={searchMovies}
        />
        {query.length > 1 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <ThemedText type="defaultSemiBold">X</ThemedText>
          </TouchableOpacity>
        )}
        <Button title="Search" onPress={searchMovies} disabled={loading} />
      </View>
      <ThemedText type="subtitle" style={styles.sectionTitle}>Available Movies</ThemedText>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}  style={styles.image} />
            <ThemedText type="subtitle">{item.title}</ThemedText>
            <TouchableOpacity 
              style={styles.rentButton} 
              onPress={() => {
                console.log('TouchableOpacity pressed for:', item.title);
                rentMovie(item);
              }}
            >
              <ThemedText type="defaultSemiBold">Rent</ThemedText>
            </TouchableOpacity>
          </View>
        )}
      />

      <ThemedText type="subtitle" style={styles.sectionTitle}>Rented Movies</ThemedText>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => fetchMovieTrailer(item.id)} style={styles.card}>
            <Image 
              source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }} 
              style={styles.image} 
            />
            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Trailer Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {trailerKey ? (
              <YoutubePlayer height={300} play={true} videoId={trailerKey} />
            ) : (
              <Text>No trailer available</Text>
            )}
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </ThemedView>
    
  );
}



const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  searchContainer: { flexDirection: 'row', marginBottom: 10 },
  input: { flex: 1, borderWidth: 1, padding: 8, marginRight: 10, borderRadius: 5 },
  card: { padding: 10, marginBottom: 10, backgroundColor: '#ddd', borderRadius: 10 },
  image: { width: 100, height: 150, borderRadius: 5 },
  rentButton: { marginTop: 10, padding: 10, backgroundColor: '#ffcc00', alignItems: 'center', borderRadius: 5 },
  sectionTitle: {
    marginVertical: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  rentedLabel: {
    marginTop: 10,
    color: '#4CAF50',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  title: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  clearButton: {
    position: 'absolute',
    right: 65,
    padding: 8,
    zIndex: 1,
  },
});