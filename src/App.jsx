import React, { useEffect, useState } from "react";

const App = () => {
  const [data, setData] = useState({ categories: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [randomTopic, setRandomTopic] = useState(null);
  const [animation, setAnimation] = useState(false);
  const [buttonAnimation, setButtonAnimation] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("./topics.json");
        if (!response.ok) {
          throw new Error("Failed to fetch topics data");
        }
        const jsonData = await response.json();
        setData(jsonData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setRandomTopic(null);
  };

  const generateRandomTopic = () => {
    if (!selectedCategory) return;

    setButtonAnimation(true);
    setTimeout(() => setButtonAnimation(false), 300);

    const category = data.categories.find(
      (cat) => cat.category === selectedCategory
    );
    if (category && category.topics.length > 0) {
      setAnimation(true);
      setTimeout(() => {
        setRandomTopic(
          category.topics[Math.floor(Math.random() * category.topics.length)]
        );
        setAnimation(false);
      }, 500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg transform transition-all animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="w-6 h-6 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-teal-600 font-medium text-lg">
              Loading topics...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-100 to-red-300 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all">
          <p className="text-red-600 font-bold text-lg">
            Error loading topics: {error}
          </p>
          <p className="mt-4 text-gray-600">
            Make sure your topics.json file is in the public folder of your
            React application.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-500 to-blue-600 py-8 flex items-center justify-center font-sans">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden md:max-w-2xl p-8 w-5/6 transform hover:shadow-3xl transition-all duration-300">
        <h1 className="text-3xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-700">
          Chatter Box
        </h1>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-3"
            htmlFor="category"
          >
            Select Category:
          </label>
          <div className="relative">
            <select
              id="category"
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all shadow-sm hover:shadow-md text-gray-700 appearance-none cursor-pointer"
            >
              <option value="">-- Select a Category --</option>
              {data.categories.map((cat) => (
                <option key={cat.category} value={cat.category}>
                  {cat.category}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <button
          onClick={generateRandomTopic}
          disabled={!selectedCategory}
          className={`w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-all duration-300 ${
            !selectedCategory
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer"
          } transform ${buttonAnimation ? "scale-95" : "hover:scale-102"}`}
        >
          Generate Random Topic
        </button>

        {randomTopic && (
          <div
            className={`mt-8 p-6 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-200 shadow-md transform transition-all duration-500 ${
              animation
                ? "opacity-0 translate-y-4"
                : "opacity-100 translate-y-0"
            }`}
          >
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Your Random Topic:
            </h2>
            <p className="text-cyan-800 text-xl font-medium mb-2">
              {randomTopic.topic}
            </p>
            <div className="flex items-center text-sm text-gray-500 mt-4">
              <span className="bg-cyan-100 text-cyan-800 text-xs px-2 py-1 rounded-full mr-2">
                {selectedCategory}
              </span>
              <span className="text-xs">ID: {randomTopic.id}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
