const mongoose = require("mongoose");
const { MONGO_URI } = require("./config");

// ── Schemas ───────────────────────────────────────────────────────────────────

const userSchema = new mongoose.Schema(
  {
    userId: { type: Number, required: true, unique: true, index: true },
    username: String,
    firstName: String,
    lastName: String,
    lastSeen: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const approvalSchema = new mongoose.Schema(
  {
    chatId: { type: Number, required: true },
    chatTitle: String,
    userId: { type: Number, required: true },
    approvedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
const Approval = mongoose.model("Approval", approvalSchema);

// ── Connection ────────────────────────────────────────────────────────────────

async function connect() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("[db] Connected to MongoDB");
  } catch (err) {
    console.error("[db] Connection failed:", err.message);
    process.exit(1);
  }
}

mongoose.connection.on("disconnected", () =>
  console.warn("[db] MongoDB disconnected")
);
mongoose.connection.on("reconnected", () =>
  console.info("[db] MongoDB reconnected")
);

// ── Helpers ───────────────────────────────────────────────────────────────────

async function upsertUser({ id, username, first_name, last_name }) {
  try {
    await User.findOneAndUpdate(
      { userId: id },
      {
        username,
        firstName: first_name,
        lastName: last_name,
        lastSeen: new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  } catch (err) {
    console.error("[db] upsertUser error:", err.message);
  }
}

async function logApproval(chatId, chatTitle, userId) {
  try {
    await Approval.create({ chatId, chatTitle, userId });
  } catch (err) {
    console.error("[db] logApproval error:", err.message);
  }
}

async function totalUsers() {
  return User.countDocuments();
}

async function totalApprovals() {
  return Approval.countDocuments();
}

module.exports = { connect, upsertUser, logApproval, totalUsers, totalApprovals };
