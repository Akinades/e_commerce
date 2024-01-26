// pages/api/getProduct/[product_id].js
import { connectToDatabase } from "../../../utils/mongodb";

export default async function handler(req, res) {
  const { method } = req;
  const { product_id } = req.query;

  if (method === "GET") {
    if (!product_id) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const { db } = await connectToDatabase();

    try {
      const product = await db.collection("product").findOne({ _id: product_id });

      if (product) {
        return res.status(200).json(product);
      } else {
        return res.status(404).json({ error: "Product not found" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
