import { aiSuggestions } from "../../data/dummyData";

function AISuggestions() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h2 className="text-xl font-bold mb-5">
        AI Suggestions
      </h2>

      <div className="space-y-4">
        {aiSuggestions.map((item, index) => (
          <div
            key={index}
            className="bg-blue-50 p-4 rounded-xl"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AISuggestions;