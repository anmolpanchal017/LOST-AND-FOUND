import "./LostForm.css";
import { useState } from "react";

export default function LostForm() {
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    date: "",
    locationText: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Lost Item:", form, image);
    alert("Lost Item Submitted (UI test)");
  };

  return (
    <form className="lost-form" onSubmit={handleSubmit}>
      <input
        name="title"
        placeholder="Item Title"
        className="form-input"
        onChange={handleChange}
        required
      />

      <select
        name="category"
        className="form-input"
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
        className="form-textarea"
        onChange={handleChange}
        required
      />

      <input
        type="date"
        name="date"
        className="form-input"
        onChange={handleChange}
        required
      />

      <input
        name="locationText"
        placeholder="Last seen location"
        className="form-input"
        onChange={handleChange}
        required
      />

      <div className="image-upload">
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {preview && (
          <img src={preview} alt="preview" className="image-preview" />
        )}
      </div>

      <button type="submit" className="form-btn">
        Submit Lost Item
      </button>
    </form>
  );
}
