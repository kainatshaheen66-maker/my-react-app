import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

export const placeOrder = async (cart, userId, totalPrice) => {
  try {
    await addDoc(collection(db, "orders"), {
      userId,

      // FULL CART (IMPORTANT)
      items: cart,

      // FIXED TOTAL
      total: totalPrice,

      // 🔥 MUST EXIST (USER + ADMIN SYNC)
      status: "Pending",

      createdAt: new Date()
    });

  } catch (error) {
    console.log("Order Error:", error);
  }
};