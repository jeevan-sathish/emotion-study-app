import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const emotions = [
  { label: "😕 Confused", value: "confused" },
  { label: "😡 Angry", value: "angry" },
  { label: "😭 Sad", value: "sad" },
  { label: "😩 Stressed", value: "stressed" },
  { label: "😴 Bored", value: "bored" },
  { label: "🤯 Overwhelmed", value: "overwhelmed" },
  { label: "😓 Frustrated", value: "frustrated" },
  { label: "🙂 Neutral", value: "neutral" },
];

const Api = () => {
  const [studyText, setStudyText] = useState("");
  const [selectedFeeling, setSelectedFeeling] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const formatResponse = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/^- (.*?)/gm, "<li>$1</li>")
      .replace(/\n/g, "<br/>");
  };

  const generateContent = async () => {
    if (!studyText || !selectedFeeling) {
      alert("Please enter study content and select a feeling!");
      return;
    }

    setLoading(true);
    setResponse("");

    const genAI = new GoogleGenerativeAI("AIzaSyCCVO_bBjqp7JGcEwAxfLwUJG7X166Q7GA");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
You are an emotional learning assistant.
User feeling: ${selectedFeeling}
Study content: ${studyText}

Format neatly:
- Add headings
- Add bullet points
- Bold keywords
- Make it easy to read
- Provide a simplified explanation
`;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    setResponse(formatResponse(rawText));
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-600 to-purple-600 p-6">
      <div className="w-full max-w-3xl bg-white/30 backdrop-blur-xl shadow-xl rounded-2xl p-8 border border-white/20">

        <h1 className="text-4xl font-extrabold text-white text-center mb-6 drop-shadow-lg">
          Emotion-Based Study Helper 🎓✨
        </h1>

        {/* Text Input */}
        <textarea
          className="w-full h-36 p-4 rounded-xl bg-white/90 border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none mb-6"
          placeholder="Paste the content you want to study..."
          onChange={(e) => setStudyText(e.target.value)}
        ></textarea>

        {/* Emotion Buttons */}
        <h2 className="text-white text-lg font-semibold mb-3">
          Select how you're feeling:
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {emotions.map((item) => (
            <button
              key={item.value}
              onClick={() => setSelectedFeeling(item.value)}
              className={`py-2 px-3 rounded-xl font-semibold shadow-lg transition transform hover:scale-105 ${
                selectedFeeling === item.value
                  ? "bg-purple-700 text-white"
                  : "bg-white/80 text-gray-800 hover:bg-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Submit Button */}
        <button
          onClick={generateContent}
          className="w-full py-3 text-white font-bold rounded-xl bg-indigo-700 hover:bg-indigo-800 shadow-lg transition transform hover:scale-105"
        >
          Generate Simplified Explanation
        </button>

        {/* Loading */}
        {loading && (
          <p className="text-center text-white mt-4 animate-pulse text-lg">
            ⏳ Please wait, simplifying content...
          </p>
        )}

        {/* Response Box */}
        {response && (
          <div className="mt-6 p-6 bg-white shadow-xl rounded-xl border border-gray-200">
            <h2 className="text-2xl font-bold text-purple-700 mb-3">
              📘 Your Easy Explanation
            </h2>

            <div
              className="prose prose-lg leading-relaxed text-gray-800"
              dangerouslySetInnerHTML={{ __html: response }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Api;
