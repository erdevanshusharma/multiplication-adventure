import { useNavigate } from "react-router-dom";

export default function MainPage() {
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">
        A-ddition App
      </h1>
      <p className="text-xl mb-8 text-center text-gray-700">
        Welcome! Choose where you'd like to go:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Settings Button */}
        <button
          onClick={() => navigate("/settings")}
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-6 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 flex flex-col items-center"
        >
          <span className="text-3xl mb-2">⚙️</span>
          <span className="text-lg">Settings</span>
        </button>

        {/* Levels Button */}
        <button
          onClick={() => navigate("/levels")}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-6 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 flex flex-col items-center"
        >
          <span className="text-3xl mb-2">🎯</span>
          <span className="text-lg">Levels</span>
        </button>

        {/* Drawing Page 1 Button */}
        <button
          onClick={() => navigate("/drawing/1")}
          className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-6 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 flex flex-col items-center"
        >
          <span className="text-3xl mb-2">🎨</span>
          <span className="text-lg">Drawing Page 1</span>
        </button>

        {/* Math Questions (Easy Level 1) Button */}
        <button
          onClick={() => navigate("/questions/easy/1")}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-6 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 flex flex-col items-center md:col-span-2 lg:col-span-3"
        >
          <span className="text-3xl mb-2">🧮</span>
          <span className="text-lg">Math Questions (Easy - Level 1)</span>
        </button>
      </div>
    </div>
  );
}
