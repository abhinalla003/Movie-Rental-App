import { 
    View, FlatList, Image, TextInput, Button, TouchableOpacity, 
    ActivityIndicator, StyleSheet, Text, Modal, useWindowDimensions, Platform,Alert
  } from 'react-native';
import { useRentedMovies } from '../app/contexts/RentedMoviesContext'; // Ensure this path is correct

  // 📌 MovieCard Component (Responsive)
const MovieCard = ({ movie, onPress, numColumns }: { 
    movie: any; 
    onPress: () => void; 
    numColumns: number; 
}) => {
    const { width } = useWindowDimensions();
    const { rentMovie } = useRentedMovies(); // Get rentMovie from context
    
    // Adjust size dynamically based on screen width
    const isDesktop = width > 1024;
    const cardWidth = isDesktop ? width / numColumns - 30 : width / numColumns - 20;
    const cardHeight = isDesktop ? cardWidth * 1.7 : cardWidth * 1.5;
    
    const rentMovie1 = async (movie: any) => {
      console.log('rentMovie called for:', movie.title);
      const rentalPrice = (Math.random() * (9.99 - 2.99) + 2.99).toFixed(2);
    
      if (Platform.OS === 'web') {
          // Web version - use confirm instead of Alert
          const confirmed = window.confirm(`Would you like to rent ${movie.title} for $${rentalPrice}?`);
          if (!confirmed) return;
          try {
              console.log('Starting rental process for:', movie.title);
              rentMovie(movie);
              console.log('Movie rented successfully:', movie.title);
          } catch (error) {
              console.error('Detailed storage error:', error);
              window.alert('Failed to save rental');
          }
      } else {
          // Mobile version - use Alert.alert()
          Alert.alert(
              'Rent Movie',
              `Would you like to rent ${movie.title} for $${rentalPrice}?`,
              [
                  { text: 'Cancel', style: 'cancel' },
                  {
                      text: 'Rent',
                      onPress: async () => {
                          try {
                              console.log('Starting rental process for:', movie.title);
                              rentMovie(movie);
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

  
    return (
      <TouchableOpacity onPress={onPress} style={[styles.card, { width: cardWidth, height: cardHeight }]}>
        {/* Rent Button */}
        <TouchableOpacity 
          style={[styles.rentButton, isDesktop && styles.rentButtonDesktop]} 
          onPress={() => {
            rentMovie1(movie); // Call rentMovie when the button is pressed
            console.log(`Rented movie: ${movie.title}`); // Optional: Log the rented movie title
          }}
        >
          <Text style={[styles.rentText, isDesktop && styles.rentTextDesktop]}>Rent Movie</Text>
        </TouchableOpacity>
  
        {/* Movie Poster */}
        <Image source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }} style={[styles.image, { height: cardHeight }]} />
  
        {/* Title Overlay */}
        <View style={styles.overlay}>
          <Text style={[styles.title, isDesktop && styles.titleDesktop]} numberOfLines={2}>{movie.title}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const styles = StyleSheet.create({
    container: { 
      flex: 1, 
      padding: 10, 
      backgroundColor: '#121212' // Dark theme background
    },
    searchContainer: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      marginBottom: 10 
    },
    input: { 
      flex: 1, 
      borderWidth: 1, 
      padding: 10, 
      marginRight: 10, 
      borderRadius: 8, 
      borderColor: '#555', 
      backgroundColor: '#222', 
      color: '#fff' 
    },
    card: {
      margin: 8,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: '#1c1c1c',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 6,
    },
    image: {
      width: '100%',
      borderRadius: 12,
    },
    overlay: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      padding: 8,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      alignItems: 'center',
    },
    title: { 
      color: '#fff', 
      fontSize: 14, 
      fontWeight: 'bold', 
      textAlign: 'center' 
    },
    modalContainer: {
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContent: {
      backgroundColor: 'white', 
      padding: 20, 
      borderRadius: 10, 
      width: '90%', 
      alignItems: 'center'
    },
    clearButton: {
      padding: 10,
      backgroundColor: '#444',
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 10,
    },
    clearText: {
      color: '#fff',
      fontWeight: 'bold',
    } ,rentButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      backgroundColor: '#ff5733',
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 14,
      zIndex: 10,
      opacity: 0.9,
    },
    rentButtonDesktop: {
      paddingVertical: 10,
      paddingHorizontal: 18,
      borderRadius: 16,
    },
    rentText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 12,
    },
    rentTextDesktop: {
      fontSize: 16,
    },
    titleDesktop: {
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

export default MovieCard;