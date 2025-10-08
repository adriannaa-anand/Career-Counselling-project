My Career Guide – Digital Career & Domain Counselling Platform

This project is something I built to help students like me figure out the right career path and technical domain based on their interests, skills, and goals. It’s a web-based platform that gives personalized guidance through quizzes, detailed roadmaps, and course recommendations.

I wanted to make career counselling more accessible and smart — so I built this using the MERN Stack (MongoDB, Express.js, React.js, Node.js) and integrated features like authentication, quiz history tracking, and feedback submission.

Features:-

Career Quiz – Suggests the most suitable career path based on user choices.

Domain Quiz – Helps students, especially in IT, find their ideal specialization.

Personalized Roadmap – Step-by-step plan for skill development and learning.

Course Recommendations – Curated learning resources to match your career goals.

User Login & Register – Secure authentication using JWT.

Quiz History – Keeps track of past quiz attempts and suggestions.

Feedback Section – Lets users share their thoughts and suggestions easily.

   Tech Stack
Part	Technology
Frontend	React.js, HTML, CSS
Backend	Node.js, Express.js
Database	MongoDB Atlas
Authentication	JSON Web Token (JWT)
Hosting	Vercel (Frontend) & Render (Backend)
⚙️ How to Run
1️)Clone the Repository
git clone https://github.com/yourusername/my-career-guide.git
cd my-career-guide

2️)Install Dependencies
cd backend
npm install

cd ../frontend
npm install

3) Add Environment Variables

In your backend folder, create a .env file:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000

4️) Run the App
Start the backend
cd backend
npm start

Start the frontend
cd frontend
npm start


Your app should now be running at  http://localhost:3000/

Folder Overview
my-career-guide/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── app.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.js
│
└── README.md

What’s Next

Add AI-based quiz generation for smarter and more dynamic questions.

Integrate a resume builder and career insights dashboard.

 Include video mentorship sessions for personalized guidance.

 Make a mobile version with offline quiz support.

   About

This project is part of my journey in full-stack development.
I built it to combine my interest in tech + career guidance, and to help students discover what they’re truly meant to do.

👩‍💻 Developed by: Adriannaa Anand
📅 Year: 2025
