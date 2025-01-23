import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Searchbar, Chip, Surface } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export const FilterHeader = ({ searchQuery, onSearchChange, filters, onFilterChange, placeholder }) => {
  return (
    <View style={styles.container}>
      <Searchbar
        placeholder={placeholder}
        onChangeText={onSearchChange}
        value={searchQuery}
        style={styles.searchBar}
      />
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContainer}
      >
        {filters.map((filter) => (
          <Chip
            key={filter.key} // Use the unique key here
            selected={filter.selected}
            onPress={() => onFilterChange(filter.value)}
            style={styles.filterChip}
          >
            {filter.label}
          </Chip>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  compactContainer: {
    padding: 4,
  },
  searchBar: {
    marginBottom: 8,
  },
  compactSearchBar: {
    height: 40,
    marginBottom: 4,
  },
  compactInput: {
    fontSize: 14,
  },
  filterScroll: {
    flexGrow: 0,
  },
  filterContainer: {
    gap: 8,
    paddingHorizontal: 4,
  },
  filterChip: {
    marginRight: 4,
  },
  compactChip: {
    height: 28,
  },
  compactChipText: {
    fontSize: 12,
  },
});