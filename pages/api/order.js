// pages/api/order.js
import { connectToDatabase } from "../../utils/mongodb";
import { v4 as uuidv4 } from 'uuid'; // นำเข้าฟังก์ชันสร้าง UUID

export default async function handler(req, res) {
  const { method } = req;

  if (method === "POST") {
    const { user_id, products } = req.body;

    if (!user_id || !products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    const { db } = await connectToDatabase();

    try {
      const order_id = uuidv4(); // สร้าง UUID เพื่อให้เป็นหมายเลข order ที่ไม่ซ้ำกัน

      // สร้างข้อมูลการสั่งซื้อ
      const order = {
        order_id,
        user_id,
        products: products.map(product => ({
          product_name: product.product_name,
          quantity: product.quantity || 1,
        })),
        order_date: new Date(),
      };

      // บันทึกข้อมูลการสั่งซื้อลงใน MongoDB
      const result = await db.collection("orders").insertOne(order);

      if (result.insertedCount === 1) {
        return res.status(200).json({ message: "Order placed successfully", order_id });
      } else {
        return res.status(500).json({ error: "Failed to place order" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
