require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Config
mongoose.set("strictQuery", true);
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://dbuser:agnel@cluster0.ek7nz.mongodb.net/Career?retryWrites=true&w=majority";

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    console.warn("⚠️ Please verify MONGODB_URI and network access (IP whitelist).");
  });

// Schemas & Models
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

const feedbackSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
  },
  { timestamps: { createdAt: "createdAt" } }
);
const Feedback = mongoose.model("Feedback", feedbackSchema);

const quizHistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["career", "domain"], required: true },
    result: String,
    roadmap: [String],
    courses: [String],
  },
  { timestamps: { createdAt: "createdAt" } }
);
const QuizHistory = mongoose.model("QuizHistory", quizHistorySchema);

const domainQuizSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true },
    suggestedDomain: { type: String, required: true },
    roadmap: [String],
    courses: [String],
  },
  { timestamps: { createdAt: "createdAt" }, collection: "domainquizzes" }
);
const DomainQuiz = mongoose.model("DomainQuiz", domainQuizSchema);

const roadmapSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    steps: [{ title: String, description: String, order: Number }],
  },
  { timestamps: true }
);
const Roadmap = mongoose.model("Roadmap", roadmapSchema);

// Middleware: verify JWT
const verifyToken = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ success: false, message: "No token provided" });
    const token = auth.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, message: "No token provided" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token", error: err.message });
  }
};

// Basic request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - Auth: ${req.headers.authorization || "none"}`);
  next();
});

// Health
app.get("/", (req, res) => res.send("API is running"));

// Register (supports {name} or {username})
const registerHandler = async (req, res) => {
  try {
    const { username, name, email, password } = req.body;
    const userNameToUse = username || name;
    if (!userNameToUse || !email || !password) {
      return res.status(400).json({ success: false, message: "Username (or name), email and password are required" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(400).json({ success: false, message: "Email already registered" });

    const existingUser = await User.findOne({ username: userNameToUse });
    if (existingUser) return res.status(400).json({ success: false, message: "Username already taken" });

    const user = new User({ username: userNameToUse, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: { username: user.username, email: user.email, id: user._id },
    });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ success: false, message: "Registration failed", error: err.message });
  }
};

// Login
const loginHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    return res.json({ success: true, token, user: { username: user.username, email: user.email, id: user._id } });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Login failed", error: err.message });
  }
};

// Expose both /api/auth/* and short paths expected by frontend
app.post("/api/auth/register", registerHandler);
app.post("/api/auth/login", loginHandler);
app.post("/api/register", registerHandler);
app.post("/api/login", loginHandler);

// Get current user
app.get("/api/user", verifyToken, async (req, res) => {
  try {
    const user = req.user;
    res.json({ success: true, user: { id: user._id, username: user.username, email: user.email, createdAt: user.createdAt } });
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ success: false, message: "Error fetching user info", error: err.message });
  }
});

// Feedback
app.post("/api/feedback", verifyToken, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, message: "Feedback message is required" });

    const feedback = new Feedback({ userId: req.user._id, message });
    await feedback.save();

    res.status(201).json({ success: true, message: "Feedback submitted successfully", feedback: { message: feedback.message, createdAt: feedback.createdAt } });
  } catch (err) {
    console.error("Feedback submission error:", err);
    res.status(500).json({ success: false, message: "Error submitting feedback", error: err.message });
  }
});

app.get("/api/feedback", verifyToken, async (req, res) => {
  try {
    const feedback = await Feedback.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, feedback });
  } catch (err) {
    console.error("Feedback fetch error:", err);
    res.status(500).json({ success: false, message: "Error fetching feedback", error: err.message });
  }
});

// Save quiz results (accepts { type, title } or { type, result } + optional roadmap,courses)
app.post("/api/quiz", verifyToken, async (req, res) => {
  try {
    const { type, title, result, roadmap = [], courses = [] } = req.body;
    const quizTitle = title || result;
    if (!type || !quizTitle) return res.status(400).json({ success: false, message: "Type and title/result are required" });
    if (!["career", "domain"].includes(type)) return res.status(400).json({ success: false, message: 'Type must be "career" or "domain"' });

    let saved;
    if (type === "domain") {
      const domainQuiz = new DomainQuiz({
        userId: req.user._id,
        username: req.user.username,
        suggestedDomain: quizTitle,
        roadmap: Array.isArray(roadmap) ? roadmap : [],
        courses: Array.isArray(courses) ? courses : [],
      });
      saved = await domainQuiz.save();
    } else {
      const quiz = new QuizHistory({
        userId: req.user._id,
        type,
        result: quizTitle,
        roadmap: Array.isArray(roadmap) ? roadmap : [],
        courses: Array.isArray(courses) ? courses : [],
      });
      saved = await quiz.save();
    }

    res.status(201).json({ success: true, message: `${type} quiz result saved successfully`, quizResult: saved });
  } catch (err) {
    console.error("Save quiz error:", err);
    res.status(500).json({ success: false, message: "Server error while saving quiz", error: err.message });
  }
});

app.get("/api/quiz", verifyToken, async (req, res) => {
  try {
    const { type } = req.query;
    if (type === "domain") {
      const history = await DomainQuiz.find({ userId: req.user._id }).sort({ createdAt: -1 });
      return res.json({ success: true, history });
    } else {
      const history = await QuizHistory.find({ userId: req.user._id }).sort({ createdAt: -1 });
      return res.json({ success: true, history });
    }
  } catch (err) {
    console.error("Fetch quiz history error:", err);
    res.status(500).json({ success: false, message: "Error fetching quiz history", error: err.message });
  }
});

// Roadmaps: combine career (QuizHistory type=career) and domain (DomainQuiz)
app.get("/api/roadmaps", verifyToken, async (req, res) => {
  try {
    const careerRoadmaps = await QuizHistory.find({ userId: req.user._id, type: "career" }).sort({ createdAt: -1 });
    const domainRoadmaps = await DomainQuiz.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, careerRoadmaps, domainRoadmaps });
  } catch (err) {
    console.error("Fetch roadmaps error:", err);
    res.status(500).json({ success: false, message: "Error fetching roadmaps", error: err.message });
  }
});

// Optional: save a custom roadmap (protected)
app.post("/api/roadmaps", verifyToken, async (req, res) => {
  try {
    const { title, description, steps = [] } = req.body;
    if (!title || !description) return res.status(400).json({ success: false, message: "Title and description are required" });
    const roadmap = new Roadmap({ userId: req.user._id, title, description, steps });
    const saved = await roadmap.save();
    res.status(201).json({ success: true, roadmap: saved });
  } catch (err) {
    console.error("Save roadmap error:", err);
    res.status(500).json({ success: false, message: "Error saving roadmap", error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});