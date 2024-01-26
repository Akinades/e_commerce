// pages/api/addProduct.js
import { connectToDatabase } from "../../utils/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { product_name, description, price, amount, image_path } = req.body;

    if (!product_name || !description || !price || !amount || !image_path) {
      return res.status(400).json({ error: "Product_name, description, price, amount, and image_path are required" });
    }

    const { db } = await connectToDatabase();

    const product = { product_name, description, price, amount, image_path };

    await db.collection("product").insertOne(product);

    return res.status(200).json({ message: "Product added successfully" });
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
