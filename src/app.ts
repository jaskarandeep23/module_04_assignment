import express from "express"
import morgan from "morgan"

import loanRoutes from "./api/v1/routes/loanRoutes"
import adminRoutes from "./api/v1/routes/adminRoutes"
import userRoutes from "./api/v1/routes/userRoutes"
import errorHandler from "./api/v1/middleware/errorhandler"
import authRoutes from "./api/v1/routes/authRoutes";

const app = express()

app.use(express.json())
app.use(morgan("dev"))

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString()
  })
})

app.use("/api/v1/loans", loanRoutes)
app.use("/api/v1/admin", adminRoutes)
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/auth", authRoutes);

app.use(errorHandler)

export default app