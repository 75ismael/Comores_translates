import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { Search, Book, Languages, ChevronRight } from 'lucide-react-native';
import axios from 'axios';

// IMPORTANT: Replace with your machine's local IP address to test on a real device
const API_URL = 'http://127.0.0.1:8000/api/';

interface Word {
  id: number;
  term_shikomori: string;
  pos: string;
  translations: { meaning_fr: string; dialect: string }[];
}

export default function App() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Word[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (text: string) => {
    setSearch(text);
    if (text.length > 1) {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}words/?search=${text}`);
        const data = response.data.results !== undefined ? response.data.results : response.data;
        setResults(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      setResults([]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Languages color="#0284c7" size={28} />
          <Text style={styles.logoText}>Shikomori</Text>
        </View>
      </View>

      {/* Search Section */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search color="#94a3b8" size={20} style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Rechercher un mot..."
            value={search}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      {/* Results List */}
      {loading ? (
        <ActivityIndicator size="large" color="#0284c7" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.termText}>{item.term_shikomori}</Text>
                  <Text style={styles.posText}>{item.pos.toUpperCase()}</Text>
                </View>
                <ChevronRight color="#e2e8f0" size={20} />
              </View>
              <View style={styles.translationContainer}>
                {item.translations.map((t, i) => (
                  <Text key={i} style={styles.translationText}>
                    • {t.meaning_fr} <Text style={styles.dialectText}>({t.dialect})</Text>
                  </Text>
                ))}
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            search.length > 1 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Aucun résultat pour "{search}"</Text>
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Book color="#cbd5e1" size={60} />
                <Text style={styles.emptyText}>Commencez à taper pour rechercher</Text>
              </View>
            )
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0c4a6e',
  },
  searchContainer: {
    padding: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderBottomWidth: 3,
    borderColor: '#f1f5f9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  termText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0284c7',
  },
  posText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94a3b8',
    marginTop: 2,
  },
  translationContainer: {
    gap: 6,
  },
  translationText: {
    fontSize: 16,
    color: '#334155',
  },
  dialectText: {
    fontSize: 12,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    gap: 15,
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 16,
    textAlign: 'center',
  },
});
