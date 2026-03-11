import { useState, useEffect } from 'react';
import { Search, Book, Languages, Send, ShieldCheck } from 'lucide-react';
import { getWords } from './api';

interface Word {
  id: number;
  term_shikomori: string;
  pos: string;
  translations: { meaning_fr: string; dialect: string }[];
  examples: { sentence_shikomori: string; sentence_fr: string }[];
}

function App() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Word[]>([]);
  const [loading, setLoading] = useState(false);

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
