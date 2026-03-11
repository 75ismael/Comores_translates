import { useState, useEffect } from 'react';
import { Search, Book, Languages, Send, ShieldCheck, Newspaper, GraduationCap, X, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';
import { getWords, getArticles, getQuizzes, getFeaturedWords } from './api';

interface Word {
  id: number;
  term_shikomori: string;
  pos: string;
  translations: { meaning_fr: string; dialect: string }[];
  examples: { sentence_shikomori: string; sentence_fr: string }[];
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

function App() {
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
      const response = await getFeaturedWords();
      setFeaturedWords(response.data);
    } catch (error) {
      console.error("Fetch featured words error", error);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const response = await getQuizzes();
      const data = response.data.results !== undefined ? response.data.results : response.data;
      setQuizzes(data);
    } catch (error) {
      console.error("Fetch quizzes error", error);
    }
  };

  const fetchArticles = async () => {
    try {
      const response = await getArticles();
      const data = response.data.results !== undefined ? response.data.results : response.data;
      setArticles(data);
    } catch (error) {
      console.error("Fetch articles error", error);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        handleSearchInternal(search);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleSearchInternal = async (searchTerm: string) => {
    setLoading(true);
    try {
      const response = await getWords(searchTerm);
      const data = response.data.results !== undefined ? response.data.results : response.data;
      setResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Search error", error);
      setResults([]);
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navbar */}
      <nav className="glass border-b border-slate-200/50 px-8 py-4 flex items-center justify-between sticky top-0 z-50 animate-slide-down">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.location.reload()}>
          <div className="bg-gradient-to-tr from-shikomori-600 to-shikomori-400 p-2.5 rounded-xl shadow-lg shadow-shikomori-600/20 group-hover:scale-110 transition-transform duration-300">
            <Languages className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-shikomori-900 via-shikomori-700 to-shikomori-800 uppercase">
              Shikomori
            </span>
            <span className="text-[10px] font-bold text-shikomori-600 tracking-[0.2em] uppercase -mt-1 opacity-70">Linguistics</span>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {['Dictionnaire', 'Apprendre', 'Actualités'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-bold text-slate-500 hover:text-shikomori-600 transition-all relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-shikomori-600 transition-all group-hover:w-full"></span>
            </a>
          ))}
          <a
            href="http://127.0.0.1:8000/admin/"
            target="_blank"
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5 transition-all shadow-lg shadow-slate-900/10"
          >
            <ShieldCheck size={18} />
            <span>Admin Portal</span>
          </a>
        </div>
      </nav>

      {/* Hero / Search Section */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Préservez et apprenez la langue <span className="text-shikomori-600">Shikomori</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Accédez à un dictionnaire complet, apprenez avec des exercices intelligents et contribuez à la base de données linguistique nationale des Comores.
          </p>
        </header>

        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-slate-400 h-5 w-5" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-5 bg-white border border-slate-200 rounded-2xl shadow-xl focus:ring-2 focus:ring-shikomori-600 focus:border-shikomori-600 transition-all text-lg outline-none"
            placeholder="Rechercher un mot en Shikomori ou en Français..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Featured Words Area */}
        {!search && featuredWords.length > 0 && (
          <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">À découvrir en ce moment</h2>
            <div className="flex flex-wrap gap-3">
              {featuredWords.map((word: Word) => (
                <button
                  key={word.id}
                  onClick={() => { setSearch(word.term_shikomori); }}
                  className="bg-white px-4 py-2 rounded-full border border-slate-200 text-slate-700 font-medium hover:border-shikomori-400 hover:text-shikomori-600 transition-all hover:shadow-md"
                >
                  {word.term_shikomori}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        <section id="dictionnaire" className="space-y-6 scroll-mt-24">
          {loading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-shikomori-600"></div>
            </div>
          )}

          {!loading && results && results.length > 0 && results.map((word: Word) => (
            <div key={word.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-shikomori-900">{word.term_shikomori}</h3>
                  <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded uppercase mt-1">
                    {word.pos}
                  </span>
                </div>
                <Book className="text-slate-300" />
              </div>

              <div className="space-y-3">
                {word.translations.map((t, i) => (
                  <div key={i} className="flex items-baseline gap-2">
                    <span className="text-lg font-medium text-slate-800">{t.meaning_fr}</span>
                    <span className="text-xs text-slate-400 italic">({t.dialect})</span>
                  </div>
                ))}
              </div>

              {word.examples && word.examples.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-50">
                  <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Exemples</h4>
                  {word.examples.map((ex, i) => (
                    <div key={i} className="bg-slate-50 p-3 rounded-lg border-l-4 border-shikomori-600 mb-2">
                      <p className="text-slate-800 font-medium italic">"{ex.sentence_shikomori}"</p>
                      <p className="text-slate-500 text-sm mt-1">{ex.sentence_fr}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {!loading && search && results.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-500 mb-4">Aucun résultat trouvé pour "{search}"</p>
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-shikomori-600 text-white font-semibold rounded-xl hover:bg-shikomori-700 transition-colors shadow-lg shadow-shikomori-600/20">
                <Send size={18} /> Proposer ce mot
              </button>
            </div>
          )}
        </section>

        {/* News Section */}
        <section id="actualités" className="mt-24 scroll-mt-24">
          <div className="flex items-center gap-2 mb-8">
            <Newspaper className="text-shikomori-600" />
            <h2 className="text-2xl font-bold text-slate-900 font-serif">Dernières Actualités</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((article: Article) => (
              <div key={article.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <span className="text-xs font-semibold text-shikomori-600 uppercase tracking-wider">
                  {new Date(article.pub_date).toLocaleDateString()}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2 mb-3">{article.title}</h3>
                <p className="text-slate-600 line-clamp-3 mb-4">{article.content}</p>
                <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                  <span className="text-sm text-slate-400">Par {article.author}</span>
                  <button className="text-shikomori-600 font-semibold text-sm hover:underline">Lire la suite</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Learning/Quiz Section */}
        <section id="apprendre" className="mt-24 mb-16 scroll-mt-24">
          <div className="flex items-center gap-2 mb-8">
            <GraduationCap className="text-emerald-600" />
            <h2 className="text-2xl font-bold text-slate-900 font-serif">Apprendre le Shikomori</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quizzes.map((quiz: Quiz) => (
              <div key={quiz.id} className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-emerald-200 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">
                    {quiz.difficulty}
                  </span>
                  <span className="text-emerald-600 text-xs font-medium">{quiz.questions.length} Questions</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{quiz.title}</h3>
                <p className="text-slate-600 text-sm mb-6">{quiz.description}</p>
                <button
                  onClick={() => handleStartQuiz(quiz)}
                  className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors"
                >
                  Commencer le Quiz
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Quiz Modal */}
      {activeQuiz && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setActiveQuiz(null)}
              className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={24} className="text-slate-400" />
            </button>

            {!showResults ? (
              <div className="p-8">
                <div className="mb-6">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Question {currentQuestionIndex + 1} sur {activeQuiz.questions.length}</span>
                  <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-500"
                      style={{ width: `${((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-8">{activeQuiz.questions[currentQuestionIndex].text}</h3>

                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => {
                    const optionKey = `option${i}` as keyof typeof activeQuiz.questions[0];
                    const optionText = activeQuiz.questions[currentQuestionIndex][optionKey] as string;
                    const isCorrect = i === activeQuiz.questions[currentQuestionIndex].correct_option;
                    const isSelected = selectedOption === i;

                    let buttonClass = "w-full p-4 rounded-2xl border-2 text-left font-semibold transition-all flex items-center justify-between ";
                    if (!isAnswered) {
                      buttonClass += "border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 text-slate-700";
                    } else if (isCorrect) {
                      buttonClass += "border-emerald-500 bg-emerald-50 text-emerald-700";
                    } else if (isSelected && !isCorrect) {
                      buttonClass += "border-rose-500 bg-rose-50 text-rose-700";
                    } else {
                      buttonClass += "border-slate-50 opacity-50 text-slate-400";
                    }

                    return (
                      <button
                        key={i}
                        disabled={isAnswered}
                        onClick={() => handleAnswer(i)}
                        className={buttonClass}
                      >
                        {optionText}
                        {isAnswered && isCorrect && <CheckCircle2 size={20} className="text-emerald-500" />}
                        {isAnswered && isSelected && !isCorrect && <AlertCircle size={20} className="text-rose-500" />}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8">
                  {isAnswered && (
                    <button
                      onClick={handleNextQuestion}
                      className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all-animate-in slide-in-from-bottom-2"
                    >
                      {currentQuestionIndex < activeQuiz.questions.length - 1 ? 'Question suivante' : 'Voir les résultats'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <GraduationCap size={48} className="text-emerald-600" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-2">Quiz terminé !</h3>
                <p className="text-slate-600 mb-8">Bravo pour tes efforts. Voici ton score :</p>
                <div className="text-6xl font-black text-emerald-600 mb-8">
                  {score}<span className="text-2xl text-slate-300">/{activeQuiz.questions.length}</span>
                </div>
                <button
                  onClick={() => setActiveQuiz(null)}
                  className="w-full bg-shikomori-600 text-white py-4 rounded-2xl font-bold hover:bg-shikomori-700 transition-all shadow-xl shadow-shikomori-600/20"
                >
                  Retour au tableau de bord
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-24 border-t border-slate-200 py-12 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-slate-400 text-sm">
            © 2026 Shikomori Linguistic Platform. Développé pour la préservation du patrimoine comorien.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
