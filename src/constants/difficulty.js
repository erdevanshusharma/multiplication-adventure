// Difficulty configuration constants

export const DIFFICULTY_LEVELS = [1, 2, 3, 4, 5];

export const DIFFICULTY_GROUPS = [
  'easy',
  'medium', 
  'hard',
  'expert',
  'god'
];

// Validation functions
export const isValidDifficultyLevel = (level) => {
  const numLevel = parseInt(level);
  return DIFFICULTY_LEVELS.includes(numLevel);
};

export const isValidDifficultyGroup = (group) => {
  return DIFFICULTY_GROUPS.includes(group?.toLowerCase());
};

// Helper function to get valid difficulty level (defaults to 1 if invalid)
export const getValidDifficultyLevel = (level) => {
  const numLevel = parseInt(level);
  return isValidDifficultyLevel(numLevel) ? numLevel : 1;
};

// Helper function to get valid difficulty group (defaults to 'easy' if invalid)
export const getValidDifficultyGroup = (group) => {
  const lowerGroup = group?.toLowerCase();
  return isValidDifficultyGroup(lowerGroup) ? lowerGroup : 'easy';
};