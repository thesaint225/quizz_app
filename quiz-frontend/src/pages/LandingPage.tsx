// Import  the `useNavigate` hook from the react-router dom
// This hook is for programmatically navigation
import { useNavigate } from 'react-router-dom';

// Define a functional React component named Landing  Page
export default function LandingPage() {
  // Get the navigate function React from useNavigate so we can redirect the use later
  const navigate = useNavigate();

  //   Define a function that will be trigged when the '' Start quiz'' button is clicked
  const handleStart = () => {
    // In the future , we might also reset the quiz state, clear scores, or other setup
    // Navigate to the ''/quiz'' route(this should be the route for QuizPage )
    navigate('/quiz');
  };
  return (
    // Jsx display the landing page
    <div>
      <h1>Test your French </h1>
      {/* Button that triggers the handleStart function when clicked */}
      <button onClick={handleStart}> Start button</button>
    </div>
  );
}
