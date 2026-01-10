import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { db } from "../../firebase/firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";

/* ================================
   CLOUDINARY IMAGE UPLOAD FUNCTION
   ================================ */
const uploadImageToCloudinary = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "lost_found_unsigned");
  data.append("cloud_name", "dxzrvvsvq"); // 🔴 replace

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dxzrvvsvq/image/upload",
    {
      method: "POST",
      body: data,
    }
  );

  const result = await res.json();
  return result.secure_url;
};

export default function FoundForm() {
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    locationText: "",
    date: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";

      if (image) {
        imageUrl = await uploadImageToCloudinary(image);
      }

      await addDoc(collection(db, "foundItems"), {
        ...form,
        imageUrl,
        userId: user.uid,
        createdAt: Timestamp.now(),
      });

      alert("Found Item saved successfully ✅");

      setForm({
        title: "",
        category: "",
        description: "",
        locationText: "",
        date: "",
      });
      setImage(null);
      setPreview(null);
    } catch (error) {
      console.error(error);
      alert("Something went wrong ❌");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Report Found Item</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="title"
          placeholder="Item Title"
          className="w-full border p-2"
          value={form.title}
          onChange={handleChange}
          required
        />

        <select
          name="category"
          className="w-full border p-2"
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
          className="w-full border p-2"
          value={form.description}
          onChange={handleChange}
          required
        />

        <input
          name="locationText"
          placeholder="Found at (e.g. Library, Canteen)"
          className="w-full border p-2"
          value={form.locationText}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="date"
          className="w-full border p-2"
          value={form.date}
          onChange={handleChange}
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
        />

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="h-28 object-cover rounded"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          {loading ? "Saving..." : "Submit Found Item"}
        </button>
      </form>
    </div>
  );
}
