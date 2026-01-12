import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { db } from "../../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";
export default function FoundForm() {
  const { user } = useContext(AuthContext);

  const initialState = {
    title: "",
    category: "",
    description: "",
    date: "",
    locationText: "",
    phone: "",
  };

  const [form, setForm] = useState(initialState);
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

    if (!res.ok) throw new Error("Image upload failed");

    const result = await res.json();
    return result.secure_url;
  };

  // -----------------------------
  // SUBMIT
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("User not logged in");
      return;
    }

    // 📞 PHONE VALIDATION
    if (!/^[0-9]{10}$/.test(form.phone)) {
      alert("Enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = null;
      if (image) imageUrl = await uploadImage();

      await addDoc(collection(db, "foundItems"), {
        ...form,                 // ✅ phone included
        imageUrl: imageUrl || null,
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        createdAt: serverTimestamp(),
      });

      toast.success("Found item saved successfully");

      // RESET FORM
      setForm(initialState);
      setImage(null);
      setPreview(null);
      document.getElementById("found-image-input").value = "";
    } catch (err) {
      console.error("SAVE ERROR:", err);
      toast.error("Failed to save found item");

    }

    setLoading(false);
  };

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
        <option>Other</option>
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
        placeholder="Found location"
        value={form.locationText}
        onChange={handleChange}
        required
      />

      {/* 📞 PHONE */}
      <input
        name="phone"
        placeholder="Contact Mobile Number"
        value={form.phone}
        onChange={handleChange}
        required
      />

      {/* 📷 IMAGE */}
      <input
        id="found-image-input"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />

      {preview && (
        <img
          src={preview}
          alt="preview"
          style={{
            width: "100%",
            maxHeight: 200,
            objectFit: "cover",
            marginTop: 10,
            borderRadius: 8,
          }}
        />
      )}

      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit Found Item"}
      </button>
    </form>
  );
}
