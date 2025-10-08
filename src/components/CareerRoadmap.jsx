import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const onlineCourses = {
  "Healthcare, Social Work, Counseling": [
    {
      name: "Introduction to Psychology",
      platform: "Coursera",
      link: "https://www.coursera.org/learn/introduction-psychology",
    },
    {
      name: "Social Work Practice",
      platform: "edX",
      link: "https://www.edx.org/learn/social-work",
    },
    {
      name: "Mental Health and Well-being",
      platform: "Udemy",
      link: "https://www.udemy.com/topic/mental-health/",
    },
  ],
  "Arts, Media, Design, Content Creation": [
    {
      name: "Graphic Design Specialization",
      platform: "Coursera",
      link: "https://www.coursera.org/specializations/graphic-design",
    },
    {
      name: "Digital Media and Marketing",
      platform: "LinkedIn Learning",
      link: "https://www.linkedin.com/learning/topics/digital-media",
    },
    {
      name: "Content Creation Masterclass",
      platform: "Udemy",
      link: "https://www.udemy.com/topic/content-creation/",
    },
  ],
  "Business, Management, Entrepreneurship": [
    {
      name: "Business Foundations",
      platform: "Coursera",
      link: "https://www.coursera.org/specializations/wharton-business-foundations",
    },
    {
      name: "Entrepreneurship Essentials",
      platform: "Harvard Online",
      link: "https://online.hbs.edu/courses/entrepreneurship-essentials/",
    },
    {
      name: "Project Management Professional",
      platform: "PMI",
      link: "https://www.pmi.org/certifications/project-management-pmp",
    },
  ],
  "Engineering, Research, Technology, Innovation": [
    {
      name: "Computer Science Fundamentals",
      platform: "edX",
      link: "https://www.edx.org/learn/computer-science",
    },
    {
      name: "Engineering Innovation",
      platform: "Coursera",
      link: "https://www.coursera.org/learn/engineering-innovation",
    },
    {
      name: "Research Methods",
      platform: "FutureLearn",
      link: "https://www.futurelearn.com/subjects/science-engineering-and-maths-courses",
    },
  ],
};

const CareerRoadmap = () => {
  const [careerRoadmaps, setCareerRoadmaps] = useState([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const token = localStorage.getItem("token"); 
      
        const res = await axios.get(
          "http://localhost:3001/api/roadmaps",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (res.data && res.data.careerRoadmaps) {
          console.log("Career Roadmaps data received by frontend:", res.data);
          setCareerRoadmaps(res.data.careerRoadmaps);
          
          if (res.data.careerRoadmaps.length > 0) {
            setSelectedRoadmap(res.data.careerRoadmaps[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching roadmaps:", err);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          alert("Your session has expired. Please login again.");
          navigate("/login");
        } else {
          setError("Failed to fetch career roadmaps.");
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

  if (loading) return <div>Loading Career Roadmaps...</div>;

  if (error) return <div>Error: {error}</div>;

  if (careerRoadmaps.length === 0) return <div>No career roadmaps found. Take a career quiz to generate one!</div>;

  
  const roadmapToDisplay = selectedRoadmap || careerRoadmaps[0]; 

  // Display a message if no roadmap is found
  if (!roadmapToDisplay) {
    return (
      <div className="no-data-container">
        <h2>No Career Roadmaps Found</h2>
        <p>Take a career quiz to generate one!</p>
         <button onClick={() => navigate('/career')} className="take-quiz-btn">Take Career Quiz</button>
      </div>
    );
  }

  return (
    <div className="roadmap-container">
      <h2>Your Career Roadmaps</h2>

      
      {careerRoadmaps.length > 1 && (
        <div className="roadmap-selector">
          <h4>Select a Roadmap:</h4>
          <select onChange={(e) => handleRoadmapSelect(careerRoadmaps.find(r => r._id === e.target.value))}>
            {careerRoadmaps.map(roadmap => (
              <option key={roadmap._id} value={roadmap._id}>
                {roadmap.result} - {new Date(roadmap.createdAt).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>
      )}

      {roadmapToDisplay && (
        <div className="career-path">
          <h3>🎯 Suggested Career Path: {roadmapToDisplay.result}</h3>

          
          <div className="roadmap-section">
            <h4>🛣️ Career Journey</h4>
            <div className="roadmap-steps">
              {roadmapToDisplay?.roadmap && roadmapToDisplay.roadmap.length > 0 ? (
                roadmapToDisplay.roadmap.map((step, i) => (
                  <div className="roadmap-step" key={i}>
                    <div className="step-number">{i + 1}</div>
                    <div className="step-content">{step}</div>
                  </div>
                ))
              ) : (
                <p>No roadmap steps available.</p>
              )}
            </div>
          </div>

        
          {/* Always display hardcoded courses based on selected career if roadmapToDisplay exists */}
          {onlineCourses[roadmapToDisplay.result]?.map((course, i) => (
            <div className="course-card" key={i}>
              <h5>{course?.name || course?.title}</h5> {/* Use name or title */}
              <p>Platform: {course?.platform}</p>
              {course?.link && (
                <a href={course.link} target="_blank" rel="noopener noreferrer">
                  Learn More →
                </a>
              )}
            </div>
          ))}
           {/* Display fallback message if no hardcoded courses are available for the career */}
           {!onlineCourses[roadmapToDisplay.result] && (
              <p>No course suggestions available for this career.</p>
           )}
        </div>
      )}

      {/* Styling */}
      <style jsx>{`
        .roadmap-container {
          padding: 2rem;
          max-width: 1100px;
          margin: auto;
        }
        .loading-container {
          text-align: center;
          padding: 3rem;
        }
        .history-section,
        .roadmap-section,
        .courses-section {
          background: #f9f9f9;
          border-radius: 8px;
          padding: 1.5rem;
          margin: 2rem 0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
        }
        th,
        td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        th {
          background: #007bff;
          color: white;
        }
        .current-result {
          background-color: #e3f2fd;
        }
        .roadmap-steps {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        .roadmap-step {
          background: white;
          display: flex;
          gap: 1rem;
          padding: 1rem;
          border-radius: 6px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        .step-number {
          background: #007bff;
          color: white;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-top: 1.5rem;
        }
        .course-card {
          background: white;
          padding: 1.25rem;
          border-radius: 8px;
          box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
          transition: 0.2s ease;
        }
        .course-card:hover {
          transform: translateY(-4px);
        }
        .course-card h5 {
          margin: 0;
          font-size: 1.1rem;
          color: #333;
        }
        .course-card a {
          color: #007bff;
          font-weight: 500;
          display: inline-block;
          margin-top: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default CareerRoadmap;
