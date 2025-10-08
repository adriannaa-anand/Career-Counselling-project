import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const domainQuestions = [
  { id: 1, question: "I enjoy designing websites and seeing them come to life in the browser." },
  { id: 2, question: "Working with data, charts, and finding patterns fascinates me." },
  { id: 3, question: "Understanding security, hacking, and protecting systems interests me." },
  { id: 4, question: "I like creating visual designs and improving how users interact with digital products." },
  { id: 5, question: "I am curious about how machines can learn and make decisions like humans." }
];

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

const mapping = ["A", "B", "C", "D", "E"]; 

const scaleOptions = [
  { score: 1, label: "Strongly Disagree", color: "#f44336" },
  { score: 2, label: "Disagree", color: "#ff9800" },
  { score: 3, label: "Neutral", color: "#ffc107" },
  { score: 4, label: "Agree", color: "#8bc34a" },
  { score: 5, label: "Strongly Agree", color: "#4caf50" }
];

const domainMapping = {
  A: {
    title: "Web Development",
    roadmap: [
      "Learn HTML, CSS, JavaScript",
      "Build responsive websites",
      "Learn React or Vue",
      "Explore backend with Node.js or Django",
      "Deploy full-stack apps",
      "Apply for internships"
    ]
  },
  B: {
    title: "Data Science / Analytics",
    roadmap: [
      "Learn Python and R",
      "Understand statistics",
      "Master data visualization tools",
      "Practice machine learning",
      "Contribute to Kaggle competitions",
      "Apply for analyst roles"
    ]
  },
  C: {
    title: "Cybersecurity",
    roadmap: [
      "Study networking basics",
      "Learn about ethical hacking",
      "Join CTFs and labs",
      "Get certified (e.g., CEH)",
      "Build a security portfolio",
      "Apply for security jobs"
    ]
  },
  D: {
    title: "UI/UX Design",
    roadmap: [
      "Study design principles",
      "Learn Figma or Adobe XD",
      "Create wireframes and prototypes",
      "Build case studies",
      "Get feedback from mentors",
      "Apply for design internships"
    ]
  },
  E: {
    title: "AI / Machine Learning",
    roadmap: [
      "Master Python and libraries (NumPy, pandas)",
      "Learn math (Linear Algebra, Probability)",
      "Study ML algorithms",
      "Build real-world AI apps",
      "Work with datasets",
      "Apply for ML engineer roles"
    ]
  }
};

const DomainPreferenceQuiz = () => {
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
      const quizData = {
        type: "domain",
        title: result.title,
        level: "intermediate",
        roadmap: result.roadmap,
        courses: onlineCourses[result.title],
        timestamp: new Date().toISOString()
      };

      console.log("Attempting to save quiz data:", quizData);
      console.log("Using token:", token.substring(0, 20) + "...");

      const res = await fetch("http://localhost:3001/api/quiz", {  
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(quizData),
      });

      const responseData = await res.json();
      console.log("Server response:", { status: res.status, data: responseData });

      if (!res.ok) {
        throw new Error(responseData.details || responseData.message || "Failed to save quiz result");
      }

      console.log("Quiz saved successfully!");
      navigate("/domain-roadmap");
    } catch (err) {
      console.error("Detailed error:", {
        message: err.message,
        stack: err.stack
      });
      alert(`Failed to save quiz result: ${err.message}`);
    }
  };

  const handleSubmit = () => {
    if (!scores[current]) {
      alert("Please select an option.");
      return;
    }

    const bucket = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    scores.forEach((score, index) => {
      const category = mapping[index];
      bucket[category] += score;
    });

    const topCategory = Object.keys(bucket).reduce((a, b) =>
      bucket[a] > bucket[b] ? a : b
    );

    const domain = domainMapping[topCategory];
    console.log("Selected domain:", domain); // Debug log
    setResult(domain); // Display result on the quiz page
    saveResult(domain);
  };

  return (
    <div className="domain-quiz-container">
      <h2>🚀 Discover Your Ideal IT Domain</h2>

      {result ? (
        <div className="result-box">
          <h3>Your best-suited domain is:</h3>
          <h4 className="domain-title">{result.title}</h4>
          <h5 className="roadmap-title">🛣️ Suggested Roadmap:</h5>
          <ul className="roadmap-list">
            {result.roadmap.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
          <button onClick={() => navigate('/domain-roadmap')} className="view-roadmap-btn">View Full Roadmap & Courses</button>
        </div>
      ) : (
        <div className="question-box">
          <h4>{domainQuestions[current].question}</h4>
          <div className="options-container">
            {scaleOptions.map((option) => (
              <button
                key={option.score}
                className="option-btn"
                style={{
                  backgroundColor: scores[current] === option.score ? option.color : "#e0e0e0",
                  color: scores[current] === option.score ? "white" : "#333"
                }}
                onClick={() => handleSelect(option.score)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className="quiz-controls">
            {current < domainQuestions.length - 1 ? (
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
            Question {current + 1} of {domainQuestions.length}
          </p>
        </div>
      )}
    </div>
  );
};

export default DomainPreferenceQuiz;
