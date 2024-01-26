// pages/api/deleteProduct/[product_id].js
import { connectToDatabase } from "../../../utils/mongodb";

export default async function handler(req, res) {
  const { method } = req;

  if (method === "DELETE") {
    const { product_id } = req.query;

    const { db } = await connectToDatabase();

    try {
      const deleteResult = await db.collection("product").deleteOne({ _id: product_id });

      if (deleteResult.deletedCount === 1) {
        return res.status(200).json({ message: "Product deleted successfully" });
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
