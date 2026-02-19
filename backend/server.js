require("dotenv").config();
const connectDB = require("./config/db");
connectDB();

// const OpenAI = require("openai");
// //It connects your backend to OpenAI.
// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });


const axios = require("axios");
const bcrypt = require("bcryptjs");

const express = require("express");
const cors = require("cors");
const User = require("./models/User");

const authRoutes = require("./routes/authRoutes");
const verifyToken = require("./middleware/verifyToken");
const authorizeRole = require("./middleware/authorizeRole");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());  //cors() allows frontend and backend to communicate.
app.use(express.json()); //This middleware lets Express read JSON data from the request body.

app.use("/", authRoutes);  //“Use all routes defined inside authRoutes starting from /.”

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/dashboard", verifyToken, (req, res) => {
  res.json({ message: "Dashboard", user: req.user });
});

app.get("/admin", verifyToken, authorizeRole("admin"), (req, res) => {
  res.json({ message: "Admin panel" });
});

app.delete(
  "/users",
  verifyToken,
  authorizeRole("admin"),
  (req, res) => {
    res.json({ message: "All users deleted (demo)" });
  }
);

app.get(
  "/users",
  verifyToken,
  authorizeRole("admin"),
  async (req, res, next) => {
    try {
      const users = await User.find().select("-password");  //“Return everything except the password field.”

      res.json(users);  //This sends the users list to the frontend as JSON.
    } catch (err) {
      next(err);
    }
  }
);

app.delete(
  "/users/:id",
  verifyToken,
  authorizeRole("admin"),   //ensures that only users with the "admin" role can access the route.
  async (req, res, next) => {
    try {
      const { id } = req.params;  //req.params contains dynamic values from the URL path, like IDs in /users/:id.

      await User.findByIdAndDelete(id);

      res.json({ message: "User deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
);

app.post("/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.put(
  "/users/:id",
  verifyToken,
  authorizeRole("admin"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { role },
        { new: true }
      ).select("-password");

      res.json(updatedUser);
    } catch (err) {
      next(err);
    }
  }
);

// app.post("/ai-insight", verifyToken, async (req, res) => {
//   try {
//     const { users } = req.body;

//     const summary = users    //This converts the array into a string.
//       .map(u => `${u.email} (${u.role})`)
//       .join(", ");
//     //This sends a request to the AI model. chat=>
//     const completion = await client.chat.completions.create({
//       model: "gpt-4.1-mini",
//       messages: [
//         {
//           role: "system",
//           content: "You are a dashboard analytics assistant."
//         },
//         {
//           role: "user",
//           content: `Analyze these users and roles: ${summary}`
//         }
//       ],
//     });
//     console.log(completion);
//     //choices is an array of AI responses.
//     res.json({
//       insight: completion.choices[0].message.content
//     });
 
//   } catch (err) {
//     //This logs the error object to the terminal where your Node.js server is running.
//     console.error(err);          
//     res.status(500).json({ message: "AI error" });
//   }
// });




// app.post("/ai-insight", verifyToken, async (req, res) => {
//   console.log("AI INSIGHT ROUTE HIT");
//    try {
//   console.log("AI route called");
//   const { users } = req.body;
//   //This converts the roles array into text.
//   const rolesSummary = users.map(u => u.role).join(", ");

//   console.log("Roles:", rolesSummary);
//     console.log("API KEY:", process.env.HF_API_KEY ? "Loaded" : "Missing");

//   // try {
//     const response = await axios.post(
//   "https://router.huggingface.co/hf-inference/models/distilbert-base-uncased",
//   {
//     inputs: `Dashboard roles: ${rolesSummary}`,
//   },
//   {
//     headers: {
//       Authorization: `Bearer ${process.env.HF_API_KEY}`,
//     },
//   }
// );

// res.json({
//   insight: `AI Summary: ${rolesSummary}`,
// });

//   } catch (err) {
//   console.log("HF ERROR:", err.response?.data || err.message);
//   res.json({
//     insight: "AI insight unavailable",
//   });
//   }
// });



// app.post("/ai-insight", verifyToken, async (req, res) => {
//   try {
//     const { users } = req.body;

//     const rolesSummary = users.map(u => u.role).join(", ");

//     const response = await axios.post(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         contents: [
//           {
//             role: "user",
//             parts: [
//               {
//                 text: `Give a short dashboard insight about these user roles: ${rolesSummary}`,
//               },
//             ],
//           },
//         ],
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const insight =
//       response.data.candidates[0].content.parts[0].text;

//     res.json({ insight });

//   } catch (err) {
//     console.log("GEMINI ERROR:", err.response?.data || err.message);
//     res.json({ insight: "AI insight unavailable" });
//   }
// });

app.post("/ai-insight", verifyToken, async (req, res) => {
  try {
    const { users } = req.body;

    const adminCount = users.filter(u => u.role === "admin").length;
    const managerCount = users.filter(u => u.role === "manager").length;
    const userCount = users.filter(u => u.role === "user").length;

    let insight = "System usage looks normal.";

    if (adminCount > 1) {
      insight = "Multiple admin accounts detected. Consider limiting admin access.";
    } else if (userCount > adminCount) {
      insight = "Most accounts are standard users.";
    }

    if (managerCount > 0) {
      insight += " Manager roles are active.";
    }

    res.json({ insight });

  } catch (err) {
    res.json({ insight: "AI insight unavailable" });
  }
});


app.post("/chat", verifyToken ,async (req,res) => {
  const {message} = req.body;
  console.log("Chat route hit:", message);
  let reply = "I am your dashboard assistant";

  if(message.toLowerCase().includes("users")){
    const count = await User.countDocuments({role : "user"});
    reply = `There are ${count} users in the system`;
  }

  if(message.toLowerCase().includes("admin")){
    const admins = await User.countDocuments({role : "admin"});
    reply = `There are ${admins} admin users`;
  }

  res.json({reply});
});


app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running");
});
