import React, { useEffect, useState } from "react";

const onlineCourses = {
  // Career paths courses
  "Healthcare, Social Work, Counseling": [
    { name: "Introduction to Psychology", platform: "Coursera", link: "https://www.coursera.org/learn/introduction-psychology" },
    { name: "Social Work Practice", platform: "edX", link: "https://www.edx.org/learn/social-work" },
    { name: "Mental Health and Well-being", platform: "Udemy", link: "https://www.udemy.com/topic/mental-health/" }
  ],
  "Arts, Media, Design, Content Creation": [
    { name: "Graphic Design Specialization", platform: "Coursera", link: "https://www.coursera.org/specializations/graphic-design" },
    { name: "Digital Media and Marketing", platform: "LinkedIn Learning", link: "https://www.linkedin.com/learning/topics/digital-media" },
    { name: "Content Creation Masterclass", platform: "Udemy", link: "https://www.udemy.com/topic/content-creation/" }
  ],
  "Business, Management, Entrepreneurship": [
    { name: "Business Foundations", platform: "Coursera", link: "https://www.coursera.org/specializations/wharton-business-foundations" },
    { name: "Entrepreneurship Essentials", platform: "Harvard Online", link: "https://online.hbs.edu/courses/entrepreneurship-essentials/" },
    { name: "Project Management Professional", platform: "PMI", link: "https://www.pmi.org/certifications/project-management-pmp" }
  ],
  "Engineering, Research, Technology, Innovation": [
    { name: "Computer Science Fundamentals", platform: "edX", link: "https://www.edx.org/learn/computer-science" },
    { name: "Engineering Innovation", platform: "Coursera", link: "https://www.coursera.org/learn/engineering-innovation" },
    { name: "Research Methods", platform: "FutureLearn", link: "https://www.futurelearn.com/subjects/science-engineering-and-maths-courses" }
  ],
  // Domain specific courses
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
    { name: "CompTIA Security+", platform: "CompTIA", link: "https://www.comptia.org/certifications/security" }
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

const QuizResults = () => {
  const [quizHistory, setQuizHistory] = useState({
    career: null,
    domain: null
  });

  useEffect(() => {
    const fetchQuizHistory = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:3001/api/quiz/history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setQuizHistory({
            career: data.careerQuiz,
            domain: data.domainQuiz
          });
        }
      } catch (error) {
        console.error("Error fetching quiz history:", error);
      }
    };

    fetchQuizHistory();
  }, []);

  const renderRoadmap = (title, roadmap) => (
    <div className="roadmap-section">
      <h3>{title}</h3>
      <div className="roadmap-steps">
        {roadmap.map((step, index) => (
          <div key={index} className="roadmap-step">
            <div className="step-number">{index + 1}</div>
            <div className="step-content">{step}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCourses = (title) => (
    <div className="courses-section">
      <h3>Recommended Online Courses</h3>
      <div className="courses-grid">
        {onlineCourses[title]?.map((course, index) => (
          <div key={index} className="course-card">
            <h4>{course.name}</h4>
            <p>Platform: {course.platform}</p>
            <a href={course.link} target="_blank" rel="noopener noreferrer">
              Learn More →
            </a>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="quiz-results-container">
      <h2>Your Personalized Learning Path</h2>
      
      {quizHistory.career && (
        <div className="career-section">
          <h2>Career Path: {quizHistory.career.title}</h2>
          {renderRoadmap("Career Roadmap", quizHistory.career.roadmap)}
          {renderCourses(quizHistory.career.title)}
        </div>
      )}

      {quizHistory.domain && (
        <div className="domain-section">
          <h2>Technical Domain: {quizHistory.domain.title}</h2>
          {renderRoadmap("Domain Roadmap", quizHistory.domain.roadmap)}
          {renderCourses(quizHistory.domain.title)}
        </div>
      )}

      <style jsx>{`
        .quiz-results-container {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .roadmap-section {
          margin: 2rem 0;
          padding: 1rem;
          background: #f5f5f5;
          border-radius: 8px;
        }

        .roadmap-steps {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .roadmap-step {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: white;
          border-radius: 6px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .step-number {
          width: 30px;
          height: 30px;
          background: #007bff;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-top: 1rem;
        }

        .course-card {
          padding: 1.5rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }

        .course-card h4 {
          margin: 0 0 0.5rem 0;
          color: #2c3e50;
        }

        .course-card a {
          display: inline-block;
          margin-top: 1rem;
          color: #007bff;
          text-decoration: none;
        }

        .course-card a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default QuizResults; 