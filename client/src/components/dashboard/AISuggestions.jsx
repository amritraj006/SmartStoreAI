import { useState, useEffect } from "react";
import {
  FaRobot,
  FaLightbulb,
  FaArrowRight,
  FaSpinner,
  FaSync,
  FaExclamationTriangle,
  FaChartLine,
  FaBullhorn,
} from "react-icons/fa";
import { api } from "../../services/api";

// Toast context-free mini toast
let toastFn = null;
export function setToastFn(fn) { toastFn = fn; }

const SUGGESTION_ICONS = [
  <FaLightbulb className="text-amber-400" />,
  <FaChartLine className="text-indigo-400" />,
  <FaBullhorn className="text-violet-400" />,
  <FaExclamationTriangle className="text-rose-400" />,
];

const CARD_STYLES = [
  "from-amber-950/25 to-yellow-950/15 border-amber-900/40 text-amber-250",
  "from-indigo-950/25 to-blue-950/15 border-indigo-900/40 text-indigo-250",
  "from-violet-950/25 to-purple-950/15 border-violet-900/40 text-violet-250",
  "from-rose-950/25 to-red-950/15 border-rose-900/40 text-rose-250",
];

function AISuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [appliedIdx, setAppliedIdx] = useState(new Set());
  const [error, setError] = useState("");

  const fetchSuggestions = async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError("");
    try {
      const data = await api.get("/analytics/suggestions");
      if (data.success) {
        setSuggestions(data.suggestions);
        if (isRefresh) setAppliedIdx(new Set());
      }
    } catch (err) {
      setError("Failed to load AI insights.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => { fetchSuggestions(); }, []);

  const handleApply = (idx) => {
    setAppliedIdx((prev) => new Set([...prev, idx]));
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800/80 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow shadow-indigo-500/20">
            <FaRobot className="text-white text-sm" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">AI Insights</h2>
            <p className="text-xs text-slate-400">Smart store recommendations</p>
          </div>
        </div>
        <button
          onClick={() => fetchSuggestions(true)}
          disabled={isRefreshing}
          title="Refresh AI suggestions"
          className="p-2 rounded-xl hover:bg-slate-850 text-slate-400 hover:text-indigo-400 transition-all disabled:opacity-40"
        >
          <FaSync className={`text-sm ${isRefreshing ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3 flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-3">
            <div className="relative">
              <FaRobot className="text-4xl text-indigo-200" />
              <FaSpinner className="animate-spin text-indigo-500 text-lg absolute -bottom-1 -right-1" />
            </div>
            <p className="text-xs font-medium">Analyzing your store data...</p>
          </div>
        ) : error ? (
          <div className="p-4 text-center text-sm text-red-500">{error}</div>
        ) : suggestions.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            <FaRobot className="text-3xl mx-auto mb-2 text-slate-200" />
            No suggestions yet. Add products to get started.
          </div>
        ) : (
          <div className="stagger space-y-3">
            {suggestions.map((item, index) => {
              const applied = appliedIdx.has(index);
              return (
                <div
                  key={index}
                  className={`p-4 rounded-xl border bg-gradient-to-r ${CARD_STYLES[index % CARD_STYLES.length]} transition-all hover:shadow-sm animate-fade-in-up`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-base">{SUGGESTION_ICONS[index % SUGGESTION_ICONS.length]}</div>
                    <div className="flex-1">
                      <p className="text-slate-300 text-xs leading-relaxed">{item}</p>
                      <button
                        onClick={() => handleApply(index)}
                        disabled={applied}
                        className={`mt-2.5 text-xs font-bold flex items-center gap-1 transition-all ${
                          applied
                            ? "text-emerald-400 cursor-default"
                            : "text-indigo-400 hover:text-indigo-300"
                        }`}
                      >
                        {applied ? (
                          <><span>✓</span> Applied!</>
                        ) : (
                          <>Apply insight <FaArrowRight className="text-[10px]" /></>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between">
        <p className="text-xs text-slate-500">{suggestions.length} insight{suggestions.length !== 1 ? "s" : ""} available</p>
        <span className="text-xs font-semibold text-indigo-500 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Live data
        </span>
      </div>
    </div>
  );
}

export default AISuggestions;