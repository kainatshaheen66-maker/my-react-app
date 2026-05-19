import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

export const saveCartItem = async (item, userId) => {
  await addDoc(collection(db, "carts"), {
    ...item,
    userId,
    createdAt: new Date()
  });
};