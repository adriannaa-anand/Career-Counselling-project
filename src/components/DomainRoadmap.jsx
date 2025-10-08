import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const onlineCourses = {
  "Web Development": [
    { name: "The Web Developer Bootcamp", platform: "Udemy", link: "https://www.udemy.com/course/the-web-developer-bootcamp/" },
    { name: "Full Stack Development", platform: "freeCodeCamp", link: "https://www.freecodecamp.org/" },
    { name: "React - The Complete Guide", platform: "Udemy", link: "https://www.udemy.com/course/react-the-complete-guide-incl-redux/" }
  ],
  "Data Science / Analytics": [
    { name: "Data Science Specialization", platform: "Coursera", link: "https://www.coursera.org/specializations/jhu-data-science" },
    { name: "Python for Data Science", platform: "edX", link: "https://www.edx.org/learn/python" },
    { name: "Machine Learning A-Z", platform: "Udemy", link: "https://www.udemy.com/course/machinelearning/" }
  ],
  "Cybersecurity": [
    { name: "Cybersecurity Specialization", platform: "Coursera", link: "https://www.coursera.org/specializations/cyber-security" },
    { name: "Ethical Hacking", platform: "Udemy", link: "https://www.udemy.com/course/ethical-hacking/" },
    { name: "CompTIA Security+", platform: "CompTIA", link: "https://www.comptia.org/certifications/security" },
    { name: "Network Security Basics", platform: "Coursera", link: "https://www.coursera.org/learn/network-security-basics" }
  ],
  "UI/UX Design": [
    { name: "Google UX Design Certificate", platform: "Coursera", link: "https://www.coursera.org/professional-certificates/google-ux-design" },
    { name: "UI/UX Design Bootcamp", platform: "Udemy", link: "https://www.udemy.com/course/ui-ux-web-design-using-adobe-xd/" },
    { name: "Design Thinking", platform: "IDEO", link: "https://www.ideou.com/products/design-thinking-certificate" }
  ],
  "AI / Machine Learning": [
    { name: "Deep Learning Specialization", platform: "Coursera", link: "https://www.coursera.org/specializations/deep-learning" },
    { name: "Machine Learning", platform: "Stanford Online", link: "https://www.coursera.org/learn/machine-learning" },
    { name: "TensorFlow Developer Certificate", platform: "Google", link: "https://www.tensorflow.org/certificate" }
  ]
};

