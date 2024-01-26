// pages/api/editProduct/[product_id].js
import { connectToDatabase } from "../../../utils/mongodb";

export default async function handler(req, res) {
  const { method } = req;

  if (method === "PUT" || method === "PATCH") {
    const { product_id } = req.query;
    const { product_name, description, price, amount, image_path } = req.body;

    if (!product_name || !description || !price || !amount || !image_path) {
      return res.status(400).json({ error: "Product_name, description, price, amount, and image_path are required" });
    }

    const { db } = await connectToDatabase();

    try {
      const updateResult = await db.collection("product").updateOne(
        { _id: product_id },
        {
          $set: {
            product_name,
            description,
            price,
            amount,
            image_path,
          },
        }
      );

      if (updateResult.matchedCount === 1) {
        return res.status(200).json({ message: "Product updated successfully" });
      } else {
        return res.status(404).json({ error: updateResult });
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
