import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { db } from "../../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import { Upload, Phone, MapPin, Calendar, Tag, FileText, CheckCircle, Loader2 } from "lucide-react";

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const uploadImage = async () => {
    if (!image) return null;
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "lost_found_unsigned");
    data.append("cloud_name", "dxzrvvsvq");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dxzrvvsvq/image/upload",
      { method: "POST", body: data }
    );

    if (!res.ok) throw new Error("Image upload failed");
    const result = await res.json();
    return result.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("User not logged in");

    if (!/^[0-9]{10}$/.test(form.phone)) {
      toast.error("Enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    try {
      let imageUrl = null;
      if (image) imageUrl = await uploadImage();

      await addDoc(collection(db, "foundItems"), {
        ...form,
        imageUrl: imageUrl || null,
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        createdAt: serverTimestamp(),
        type: "found"
      });

      toast.success("Found item report submitted!");

      setForm(initialState);
      setImage(null);
      setPreview(null);
      if (document.getElementById("found-image-input")) {
        document.getElementById("found-image-input").value = "";
      }
    } catch (err) {
      console.error("SAVE ERROR:", err);
      toast.error("Failed to submit report");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Item Title</label>
          <div className="relative group">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
            <input
              name="title"
              placeholder="What did you find?"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-slate-200 border rounded-xl outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all text-sm"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Category</label>
          <select
            name="category"
            className="w-full px-4 py-2.5 bg-slate-50 border-slate-200 border rounded-xl outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all text-sm appearance-none"
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
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Description</label>
        <div className="relative group">
          <FileText className="absolute left-3 top-3 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
          <textarea
            name="description"
            placeholder="Describe the item (color, unique features...)"
            rows="2"
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-slate-200 border rounded-xl outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all text-sm resize-none"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Date Found</label>
          <div className="relative group">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
            <input
              type="date"
              name="date"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-slate-200 border rounded-xl outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all text-sm"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Location</label>
          <div className="relative group">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
            <input
              name="locationText"
              placeholder="Where did you find it?"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-slate-200 border rounded-xl outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all text-sm"
              value={form.locationText}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Contact Number</label>
        <div className="relative group">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
          <input
            name="phone"
            placeholder="10-digit mobile number"
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-slate-200 border rounded-xl outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all text-sm"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Photo (Optional)</label>
        <div className="mt-1 flex items-center gap-4">
          <label className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-all text-sm font-semibold text-slate-600">
            <Upload size={16} />
            Choose File
            <input
              id="found-image-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
          {preview && (
            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
              <img src={preview} alt="preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full py-3 bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-100/50 hover:bg-green-700 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          <>
            <CheckCircle size={18} />
            Submit Found Report
          </>
        )}
      </button>
    </form>
  );
}
