import { useState, useEffect } from "react";
import { FaRobot, FaLightbulb, FaArrowRight, FaSpinner } from "react-icons/fa";
import { api } from "../../services/api";

function AISuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const data = await api.get("/analytics/suggestions");
        if (data.success) {
          setSuggestions(data.suggestions);
        }
      } catch (err) {
        console.error("Failed to load AI suggestions:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSuggestions();
  }, []);

  const getIcon = (index) => {
    if (index === 0) return <FaLightbulb className="text-yellow-500" />;
    return <FaRobot className="text-blue-500" />;
  };

  const getGradient = (index) => {
    if (index % 3 === 0) return "from-yellow-50 to-yellow-100/50 border-yellow-200";
    if (index % 3 === 1) return "from-blue-50 to-indigo-50 border-blue-200";
    return "from-purple-50 to-pink-50 border-purple-200";
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-1">
          <FaRobot className="text-blue-600 text-xl" />
          <h2 className="text-xl font-bold text-gray-800">AI Insights</h2>
        </div>
        <p className="text-sm text-gray-500">Smart recommendations for your store</p>
      </div>

      <div className="p-6 space-y-4 flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
            <FaSpinner className="animate-spin text-2xl text-blue-600" />
            <p className="text-xs">Generating suggestions...</p>
          </div>
        ) : suggestions.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            No suggestions available yet.
          </div>
        ) : (
          suggestions.map((item, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border bg-gradient-to-r ${getGradient(index)} transition-all hover:shadow-md cursor-pointer group`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {getIcon(index)}
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 text-sm leading-relaxed font-medium">
                    {item}
                  </p>
                  <button className="mt-2 text-xs font-semibold text-blue-600 group-hover:text-blue-700 flex items-center gap-1">
                    Apply suggestion <FaArrowRight className="text-xs" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AISuggestions;