import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import SettingsPage from './pages/SettingsPage';
import LevelsPage from './pages/LevelsPage';
import DrawingPage from './pages/DrawingPage';
import MathQuestionPage from './pages/MathQuestionPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/levels" element={<LevelsPage />} />
        <Route path="/drawing/:pageNumber" element={<DrawingPage />} />
        <Route path="/questions/:difficultyGroup/:difficultyLevel" element={<MathQuestionPage />} />
      </Routes>
    </Router>
  );
}