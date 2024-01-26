// pages/api/register.js
import { connectToDatabase } from "../../utils/mongodb";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    // Hash รหัสผ่าน
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const { db } = await connectToDatabase();

    // สร้างข้อมูลผู้ใช้
    const user = { username, passwordHash };

    // เพิ่มข้อมูลผู้ใช้ลงใน MongoDB
    await db.collection("user").insertOne(user);

    return res.status(200).json({ message: "User registered successfully" });
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
