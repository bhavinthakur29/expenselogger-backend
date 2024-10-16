require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: "*", // Allow all origins (only for testing; restrict later in production)
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow the necessary HTTP methods
};

// Middleware
app.use(cors(corsOptions));
// app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Create Expense schema
const expenseSchema = new mongoose.Schema({
  item: String,
  amount: Number,
  date: { type: Date, default: Date.now },
});

// Create Expense model
const Expense = mongoose.model("Expense", expenseSchema);

// GET latest 5 expenses
app.get("/api/expenses/latest", async (req, res) => {
  try {
    const latestExpenses = await Expense.find().sort({ date: -1 }).limit(5);
    res.json(latestExpenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all expenses
app.get("/api/expenses", async (req, res) => {
  try {
    const sortedExpenses = await Expense.find().sort({ date: -1 });
    res.json(sortedExpenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new expense
app.post("/api/expenses", async (req, res) => {
  const newExpense = new Expense({
    item: req.body.item,
    amount: req.body.amount,
  });

  try {
    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
