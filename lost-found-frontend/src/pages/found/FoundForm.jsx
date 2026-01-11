import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { db } from "../../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function FoundForm() {
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    date: "",
    locationText: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // -----------------------------
  // INPUT CHANGE
  // -----------------------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // -----------------------------
  // IMAGE SELECT
  // -----------------------------
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // -----------------------------
  // CLOUDINARY UPLOAD
  // -----------------------------
  const uploadImage = async () => {
  if (!image) return null;

  const data = new FormData();
  data.append("file", image);
  data.append("upload_preset", "lost_found_unsigned");
  data.append("cloud_name", "dxzrvvsvq");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dxzrvvsvq/image/upload",
    {
      method: "POST",
      body: data,
    }
  );

  if (!res.ok) {
    throw new Error("Cloudinary upload failed");
  }

  const result = await res.json();
  return result.secure_url;
};

  // -----------------------------
  // SUBMIT FORM
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = null;

      if (image) {
        imageUrl = await uploadImage();
      }

      const payload = {
        ...form,
        userId: user.uid,
        createdAt: serverTimestamp(),
      };

      // ❗ undefined kabhi Firestore me nahi jayega
      if (imageUrl) {
        payload.imageUrl = imageUrl;
      }

      await addDoc(collection(db, "foundItems"), payload);

      alert("Found item saved successfully ✅");

      setForm({
        title: "",
        category: "",
        description: "",
        date: "",
        locationText: "",
      });
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error("SAVE ERROR:", err);
      alert("Failed to save found item ❌");
    }

    setLoading(false);
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <form onSubmit={handleSubmit}>
      <input
        name="title"
        placeholder="Item Title"
        value={form.title}
        onChange={handleChange}
        required
      />

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        required
      >
        <option value="">Select Category</option>
        <option>Wallet</option>
        <option>Phone</option>
        <option>ID Card</option>
        <option>Bag</option>
      </select>

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        required
      />

      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        required
      />

      <input
        name="locationText"
        placeholder="Last seen location"
        value={form.locationText}
        onChange={handleChange}
      />

      {/* IMAGE INPUT */}
      <input type="file" accept="image/*" onChange={handleImageChange} />

      {/* IMAGE PREVIEW */}
      {preview && (
        <img
          src={preview}
          alt="preview"
          style={{
            width: "100%",
            maxHeight: 200,
            objectFit: "cover",
            borderRadius: 10,
            marginTop: 10,
          }}
        />
      )}

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Submit Found Item"}
      </button>
    </form>
  );
}
