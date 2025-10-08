import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const questions = [
  { id: 1, scenario: "I often go out of my way to help people in need." },
  { id: 2, scenario: "I enjoy expressing myself through art, music, or writing." },
  { id: 3, scenario: "I like leading and organizing teams to complete tasks." },
  { id: 4, scenario: "I am curious about how machines and systems work." },
  { id: 5, scenario: "I feel fulfilled when I support someone emotionally." },
  { id: 6, scenario: "I frequently come up with creative ideas or stories." },
  { id: 7, scenario: "I prefer taking charge in group settings." },
  { id: 8, scenario: "I enjoy solving technical problems and logical puzzles." },
  { id: 9, scenario: "I am deeply interested in understanding human emotions and behavior." },
  { id: 10, scenario: "I like experimenting with new technologies or building things." }
];

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

const mapping = ["A", "B", "C", "D", "A", "B", "C", "D", "A", "D"];

const colorOptions = [
  { score: 1, label: "Strongly Disagree", color: "#f44336" },
  { score: 2, label: "Disagree", color: "#ff9800" },
  { score: 3, label: "Neutral", color: "#ffc107" },
  { score: 4, label: "Agree", color: "#8bc34a" },
  { score: 5, label: "Strongly Agree", color: "#4caf50" }
];

const careerMapping = {
  A: {
    title: "Healthcare, Social Work, Counseling",
    roadmap: [
      "Start with volunteering or community service",
      "Take basic courses in psychology, healthcare, or social work",
      "Pursue certifications or degrees related to your field",
      "Gain field experience through internships",
      "Work with organizations or start your own support initiative"
    ]
  },
  B: {
    title: "Arts, Media, Design, Content Creation",
    roadmap: [
      "Explore different art forms or media tools",
      "Build a creative portfolio (art, videos, stories, etc.)",
      "Take courses in design, media production, or fine arts",
      "Freelance, join studios, or publish your work",
      "Establish your brand or join creative agencies"
    ]
  },
  C: {
    title: "Business, Management, Entrepreneurship",
    roadmap: [
      "Start with small leadership roles (clubs, events, startups)",
      "Study business basics (management, finance, marketing)",
      "Build problem-solving and networking skills",
      "Intern at companies or launch side projects",
      "Grow into leadership roles or start your own venture"
    ]
  },
  D: {
    title: "Engineering, Research, Technology, Innovation",
    roadmap: [
      "Explore building, coding, or tech experiments",
      "Study math, science, or engineering fundamentals",
      "Work on personal projects (DIYs, coding, robotics)",
      "Get internships or assistant roles in research labs",
      "Specialize and innovate in your chosen tech field"
    ]
  }
};

const CareerCounsellingQuiz = () => {
  const [current, setCurrent] = useState(0);
  const [scores, setScores] = useState([]);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleSelect = (score) => {
    const newScores = [...scores];
    newScores[current] = score;
    setScores(newScores);
  };

  const handleNext = () => {
    if (scores[current]) {
      setCurrent(current + 1);
    } else {
      alert("Please select an option.");
    }
  };

  const saveResult = async (result) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to save your quiz results");
      navigate("/login");
      return;
    }
    try {
      const res = await fetch("http://localhost:3001/api/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          type: "career",
          title: result.title,
          level: "beginner",
          roadmap: result.roadmap,
          courses: onlineCourses[result.title],
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Error saving quiz result:", data.message);
      } else {
        // Redirect to results page after successful save
        navigate("/quiz-results");
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  const handleSubmit = () => {
    if (!scores[current]) {
      alert("Please select an option.");
      return;
    }

    const domainScores = { A: 0, B: 0, C: 0, D: 0 };

    scores.forEach((score, index) => {
      const domain = mapping[index];
      domainScores[domain] += score;
    });

    const bestDomain = Object.entries(domainScores).sort((a, b) => b[1] - a[1])[0][0];
    const career = careerMapping[bestDomain];

    setResult(career);
    saveResult(career);
  };

  return (
    <div className="domain-quiz-container">
      <h2>🎯 Career Counselling Quiz</h2>

      {result ? (
        <div className="result-box">
          <h3>Recommended Career Path:</h3>
          <h4>{result.title}</h4>
          <h5 className="roadmap-title">🛣️ Suggested Roadmap:</h5>
          <ul>
            {result.roadmap.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
          <button onClick={() => navigate('/career-roadmap')} className="view-roadmap-btn">View Full Roadmap & Courses</button>
        </div>
      ) : (
        <div className="question-box">
          <h4>{questions[current].scenario}</h4>
          <div className="career-options-container">
            {colorOptions.map((option) => (
              <button
                key={option.score}
                className="career-option-btn"
                style={{
                  backgroundColor:
                    scores[current] === option.score ? option.color : "#e0e0e0",
                  color: scores[current] === option.score ? "white" : "#333"
                }}
                onClick={() => handleSelect(option.score)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className="quiz-controls">
            {current < questions.length - 1 ? (
              <button className="next-btn" onClick={handleNext}>
                Next →
              </button>
            ) : (
              <button className="submit-btn" onClick={handleSubmit}>
                Submit ✅
              </button>
            )}
          </div>
          <p className="question-count">
            Question {current + 1} of {questions.length}
          </p>
        </div>
      )}
    </div>
  );
};

export default CareerCounsellingQuiz;
