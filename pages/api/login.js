// pages/api/login.js
import { connectToDatabase } from "../../utils/mongodb";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const { db } = await connectToDatabase();

    // ค้นหาข้อมูลผู้ใช้ใน MongoDB
    const user = await db.collection("user").findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // ตรวจสอบรหัสผ่าน
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // สร้าง JSON Web Token (JWT)
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // ตั้งเวลาหมดอายุของ token
    });

    return res.status(200).json({ token, message: "Login successful" });
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
