import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BiUser, BiEnvelope, BiCalendar, BiTime, BiBook, BiNote } from 'react-icons/bi';

const SHEETS_API_URL = process.env.REACT_APP_SHEETS_API_URL;
const EMAIL_API_URL = process.env.REACT_APP_EMAIL_API_URL;

export default function ClassroomObservationForm() {
  const [formData, setFormData] = useState({
    teacher_name: '',
    teacher_email: '',
    grade_level: '',
    subject: '',
    lesson_topic: '',
    observation_date: '',
    time_in: '',
    time_out: '',
    observation_notes: ''
  });
  const [loadingMessage, setLoadingMessage] = useState('Submitting your form ...');
  const [success, setSuccess] = useState(false);
  const formRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    document.getElementById('loading-overlay').classList.remove('d-none');
    try {
      setLoadingMessage('Saving sheet data...');
      await fetch(SHEETS_API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      setLoadingMessage('Preparing report...');
      const canvas = await html2canvas(formRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
      const { width, height } = pdf.internal.pageSize;
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      const pdfBlob = pdf.output('blob');
      setLoadingMessage('Sending email...');
      const emailForm = new FormData();
      emailForm.append('to', formData.teacher_email);
      emailForm.append('subject', 'Classroom Observation Report');
      emailForm.append('attachment', pdfBlob, 'report.pdf');
      await fetch(EMAIL_API_URL, { method: 'POST', body: emailForm });
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert('Error: ' + err.message);
    } finally {
      document.getElementById('loading-overlay').classList.add('d-none');
    }
  };

  return (
    <div className="container py-5" style={{ background: 'linear-gradient(135deg, #e6f3e6 0%, #e0f7fa 100%)', minHeight: '100vh' }}>
      <div ref={formRef} className="mx-auto" style={{ maxWidth: '700px' }}>
        <h2 className="mb-4 text-center display-6 text-success">📝 Classroom Observation</h2>
        {success && (
          <div className="alert alert-success d-flex align-items-center" role="alert">
            <BiBook size={24} className="me-2" />
            <div>Success! Report emailed to the teacher.</div>
          </div>
        )}

        {/* Teacher Information */}
        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-success text-white d-flex align-items-center">
            <BiUser className="me-2" /> Teacher Information
          </div>
          <div className="card-body">
            <div className="mb-3 input-group">
              <span className="input-group-text"><BiUser /></span>
              <input
                type="text" name="teacher_name" value={formData.teacher_name}
                onChange={handleChange} required className="form-control"
                placeholder="Teacher's Name" />
            </div>
            <div className="mb-3 input-group">
              <span className="input-group-text"><BiEnvelope /></span>
              <input
                type="email" name="teacher_email" value={formData.teacher_email}
                onChange={handleChange} required className="form-control"
                placeholder="Teacher's Email" />
            </div>
          </div>
        </div>

        {/* Class Details */}
        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-info text-white d-flex align-items-center">
            <BiCalendar className="me-2" /> Class Details
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Grade Level</label>
                <select name="grade_level" value={formData.grade_level} onChange={handleChange} required className="form-select">
                  <option value="">Select Grade</option>
                  {['K','1','2','3','4','5','6','7','8','9','10','11','12'].map(g => <option key={g} value={g}>Grade {g}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Subject</label>
                <select name="subject" value={formData.subject} onChange={handleChange} required className="form-select">
                  <option value="">Select Subject</option>
                  {['Math','Science','ELA','History','Art','Music','PE','Elective'].map(sub => <option key={sub} value={sub}>{sub}</option>)}
                </select>
              </div>
              <div className="col-md-6 input-group">
                <span className="input-group-text"><BiBook /></span>
                <input type="text" name="lesson_topic" value={formData.lesson_topic}
                  onChange={handleChange} required className="form-control"
                  placeholder="Lesson Topic" />
              </div>
              <div className="col-md-6 input-group">
                <span className="input-group-text"><BiCalendar /></span>
                <input type="date" name="observation_date" value={formData.observation_date}
                  onChange={handleChange} required className="form-control" />
              </div>
              <div className="col-md-6 input-group">
                <span className="input-group-text"><BiTime /></span>
                <input type="time" name="time_in" value={formData.time_in}
                  onChange={handleChange} required className="form-control" />
              </div>
              <div className="col-md-6 input-group">
                <span className="input-group-text"><BiTime /></span>
                <input type="time" name="time_out" value={formData.time_out}
                  onChange={handleChange} required className="form-control" />
              </div>
            </div>
          </div>
        </div>

        {/* Observation Notes */}
        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-warning text-dark d-flex align-items-center">
            <BiNote className="me-2" /> Observation Notes
          </div>
          <div className="card-body">
            <textarea name="observation_notes" rows={6}
              value={formData.observation_notes} onChange={handleChange}
              required className="form-control" placeholder="Enter detailed notes..."></textarea>
          </div>
        </div>

        {/* Submit */}
        <div className="text-center">
          <button type="submit" className="btn btn-lg btn-success shadow-sm px-5 py-2">
            Submit <BiEnvelope className="ms-2" />
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      <div id="loading-overlay" className="loading-overlay d-none position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center" style={{ background: 'rgba(255,255,255,0.8)' }}>
        <div className="spinner-border text-success" role="status"><span className="visually-hidden">Loading...</span></div>
        <p className="mt-3 text-success">{loadingMessage}</p>
      </div>
    </div>
  );
}
