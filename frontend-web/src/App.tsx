import { useState, useEffect } from 'react';
import { Search, Book, Languages, Send, ShieldCheck, Newspaper, GraduationCap } from 'lucide-react';
import { getWords, getArticles, getQuizzes } from './api';

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
  const [articles, setArticles] = useState<Article[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchArticles();
    fetchQuizzes();
  }, []);

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
        handleSearch();
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await getWords(search);
      // Handle both paginated (with .results) and non-paginated (raw list) responses
      const data = response.data.results !== undefined ? response.data.results : response.data;
      setResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Search error", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-shikomori-600 p-2 rounded-lg">
            <Languages className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-shikomori-700 to-shikomori-900">
            Shikomori Platform
          </span>
        </div>
        <div className="flex gap-6 text-sm font-medium text-slate-600">
          <a href="#" className="hover:text-shikomori-600 transition-colors">Dictionnaire</a>
          <a href="#" className="hover:text-shikomori-600 transition-colors">Apprendre</a>
          <a href="http://127.0.0.1:8000/admin/" target="_blank" className="flex items-center gap-1 hover:text-shikomori-600 transition-colors">
            <ShieldCheck size={16} /> Admin
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
        <div className="relative mb-12">
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

        {/* Results */}
        <section className="space-y-6">
          {loading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-shikomori-600"></div>
            </div>
          )}

          {!loading && results && results.length > 0 && results.map((word) => (
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

              {word.examples.length > 0 && (
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
        <section className="mt-24">
          <div className="flex items-center gap-2 mb-8">
            <Newspaper className="text-shikomori-600" />
            <h2 className="text-2xl font-bold text-slate-900 font-serif">Dernières Actualités</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((article) => (
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
        <section className="mt-24 mb-16">
          <div className="flex items-center gap-2 mb-8">
            <GraduationCap className="text-emerald-600" />
            <h2 className="text-2xl font-bold text-slate-900 font-serif">Apprendre le Shikomori</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-emerald-200 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">
                    {quiz.difficulty}
                  </span>
                  <span className="text-emerald-600 text-xs font-medium">{quiz.questions.length} Questions</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{quiz.title}</h3>
                <p className="text-slate-600 text-sm mb-6">{quiz.description}</p>
                <button className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors">
                  Commencer le Quiz
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

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
