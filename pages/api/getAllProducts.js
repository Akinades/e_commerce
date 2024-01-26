// pages/api/getAllProducts.js
import { connectToDatabase } from "../../utils/mongodb";

export default async function handler(req, res) {
  const { method } = req;

  if (method === "GET") {
    const { db } = await connectToDatabase();

    try {
      const products = await db.collection("product").find({}).toArray();

      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
