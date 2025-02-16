import React from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, useWindowDimensions, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";

interface HeaderProps {
  query: string;
  setQuery: (text: string) => void;
  searchMovies: () => void;
  clearSearch: () => void;
  loading: boolean;
}

export default function Header({ query, setQuery, searchMovies, clearSearch, loading }: HeaderProps) {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();

  return (
    <View style={[styles.container]}>
      {/* Search Input, Buttons, and Rented Movies Button (single row on web) */}
      <View style={[styles.searchContainer, Platform.OS === "web" && styles.webSearchContainer]}>
        <TextInput
          style={styles.input}
          placeholder="Search movies..."
          placeholderTextColor="#bbb"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={searchMovies}
        />

        {/* Clear Button (only appears when query is entered) */}
        {query.length > 1 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Text style={styles.clearText}>X</Text>
          </TouchableOpacity>
        )}

        {/* Search Button */}
        <TouchableOpacity 
          style={[styles.searchButton, loading && styles.disabledButton]} 
          onPress={searchMovies} 
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? "Loading..." : "Search"}</Text>
        </TouchableOpacity>

        {/* Rented Movies Button (only in row for web view) */}
        {Platform.OS === "web" && (
          <TouchableOpacity 
            style={styles.rentedMoviesButton} 
            onPress={() => navigation.navigate("rented")}
          >
            <Text style={styles.rentedMoviesText}>Rented Movies</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Rented Movies Button (only below search area on mobile) */}
      {Platform.OS !== "web" && (
        <TouchableOpacity 
          style={styles.rentedMoviesButton} 
          onPress={() => navigation.navigate("rented")}
        >
          <Text style={styles.rentedMoviesText}>Rented Movies</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'ios' || Platform.OS === 'android' ? 50 : 0, 
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10, 
  },
  webSearchContainer: { // Additional styling for web to keep everything in a row
    flexWrap: "nowrap",
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#222",
    color: "#fff",
  },
  clearButton: {
    padding: 10,
    backgroundColor: "#444",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 40,
  },
  clearText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  searchButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  disabledButton: {
    backgroundColor: "#999",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  rentedMoviesButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  rentedMoviesText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

