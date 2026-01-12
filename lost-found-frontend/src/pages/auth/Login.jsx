import { useState } from "react";
import "./Login.css";
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
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">
          {isSignup ? "Create Account" : "Welcome"}
        </h1>

        <p className="login-subtitle">
          {isSignup
            ? "Verify email to activate account"
            : "Sign in to your account"}
        </p>

        {/* GOOGLE LOGIN */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="google-btn"
        >
          <span className="google-icon">G</span>
          Continue with Google
        </button>

        <div className="divider">
          <span>or</span>
        </div>

        {/* EMAIL FORM */}
        <form onSubmit={handleEmailAuth} className="login-form">
          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="login-btn"
          >
            {loading
              ? "Please wait..."
              : isSignup
              ? "Sign up"
              : "Login"}
          </button>
        </form>

        {/* FOOTER */}
        {!isSignup && (
          <p className="footer-text">
            Forgot password?{" "}
            <span className="link" onClick={handleResetPassword}>
              Reset here
            </span>
          </p>
        )}

        <p className="footer-text">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <span
                className="link"
                onClick={() => setIsSignup(false)}
              >
                Login
              </span>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <span
                className="link"
                onClick={() => setIsSignup(true)}
              >
                Sign up
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
