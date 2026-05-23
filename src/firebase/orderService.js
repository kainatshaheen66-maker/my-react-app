import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

export const placeOrder = async (cart, userId, totalPrice) => {
  try {
    const safeItems = cart.map(item => ({
      id: item.id,
      title: item.title,
      price: item.price,
      qty: item.qty,
      image: item.image || ""   // 🔥 IMPORTANT FIX
    }));

    await addDoc(collection(db, "orders"), {
      userId,
      items: safeItems,
      total: totalPrice,
      status: "Pending",
      createdAt: new Date()
    });

  } catch (error) {
    console.log("Order Error:", error);
  }
};