const DomainRoadmap = () => {
  const [domainRoadmaps, setDomainRoadmaps] = useState([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoadmaps = async () => {
      const token = localStorage.getItem("token");
      setLoading(true);
      setError(null);
      
      try {
        // Fetch all roadmaps from the new endpoint
        const response = await fetch("http://localhost:3001/api/roadmaps", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch roadmaps');
        }
        
        const data = await response.json();
        console.log("Roadmaps data received by frontend:", data); // Debug log
        
        if (data && data.domainRoadmaps) {
          setDomainRoadmaps(data.domainRoadmaps);
          // Automatically select the latest roadmap if available
          if (data.domainRoadmaps.length > 0) {
            setSelectedRoadmap(data.domainRoadmaps[0]);
          }
        }

      } catch (error) {
        console.error("Error fetching data:", error);
        // Check for authentication errors and redirect to login
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          alert("Your session has expired. Please login again.");
          navigate("/login");
        } else {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmaps();
  }, [navigate]);

  const handleRoadmapSelect = (roadmap) => {
    setSelectedRoadmap(roadmap);
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <h2>Loading your domain roadmap...</h2>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Roadmap</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  if (domainRoadmaps.length === 0) return <div>No domain roadmaps found. Take a domain quiz to generate one!</div>;

  const roadmapToDisplay = selectedRoadmap || domainRoadmaps[0];

  // Display a message if no roadmap is found
  if (!roadmapToDisplay) {
    return (
      <div className="no-data-container">
        <h2>No Domain Roadmaps Found</h2>
        <p>Take a domain quiz to generate one!</p>
         <button onClick={() => navigate('/domain')} className="take-quiz-btn">Take Domain Quiz</button>
      </div>
    );
  }

  return (
    <div className="roadmap-container">
      <h2>Your Technical Domain Roadmaps</h2>

      {/* Optional: Dropdown or list to select different roadmaps */}
      {domainRoadmaps.length > 1 && (
        <div className="roadmap-selector">
          <h4>Select a Roadmap:</h4>
          <select onChange={(e) => handleRoadmapSelect(domainRoadmaps.find(r => r._id === e.target.value))}>
            {domainRoadmaps.map(roadmap => (
              <option key={roadmap._id} value={roadmap._id}>
                {roadmap.suggestedDomain} - {formatDate(roadmap.createdAt)}
              </option>
            ))}
          </select>
        </div>
      )}

      {roadmapToDisplay && (
        <div className="domain-path">
          <h3>Selected Domain: {roadmapToDisplay.suggestedDomain}</h3>
        
          {/* Removed history section as it was fetching from a different endpoint and structure */}
          {/* You can add it back and adapt it to the new /api/roadmaps structure if needed */}

          <div className="roadmap-section">
            <h4>Technical Journey</h4>
            <div className="roadmap-steps">
              {/* Using the new structure from backend */}
              {roadmapToDisplay?.roadmap && roadmapToDisplay.roadmap.length > 0 ? (
                roadmapToDisplay.roadmap.map((step, index) => (
                  <div key={index} className="roadmap-step">
                    <div className="step-number">{index + 1}</div>
                    <div className="step-content">{step}</div>
                  </div>
                ))
              ) : (
                <p>No roadmap steps available.</p>
              )}
            </div>
          </div>

          <div className="courses-section">
            <h4>Recommended Technical Courses</h4>
            <div className="courses-grid">
              {/* Always display hardcoded courses based on selected domain if roadmapToDisplay exists */}
              {onlineCourses[roadmapToDisplay.suggestedDomain]?.map((course, index) => (
                <div key={index} className="course-card">
                  <h5>{course?.name || course?.title}</h5> {/* Use name or title */}
                  <p>Platform: {course?.platform}</p>
                  {course?.link && (
                    <a href={course.link} target="_blank" rel="noopener noreferrer">
                      Learn More →
                    </a>
                  )}
                </div>
              ))}
               {/* Display fallback message if no hardcoded courses are available for the domain */}
               {!onlineCourses[roadmapToDisplay.suggestedDomain] && (
                  <p>No course suggestions available for this domain.</p>
               )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .roadmap-container {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .loading-container,
        .error-container,
        .no-data-container {
          text-align: center;
          padding: 3rem;
          margin: 2rem auto;
          max-width: 600px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .loading-spinner {
          margin: 2rem auto;
          width: 50px;
          height: 50px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .retry-btn,
        .take-quiz-btn {
          display: inline-block;
          margin-top: 1rem;
          padding: 0.8rem 1.5rem;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          text-decoration: none;
          font-size: 1rem;
          transition: background-color 0.3s;
        }

        .retry-btn:hover,
        .take-quiz-btn:hover {
          background: #0056b3;
        }

        .domain-path {
          margin-top: 2rem;
        }

        .history-section {
          margin: 2rem 0;
          padding: 1.5rem;
          background: #f8f9fa;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .history-table {
          overflow-x: auto;
          margin-top: 1rem;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 6px;
          overflow: hidden;
        }

        th, td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #eee;
        }

        th {
          background: #2c3e50;
          color: white;
          font-weight: 500;
        }

        tr:hover {
          background: #f5f5f5;
        }

        .current-result {
          background: #e3f2fd;
        }

        .current-result:hover {
          background: #bbdefb;
        }

        .roadmap-section {
          margin: 2rem 0;
          padding: 1.5rem;
          background: #f8f9fa;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .roadmap-steps {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .roadmap-step {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: white;
          border-radius: 6px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .step-number {
          width: 32px;
          height: 32px;
          background: #007bff;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .courses-section {
          margin-top: 3rem;
        }

        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-top: 1.5rem;
        }

        .course-card {
          padding: 1.5rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          transition: transform 0.2s;
        }

        .course-card:hover {
          transform: translateY(-5px);
        }

        .course-card h5 {
          margin: 0 0 0.5rem 0;
          color: #2c3e50;
        }

        .course-card a {
          display: inline-block;
          margin-top: 1rem;
          color: #007bff;
          text-decoration: none;
          font-weight: 500;
        }

        .course-card a:hover {
          text-decoration: underline;
        }

        h2, h3, h4 {
          color: #2c3e50;
        }

        h2 {
          font-size: 2rem;
          margin-bottom: 1.5rem;
        }

        h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }

        h4 {
          font-size: 1.25rem;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
};

export default DomainRoadmap; 