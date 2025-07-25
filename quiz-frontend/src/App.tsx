import { Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './pages/LandingPage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';

function App() {
  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/quiz' element={<QuizPage />} />
      <Route path='/result' element={<ResultsPage />} />
    </Routes>
  );
}

export default App;
