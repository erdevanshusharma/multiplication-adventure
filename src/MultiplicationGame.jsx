import React, { useState, useEffect, useRef } from "react";

const MultiplicationGame = () => {
  // Load saved settings from localStorage or use defaults
  const getSavedSettings = (key, defaultValue) => {
    try {
      const saved = localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  };

  // Game setup states
  const [gameState, setGameState] = useState("setup"); // setup, playing, finished
  const [multiplicandRange, setMultiplicandRange] = useState(
    getSavedSettings("multiplicandRange", { min: 1, max: 10 })
  );
  const [multiplierRange, setMultiplierRange] = useState(
    getSavedSettings("multiplierRange", { min: 1, max: 10 })
  );
  const [scoreLimit, setScoreLimit] = useState(
    getSavedSettings("scoreLimit", 100)
  );
  const [useTimer, setUseTimer] = useState(getSavedSettings("useTimer", false));
  const [timerDuration, setTimerDuration] = useState(
    getSavedSettings("timerDuration", 10)
  );
  const [allowDuplicates, setAllowDuplicates] = useState(
    getSavedSettings("allowDuplicates", true)
  );
  const [correctAnswerScore, setCorrectAnswerScore] = useState(
    getSavedSettings("correctAnswerScore", 10)
  );
  const [incorrectAnswerScore, setIncorrectAnswerScore] = useState(
    getSavedSettings("incorrectAnswerScore", 1)
  );

  // Game play states
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [gameHistory, setGameHistory] = useState(
    getSavedSettings("gameHistory", [])
  );
  const [gameStartTime, setGameStartTime] = useState(null);
  const [totalTimeTaken, setTotalTimeTaken] = useState(0);
  const [previousQuestions, setPreviousQuestions] = useState([]);

  // Audio refs
  const correctSoundRef = useRef(null);
  const incorrectSoundRef = useRef(null);
  const winSoundRef = useRef(null);

  // Timer ref
  const timerRef = useRef(null);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem(
      "multiplicandRange",
      JSON.stringify(multiplicandRange)
    );
    localStorage.setItem("multiplierRange", JSON.stringify(multiplierRange));
    localStorage.setItem("scoreLimit", JSON.stringify(scoreLimit));
    localStorage.setItem("useTimer", JSON.stringify(useTimer));
    localStorage.setItem("timerDuration", JSON.stringify(timerDuration));
    localStorage.setItem("allowDuplicates", JSON.stringify(allowDuplicates));
    localStorage.setItem(
      "correctAnswerScore",
      JSON.stringify(correctAnswerScore)
    );
    localStorage.setItem(
      "incorrectAnswerScore",
      JSON.stringify(incorrectAnswerScore)
    );
  }, [
    multiplicandRange,
    multiplierRange,
    scoreLimit,
    useTimer,
    timerDuration,
    allowDuplicates,
    correctAnswerScore,
    incorrectAnswerScore,
  ]);

  // Save game history when it changes
  useEffect(() => {
    localStorage.setItem("gameHistory", JSON.stringify(gameHistory));
  }, [gameHistory]);

  // Generate array of numbers for select inputs
  const generateNumberRange = (min, max) => {
    const result = [];
    for (let i = min; i <= max; i++) {
      result.push(i);
    }
    return result;
  };

  // Handle range input changes
  const handleRangeChange = (setter, field, value) => {
    const numValue = parseInt(value, 10);
    setter((prev) => ({ ...prev, [field]: numValue || 0 }));
  };

  // Start the game
  const startGame = () => {
    setScore(0);
    setFinalScore(0);
    setPreviousQuestions([]);
    setGameState("playing");
    setGameStartTime(new Date());
    generateQuestion();
  };

  // Check if the question is a duplicate
  const isDuplicateQuestion = (multiplicand, multiplier) => {
    return previousQuestions.some(
      (q) =>
        (q.multiplicand === multiplicand && q.multiplier === multiplier) ||
        (q.multiplicand === multiplier && q.multiplier === multiplicand)
    );
  };

  // Generate a new question
  const generateQuestion = () => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    let multiplicand, multiplier;
    let isDuplicate = true;
    let attempts = 0;
    const maxAttempts = 20; // Prevent infinite loops if range is too small

    // Generate a unique question if duplicates aren't allowed
    do {
      multiplicand =
        Math.floor(
          Math.random() * (multiplicandRange.max - multiplicandRange.min + 1)
        ) + multiplicandRange.min;
      multiplier =
        Math.floor(
          Math.random() * (multiplierRange.max - multiplierRange.min + 1)
        ) + multiplierRange.min;

      isDuplicate =
        !allowDuplicates && isDuplicateQuestion(multiplicand, multiplier);
      attempts++;

      // If we've tried too many times, just allow a duplicate to prevent hanging
      if (attempts >= maxAttempts) {
        isDuplicate = false;
      }
    } while (isDuplicate);

    const correctAnswer = multiplicand * multiplier;

    // Add to previous questions
    setPreviousQuestions((prev) => [...prev, { multiplicand, multiplier }]);

    // Generate 3 incorrect options
    let wrongOptions = [];
    while (wrongOptions.length < 3) {
      // Generate plausible wrong answers near the correct one
      const offset = Math.floor(Math.random() * 10) - 5;
      const wrongAnswer = correctAnswer + offset;

      if (
        wrongAnswer !== correctAnswer &&
        wrongAnswer > 0 &&
        !wrongOptions.includes(wrongAnswer)
      ) {
        wrongOptions.push(wrongAnswer);
      }
    }

    // Combine and shuffle options
    const allOptions = [correctAnswer, ...wrongOptions];
    for (let i = allOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
    }

    setCurrentQuestion({ multiplicand, multiplier, correctAnswer });
    console.log("Setting current question to", {
      multiplicand,
      multiplier,
      correctAnswer,
    });
    setOptions(allOptions);
    setFeedback(null);

    // Set up timer if enabled
    if (useTimer) {
      setTimeLeft(timerDuration);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          // Only decrement the timer, don't handle timeout here
          // The timeout will be handled by the useEffect hook
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  // Handle answer selection
  const handleAnswer = (selectedAnswer) => {
    debugger;
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Guard against no current question (fixes crash on first question timeout)
    if (!currentQuestion) return;

    // Make a copy of the current question data to avoid stale closures
    const questionData = {
      multiplicand: currentQuestion.multiplicand,
      multiplier: currentQuestion.multiplier,
      correctAnswer: currentQuestion.correctAnswer
    };
    
    console.log("Current Question inside handle answer", questionData);
    const isCorrect = selectedAnswer === questionData.correctAnswer;

    // Calculate new score
    const newScore =
      score + (isCorrect ? correctAnswerScore : incorrectAnswerScore);

    // Update score
    setScore(newScore);

    // Set feedback - always show correct answer when time is up or wrong answer
    setFeedback({
      isCorrect,
      message: isCorrect ? "Correct!" : `Oops! The answer is ${questionData.correctAnswer}`,
      question: `${questionData.multiplicand} × ${questionData.multiplier}`,
    });

    // Play sound
    // if (isCorrect) {
    //   correctSoundRef.current.play();
    // } else {
    //   incorrectSoundRef.current.play();
    // }

    // Check if game should end
    setTimeout(() => {
      if (newScore >= scoreLimit) {
        // Store the final score before ending
        setFinalScore(newScore);
        endGame(newScore);
      } else {
        generateQuestion();
      }
    }, 1500);
  };

  // End the game
  const endGame = (finalScoreValue) => {
    const endTime = new Date();
    const duration = Math.floor((endTime - gameStartTime) / 1000);
    setTotalTimeTaken(duration);

    // Add to history
    const historyEntry = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      score: finalScoreValue, // Use the passed score value
      time: duration,
      ranges: `${multiplicandRange.min}-${multiplicandRange.max} × ${multiplierRange.min}-${multiplierRange.max}`,
    };

    setGameHistory((prev) => [historyEntry, ...prev]);
    setGameState("finished");

    // Play win sound
    winSoundRef.current.play();
  };

  // Reset the game
  const resetGame = () => {
    setGameState("setup");
  };

  // Handle timer expiration
  useEffect(() => {
    if (timeLeft === 0 && timerRef.current) {
      // Clear the timer immediately to prevent any race conditions
      const timerRefCopy = timerRef.current;
      timerRef.current = null;
      clearInterval(timerRefCopy);
      
      // Pass null to indicate time's up
      handleAnswer(null);
    }
  }, [timeLeft]);

  // Special validation for text fields to ensure they can be cleared
  const handleScoreInputChange = (setter, value) => {
    // Allow empty string (to clear the field) or valid numbers
    if (value === "" || !isNaN(parseInt(value, 10))) {
      setter(value === "" ? "" : parseInt(value, 10));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4 flex flex-col items-center">
      {/* Sound effects */}
      <audio
        ref={correctSoundRef}
        src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_942258557f.mp3?filename=correct-6033.mp3"
        preload="auto"
      ></audio>
      <audio
        ref={incorrectSoundRef}
        src="https://cdn.pixabay.com/download/audio/2021/08/04/audio_c9b803a461.mp3?filename=wrong-answer-126515.mp3"
        preload="auto"
      ></audio>
      <audio
        ref={winSoundRef}
        src="https://cdn.pixabay.com/download/audio/2021/08/04/audio_c738d2a1be.mp3?filename=success-fanfare-trumpets-6185.mp3"
        preload="auto"
      ></audio>

      <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl p-6 my-8 relative overflow-hidden">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          Multiplication Adventure
        </h1>

        {/* Setup Screen */}
        {gameState === "setup" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-indigo-700">
                  Multiplicand Range
                </h2>
                <div className="flex space-x-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Min
                    </label>
                    <select
                      value={multiplicandRange.min}
                      onChange={(e) =>
                        handleRangeChange(
                          setMultiplicandRange,
                          "min",
                          e.target.value
                        )
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                    >
                      {generateNumberRange(0, 100).map((num) => (
                        <option key={`min-${num}`} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Max
                    </label>
                    <select
                      value={multiplicandRange.max}
                      onChange={(e) =>
                        handleRangeChange(
                          setMultiplicandRange,
                          "max",
                          e.target.value
                        )
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                    >
                      {generateNumberRange(0, 100).map((num) => (
                        <option key={`max-${num}`} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-indigo-700">
                  Multiplier Range
                </h2>
                <div className="flex space-x-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Min
                    </label>
                    <select
                      value={multiplierRange.min}
                      onChange={(e) =>
                        handleRangeChange(
                          setMultiplierRange,
                          "min",
                          e.target.value
                        )
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                    >
                      {generateNumberRange(0, 100).map((num) => (
                        <option key={`min-${num}`} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Max
                    </label>
                    <select
                      value={multiplierRange.max}
                      onChange={(e) =>
                        handleRangeChange(
                          setMultiplierRange,
                          "max",
                          e.target.value
                        )
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                    >
                      {generateNumberRange(0, 100).map((num) => (
                        <option key={`max-${num}`} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-indigo-700">
                Game Settings
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Score Limit
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="500"
                      step="10"
                      value={scoreLimit}
                      onChange={(e) =>
                        handleScoreInputChange(setScoreLimit, e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Correct Answer Points
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={correctAnswerScore}
                      onChange={(e) =>
                        handleScoreInputChange(
                          setCorrectAnswerScore,
                          e.target.value
                        )
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Incorrect/Missed Points
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={incorrectAnswerScore}
                      onChange={(e) =>
                        handleScoreInputChange(
                          setIncorrectAnswerScore,
                          e.target.value
                        )
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="useTimer"
                      checked={useTimer}
                      onChange={() => setUseTimer(!useTimer)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="useTimer"
                      className="ml-2 block text-sm font-medium text-gray-700"
                    >
                      Use Timer
                    </label>
                  </div>

                  {useTimer && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Timer Duration (seconds)
                      </label>
                      <select
                        value={timerDuration}
                        onChange={(e) =>
                          setTimerDuration(parseInt(e.target.value, 10))
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                      >
                        {generateNumberRange(5, 30).map((num) => (
                          <option key={`timer-${num}`} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="flex items-center mt-4">
                    <input
                      type="checkbox"
                      id="allowDuplicates"
                      checked={allowDuplicates}
                      onChange={() => setAllowDuplicates(!allowDuplicates)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="allowDuplicates"
                      className="ml-2 block text-sm font-medium text-gray-700"
                    >
                      Allow Duplicate Questions
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={startGame}
                className="px-8 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform transition hover:scale-105"
              >
                Start Game
              </button>
            </div>
          </div>
        )}

        {/* Game Play Screen */}
        {gameState === "playing" && currentQuestion && (
          <div className="space-y-6 animate-fadeIn">
            {/* Score and Timer */}
            <div className="flex justify-between items-center">
              <div className="bg-indigo-100 px-4 py-2 rounded-lg">
                <span className="font-bold text-indigo-800">Score: </span>
                <span className="text-xl font-bold text-indigo-600">
                  {score}
                </span>
                <span className="text-sm text-gray-600"> / {scoreLimit}</span>
              </div>

              {useTimer && (
                <div
                  className={`px-4 py-2 rounded-lg ${
                    timeLeft <= 3 ? "bg-red-100 animate-pulse" : "bg-blue-100"
                  }`}
                >
                  <span className="font-bold text-blue-800">Time: </span>
                  <span
                    className={`text-xl font-bold ${
                      timeLeft <= 3 ? "text-red-600" : "text-blue-600"
                    }`}
                  >
                    {timeLeft}
                  </span>
                  <span className="text-sm text-gray-600">s</span>
                </div>
              )}
            </div>

            {/* Question */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-xl shadow-md text-center">
              <div className="text-4xl md:text-6xl font-bold text-indigo-800 flex justify-center items-center space-x-6">
                <span>{currentQuestion.multiplicand}</span>
                <span className="text-pink-500">×</span>
                <span>{currentQuestion.multiplier}</span>
                <span className="text-pink-500">=</span>
                <span className="text-4xl md:text-6xl">?</span>
              </div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-4">
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="bg-white hover:bg-indigo-50 border-2 border-indigo-200 text-indigo-700 text-2xl font-bold py-4 px-6 rounded-xl shadow hover:shadow-md transition-all transform hover:scale-105"
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Feedback */}
            {feedback && (
              <div
                className={`fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 ${
                  feedback.isCorrect ? "bg-green-500" : "bg-red-500"
                }`}
              >
                <div
                  className={`text-center font-bold p-8 rounded-xl animate-bounce ${
                    feedback.isCorrect ? "text-green-100" : "text-red-100"
                  }`}
                >
                  {!feedback.isCorrect && feedback.question && (
                    <div className="text-3xl mb-2">{feedback.question}</div>
                  )}
                  <div className="text-5xl">{feedback.message}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === "finished" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-indigo-700 mb-2">
                Game Complete!
              </h2>
              <div className="text-lg text-gray-600">
                <p>
                  Final Score:{" "}
                  <span className="font-bold text-indigo-600">
                    {finalScore}
                  </span>
                </p>
                <p>
                  Time Taken:{" "}
                  <span className="font-bold text-indigo-600">
                    {Math.floor(totalTimeTaken / 60)}
                  </span>{" "}
                  minutes and{" "}
                  <span className="font-bold text-indigo-600">
                    {totalTimeTaken % 60}
                  </span>{" "}
                  seconds
                </p>
              </div>

              <div className="flex justify-center mt-4">
                <button
                  onClick={resetGame}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Play Again
                </button>
              </div>
            </div>

            {/* History */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-indigo-700">
                Previous Games
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Range
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {gameHistory.map((entry) => (
                      <tr key={entry.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {entry.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {entry.ranges}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                          {entry.score}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {Math.floor(entry.time / 60)}m {entry.time % 60}s
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Decorative elements */}
        <div className="absolute -top-12 -left-12 w-24 h-24 bg-yellow-300 rounded-full opacity-50"></div>
        <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-pink-300 rounded-full opacity-50"></div>
        <div className="absolute top-1/4 -right-6 w-12 h-12 bg-blue-300 rounded-full opacity-50"></div>
        <div className="absolute bottom-1/3 -left-6 w-12 h-12 bg-green-300 rounded-full opacity-50"></div>
      </div>

      <footer className="text-center text-gray-500 text-sm">
        Have fun learning multiplication! 🎮✨
      </footer>
    </div>
  );
};

export default MultiplicationGame;
