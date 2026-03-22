import { useState } from "react";
import { auth } from "../../firebase/firebaseConfig";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff, Mail, Lock, LogIn, UserPlus, Globe, Loader2 } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  // -----------------------------
  // EMAIL LOGIN / SIGNUP
  // -----------------------------
  const handleEmailAuth = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      if (isSignup) {
        // 🔹 SIGNUP
        const res = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        await sendEmailVerification(res.user);

        toast.success(
          "Verification email sent 📩 Please verify before login"
        );

        setIsSignup(false);
      } else {
        // 🔹 LOGIN
        const res = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        // ❌ BLOCK IF EMAIL NOT VERIFIED
        if (!res.user.emailVerified) {
          toast.error("Please verify your email first ❌");
          return;
        }

        toast.success("Login successful ✅");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error.message);
    }

    setLoading(false);
  };

  // -----------------------------
  // GOOGLE LOGIN
  // -----------------------------
  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);

      // ✅ Google users are already verified
      toast.success("Login successful ✅");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    }

    setLoading(false);
  };

  // -----------------------------
  // PASSWORD RESET
  // -----------------------------
  const handleResetPassword = async () => {
    if (!email) {
      toast.error("Enter your email first");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent 📩");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl overflow-hidden">
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center p-3 bg-primary rounded-2xl text-white shadow-lg mb-4">
                {isSignup ? <UserPlus size={28} /> : <LogIn size={28} />}
              </div>
              <h1 className="text-3xl font-bold font-serif text-slate-800 tracking-tight">
                {isSignup ? "Create Account" : "Welcome Back"}
              </h1>
              <p className="text-slate-500 mt-2 font-medium">
                {isSignup
                  ? "Verify email to activate account"
                  : "Sign in to your account"}
              </p>
            </div>

            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white border border-slate-200 text-slate-700 font-semibold rounded-2xl hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <Globe className="text-blue-500" size={20} />
              Continue with Google
            </button>

            <div className="relative my-8 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <span className="relative px-4 bg-transparent text-slate-400 text-sm font-medium">or continue with email</span>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailAuth} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-slate-200 border rounded-2xl outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-slate-800 placeholder:text-slate-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-sm font-semibold text-slate-700">Password</label>
                  {!isSignup && (
                    <button
                      type="button"
                      onClick={handleResetPassword}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border-slate-200 border rounded-2xl outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-slate-800 placeholder:text-slate-400"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-hover active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    {isSignup ? "Create Account" : "Sign In"}
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center pt-6 border-t border-slate-100 flex flex-col gap-2">
              <p className="text-slate-500 text-sm font-medium">
                {isSignup ? "Already have an account?" : "Don't have an account?"}
                <button
                  type="button"
                  className="ml-2 text-primary font-bold hover:underline"
                  onClick={() => setIsSignup(!isSignup)}
                >
                  {isSignup ? "Login here" : "Sign up for free"}
                </button>
              </p>
            </div>
          </div>
        </div>
        
        {/* Attribution/Footer */}
        <p className="text-center mt-8 text-slate-400 text-xs font-medium">
          &copy; {new Date().getFullYear()} Lost & Found Community. All rights reserved.
        </p>
      </div>
    </div>
  );
}
