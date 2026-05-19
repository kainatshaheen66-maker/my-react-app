import { useState } from "react";

import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { db, storage } from "../firebase/firebase";

function AddItems() {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // INPUT
  const handleChange = (e) => {
    setProduct((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // IMAGE
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be under 5MB");
      return;
    }

    setImageFile(file);
  };

  // ADD PRODUCT
  const addProduct = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!product.name || !product.price || !product.description || !imageFile) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      // ✅ safe file name
      const fileName = `${Date.now()}-${imageFile.name}`;

      const imageRef = ref(storage, `products/${fileName}`);

      // ✅ upload image (THIS is correct Firebase method)
      const snapshot = await uploadBytes(imageRef, imageFile);

      // ✅ get download URL
      const imageURL = await getDownloadURL(snapshot.ref);

      // save to firestore
      await addDoc(collection(db, "products"), {
        name: product.name.trim(),
        price: Number(product.price),
        description: product.description.trim(),
        image: imageURL,
        createdAt: serverTimestamp(),
      });

      // reset form
      setProduct({ name: "", price: "", description: "" });
      setImageFile(null);

      alert("Item Uploaded Successfully ✅");

    } catch (error) {
      console.log("Upload error:", error);
      alert("Upload Failed ❌ Check Firebase rules / config");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-items-page">
      <div className="add-items-card">
        <h1>Add New Product</h1>

        <form onSubmit={addProduct}>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={product.name}
            onChange={handleChange}
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={product.price}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Product Description"
            value={product.description}
            onChange={handleChange}
          />

          {imageFile && (
            <img
              src={URL.createObjectURL(imageFile)}
              alt="preview"
              className="preview-image"
            />
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddItems;