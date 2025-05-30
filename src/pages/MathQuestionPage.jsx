import { useParams } from "react-router-dom";
import {
  getValidDifficultyLevel,
  getValidDifficultyGroup,
  isValidDifficultyLevel,
  isValidDifficultyGroup,
} from "../constants/difficulty";

export default function MathQuestionPage() {
  const { difficultyGroup, difficultyLevel } = useParams();

  // Validate and sanitize the difficulty parameters
  const validLevel = getValidDifficultyLevel(difficultyLevel);
  const validGroup = getValidDifficultyGroup(difficultyGroup);

  // Check if parameters were invalid
  const levelWasInvalid = !isValidDifficultyLevel(difficultyLevel);
  const groupWasInvalid = !isValidDifficultyGroup(difficultyGroup);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Math Question Page</h1>

      {(levelWasInvalid || groupWasInvalid) && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p className="font-semibold">
            Invalid difficulty parameters detected:
          </p>
          <ul className="list-disc list-inside">
            {levelWasInvalid && (
              <li>Level must be between 1-5. Using default level 1.</li>
            )}
            {groupWasInvalid && (
              <li>
                Group must be one of: easy, medium, hard, expert, god. Using
                default 'easy'.
              </li>
            )}
          </ul>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-lg">
          Difficulty Group:{" "}
          <span className="font-semibold capitalize">{validGroup}</span>
        </p>
        <p className="text-lg">
          Difficulty Level: <span className="font-semibold">{validLevel}</span>
        </p>
      </div>
      <p className="text-gray-600 mt-4">Ready for some math challenges?</p>
    </div>
  );
}
