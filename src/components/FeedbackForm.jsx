import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FeedbackForm = () => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [previousFeedback, setPreviousFeedback] = useState([]);
  const navigate = useNavigate();

  // Fetch previous feedback
  useEffect(() => {
    fetchPreviousFeedback();
  }, []);

  const fetchPreviousFeedback = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:3001/api/feedback', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setPreviousFeedback(data.feedback);
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('Feedback submitted successfully!');
        setMessage('');
        // Refresh the feedback list
        fetchPreviousFeedback();
      } else {
        setStatus(data.message || 'Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus('Error submitting feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '40px auto',
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Submit Feedback</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your feedback here..."
            required
            rows={4}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              resize: 'vertical'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading ? '#cccccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </button>

        {status && (
          <div style={{
            marginTop: '10px',
            padding: '10px',
            borderRadius: '4px',
            backgroundColor: status.includes('success') ? '#e8f5e9' : '#ffebee',
            color: status.includes('success') ? '#2e7d32' : '#c62828',
            textAlign: 'center'
          }}>
            {status}
          </div>
        )}
      </form>

      {previousFeedback.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h3 style={{ marginBottom: '15px' }}>Your Previous Feedback</h3>
          <div style={{ maxHeight: '300px', overflow: 'auto' }}>
            {previousFeedback.map((feedback, index) => (
              <div
                key={index}
                style={{
                  padding: '10px',
                  marginBottom: '10px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '4px'
                }}
              >
                <p style={{ margin: '0' }}>{feedback.message}</p>
                <small style={{ color: '#666' }}>
                  {new Date(feedback.createdAt).toLocaleDateString()}
                </small>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackForm;
