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
  SafeAreaView,
  ScrollView,
  Modal,
  Dimensions
} from 'react-native';
import { Search, Book, Languages, ChevronRight, Newspaper, GraduationCap, X, CheckCircleChars, AlertCircle } from 'lucide-react-native';
import axios from 'axios';

const { width } = Dimensions.get('window');

// IMPORTANT: Replace with your machine's local IP address to test on a real device
const API_URL = 'http://192.168.1.8:8000/api/';

interface Word {
  id: number;
  term_shikomori: string;
  pos: string;
  translations: { meaning_fr: string; dialect: string }[];
}

interface Article {
  id: number;
  title: string;
  content: string;
  pub_date: string;
  author: string;
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  questions: {
    id: number;
    text: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    correct_option: number;
  }[];
}

export default function App() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Word[]>([]);
  const [featuredWords, setFeaturedWords] = useState<Word[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(false);

  // Quiz State
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    fetchArticles();
    fetchQuizzes();
    fetchFeaturedWords();
  }, []);

  const fetchFeaturedWords = async () => {
    try {
      const response = await axios.get(`${API_URL}linguistics/words/featured/`);
      setFeaturedWords(response.data);
    } catch (error) {
      console.error("Fetch featured words error", error);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get(`${API_URL}learning/quizzes/`);
      const data = response.data.results !== undefined ? response.data.results : response.data;
      setQuizzes(data);
    } catch (error) {
      console.error("Fetch quizzes error", error);
    }
  };

  const fetchArticles = async () => {
    try {
      const response = await axios.get(`${API_URL}news/articles/`);
      const data = response.data.results !== undefined ? response.data.results : response.data;
      setArticles(data);
    } catch (error) {
      console.error("Fetch articles error", error);
    }
  };

  const handleSearch = async (text: string) => {
    setSearch(text);
    if (text.length > 1) {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}linguistics/words/?search=${text}`);
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

  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResults(false);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  const handleAnswer = (optionIndex: number) => {
    if (isAnswered) return;
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    if (optionIndex === activeQuiz?.questions[currentQuestionIndex].correct_option) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (activeQuiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Languages color="#0284c7" size={28} />
          <View>
            <Text style={styles.logoText}>Shikomori</Text>
            <Text style={styles.logoSubText}>Linguistique</Text>
          </View>
        </View>
      </View>

      {/* Results List or Dashboard */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
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

            {loading && <ActivityIndicator size="large" color="#0284c7" style={{ marginVertical: 20 }} />}

            {/* Featured Section */}
            {!search && featuredWords.length > 0 && (
              <View style={styles.featuredSection}>
                <Text style={styles.sectionTitleCap}>À découvrir</Text>
                <View style={styles.chipContainer}>
                  {featuredWords.map((word) => (
                    <TouchableOpacity
                      key={word.id}
                      style={styles.chip}
                      onPress={() => handleSearch(word.term_shikomori)}
                    >
                      <Text style={styles.chipText}>{word.term_shikomori}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Empty Dashboard Content */}
            {!search && !loading && (
              <>
                {/* News Section */}
                {articles.length > 0 && (
                  <View style={styles.newsSection}>
                    <View style={styles.newsHeader}>
                      <Newspaper color="#0284c7" size={20} />
                      <Text style={styles.newsTitle}>Dernières Actualités</Text>
                    </View>
                    {articles.map((article) => (
                      <View key={article.id} style={styles.newsCard}>
                        <Text style={styles.newsDate}>{new Date(article.pub_date).toLocaleDateString()}</Text>
                        <Text style={styles.newsCardTitle}>{article.title}</Text>
                        <Text style={styles.newsContent} numberOfLines={2}>{article.content}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Quiz Section */}
                {quizzes.length > 0 && (
                  <View style={styles.quizSection}>
                    <View style={styles.newsHeader}>
                      <GraduationCap color="#059669" size={20} />
                      <Text style={[styles.newsTitle, { color: '#064e3b' }]}>Apprendre</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quizScroll}>
                      {quizzes.map((quiz) => (
                        <View key={quiz.id} style={styles.quizCard}>
                          <View style={styles.quizBadge}>
                            <Text style={styles.quizBadgeText}>{quiz.difficulty}</Text>
                          </View>
                          <Text style={styles.quizCardTitle}>{quiz.title}</Text>
                          <Text style={styles.quizDescription} numberOfLines={2}>{quiz.description}</Text>
                          <TouchableOpacity
                            style={styles.quizButton}
                            onPress={() => handleStartQuiz(quiz)}
                          >
                            <Text style={styles.quizButtonText}>Démarrer</Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </>
            )}
          </>
        }
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
          search.length > 1 && !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Aucun résultat pour "{search}"</Text>
            </View>
          ) : null
        }
      />

      {/* Interactive Quiz Modal */}
      <Modal
        visible={activeQuiz !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setActiveQuiz(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setActiveQuiz(null)}
            >
              <X size={24} color="#64748b" />
            </TouchableOpacity>

            {!showResults && activeQuiz ? (
              <ScrollView contentContainerStyle={styles.quizModalBody}>
                <View style={styles.quizProgressHeader}>
                  <Text style={styles.quizProgressText}>Question {currentQuestionIndex + 1} / {activeQuiz.questions.length}</Text>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100}%` }
                      ]}
                    />
                  </View>
                </View>

                <Text style={styles.questionText}>{activeQuiz.questions[currentQuestionIndex].text}</Text>

                <View style={styles.optionsContainer}>
                  {[1, 2, 3, 4].map((i) => {
                    const optionKey = `option${i}` as keyof typeof activeQuiz.questions[0];
                    const optionText = activeQuiz.questions[currentQuestionIndex][optionKey] as string;
                    const isCorrect = i === activeQuiz.questions[currentQuestionIndex].correct_option;
                    const isSelected = selectedOption === i;

                    let optionStyle = [styles.optionButton];
                    let textStyle = [styles.optionText];

                    if (isAnswered) {
                      if (isCorrect) {
                        optionStyle.push(styles.optionCorrect);
                        textStyle.push(styles.optionTextCorrect);
                      } else if (isSelected) {
                        optionStyle.push(styles.optionIncorrect);
                        textStyle.push(styles.optionTextIncorrect);
                      } else {
                        optionStyle.push(styles.optionDisabled);
                        textStyle.push(styles.optionTextDisabled);
                      }
                    }

                    return (
                      <TouchableOpacity
                        key={i}
                        style={optionStyle}
                        onPress={() => handleAnswer(i)}
                        disabled={isAnswered}
                      >
                        <Text style={textStyle}>{optionText}</Text>
                        {isAnswered && isCorrect && <CheckCircleChars size={20} color="#059669" />}
                        {isAnswered && isSelected && !isCorrect && <AlertCircle size={20} color="#e11d48" />}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {isAnswered && (
                  <TouchableOpacity
                    style={styles.nextButton}
                    onPress={handleNextQuestion}
                  >
                    <Text style={styles.nextButtonText}>
                      {currentQuestionIndex < activeQuiz.questions.length - 1 ? 'Suivant' : 'Terminer'}
                    </Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            ) : activeQuiz ? (
              <View style={styles.resultsContainer}>
                <View style={styles.resultIconBackground}>
                  <GraduationCap size={60} color="#059669" />
                </View>
                <Text style={styles.resultTitle}>Quiz terminé !</Text>
                <Text style={styles.resultScoreText}>Ton score :</Text>
                <Text style={styles.resultScoreValue}>
                  {score}<Text style={styles.resultScoreTotal}>/{activeQuiz.questions.length}</Text>
                </Text>
                <TouchableOpacity
                  style={styles.finishButton}
                  onPress={() => setActiveQuiz(null)}
                >
                  <Text style={styles.finishButtonText}>Retour au menu</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </View>
      </Modal>
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
    gap: 10,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0c4a6e',
    textTransform: 'uppercase',
    letterSpacing: -0.5,
  },
  logoSubText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0284c7',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: -4,
  },
  searchContainer: {
    paddingVertical: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 15,
    height: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  featuredSection: {
    marginBottom: 20,
  },
  sectionTitleCap: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  chipText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  termText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0c4a6e',
  },
  posText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0284c7',
    marginTop: 2,
    backgroundColor: '#f0f9ff',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  newsSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  newsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  newsTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0c4a6e',
  },
  newsCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  newsDate: {
    fontSize: 10,
    color: '#0284c7',
    fontWeight: '700',
    marginBottom: 4,
  },
  newsCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 5,
  },
  newsContent: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  quizSection: {
    marginTop: 30,
    marginBottom: 20,
  },
  quizScroll: {
    paddingBottom: 10,
  },
  quizCard: {
    backgroundColor: '#ecfdf5',
    padding: 20,
    borderRadius: 24,
    width: 280,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#d1fae5',
  },
  quizBadge: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  quizBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#065f46',
    textTransform: 'uppercase',
  },
  quizCardTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#064e3b',
    marginBottom: 6,
  },
  quizDescription: {
    fontSize: 14,
    color: '#065f46',
    opacity: 0.7,
    marginBottom: 20,
    lineHeight: 20,
  },
  quizButton: {
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  quizButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    height: '90%',
    paddingTop: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginRight: 20,
    padding: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
  },
  quizModalBody: {
    padding: 24,
  },
  quizProgressHeader: {
    marginBottom: 30,
  },
  quizProgressText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#059669',
  },
  questionText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1e293b',
    marginBottom: 30,
    lineHeight: 34,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#f1f5f9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#475569',
  },
  optionCorrect: {
    borderColor: '#059669',
    backgroundColor: '#ecfdf5',
  },
  optionTextCorrect: {
    color: '#065f46',
  },
  optionIncorrect: {
    borderColor: '#e11d48',
    backgroundColor: '#fff1f2',
  },
  optionTextIncorrect: {
    color: '#9f1239',
  },
  optionDisabled: {
    opacity: 0.5,
  },
  optionTextDisabled: {
    color: '#94a3b8',
  },
  nextButton: {
    backgroundColor: '#1e293b',
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  resultsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  resultIconBackground: {
    width: 120,
    height: 120,
    backgroundColor: '#ecfdf5',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1e293b',
    marginBottom: 10,
  },
  resultScoreText: {
    fontSize: 18,
    color: '#64748b',
    marginBottom: 10,
  },
  resultScoreValue: {
    fontSize: 72,
    fontWeight: '900',
    color: '#059669',
    marginBottom: 40,
  },
  resultScoreTotal: {
    fontSize: 24,
    color: '#cbd5e1',
  },
  finishButton: {
    backgroundColor: '#0284c7',
    width: '100%',
    paddingVertical: 18,
    borderWidth: 0,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  finishButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 16,
    textAlign: 'center',
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
});
