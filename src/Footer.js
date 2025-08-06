import React, { useState } from 'react';
import './Footer.css';

const Footer = () => {
  const [showEmail, setShowEmail] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  const handleContactClick = () => {
    setShowEmail((prev) => !prev);
  };

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (feedback.trim()) {
      const feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
      feedbacks.push({ text: feedback, date: new Date().toISOString() });
      localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
      setFeedback('');
      setFeedbackSent(true);
      setTimeout(() => setFeedbackSent(false), 2000);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-heading">Get in Touch</h3>
          <button className="footer-btn" onClick={handleContactClick} aria-label="Show email address">
            Contact Us
          </button>
          {showEmail && <span className="footer-email">Vishwapratap174@gmail.com</span>}
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">Feedback</h3>
          <form className="footer-feedback-form" onSubmit={handleFeedbackSubmit}>
            <input
              id="footer-feedback-input"
              className="footer-feedback-input"
              type="text"
              value={feedback}
              onChange={handleFeedbackChange}
              placeholder="Your feedback..."
              maxLength={200}
              required
            />
            <button className="footer-btn" type="submit">Submit</button>
          </form>
          {feedbackSent && <span className="footer-feedback-sent">Thank you!</span>}
        </div>
      </div>

      <div className="footer-bottom">
        <a
          href="https://vishwapratap777.github.io/Portfolio/"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          Visit My Portfolio
        </a>
        <div className="footer-signature">
          Built with <span role="img" aria-label="love">❤️</span> by Vishwa Pratap Chauhan
        </div>
      </div>
    </footer>
  );
};

export default Footer;
