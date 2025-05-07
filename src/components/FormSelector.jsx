import React from 'react';
import { Link } from 'react-router-dom';

export default function FormSelector() {
  const forms = [
    { id: 'obs', name: 'Classroom Observation', path: '/observation' },
    { id: 'quiz', name: 'Quiz Feedback',      path: '/quiz'       },
    { id: 'survey', name: 'Student Survey',    path: '/survey'     },
    { id: 'eval', name: 'Teacher Evaluation', path: '/evaluation' }
  ];

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Select a Form</h1>
      <div className="row gy-4">
        {forms.map(f => (
          <div key={f.id} className="col-md-6 col-lg-3">
            <Link to={f.path} className="card text-center h-100 text-decoration-none shadow-sm">
              <div className="card-body d-flex flex-column justify-content-center">
                <h5 className="card-title text-success">{f.name}</h5>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
