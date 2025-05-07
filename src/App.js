import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FormSelector from './components/FormSelector';
import ClassroomObservationForm from './components/ClassroomObservationForm';
// import QuizFeedbackForm from './components/QuizFeedbackForm';
// import StudentSurveyForm from './components/StudentSurveyForm';
// import TeacherEvaluationForm from './components/TeacherEvaluationForm';

function App() {
  return (
    <Routes>
      <Route path="/" element={<FormSelector />} />
      <Route path="/observation" element={<ClassroomObservationForm />} />
      {/* Add additional form routes here */}
    </Routes>
  );
}

export default App;
