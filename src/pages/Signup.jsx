import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  doc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";

import { auth, db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    setMessage("");
    setError(false);

    // 🔴 PASSWORD VALIDATION (NEW)
    if (!password) {
      setMessage("❌ Password is required");
      setError(true);
      return;
    }

    if (password.length < 6) {
      setMessage("❌ Password must be at least 6 characters");
      setError(true);
      return;
    }

    try {
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        displayName: user.email.split("@")[0],
        createdAt: serverTimestamp(),
      });

      await signOut(auth);

      setMessage("🎉 User successfully created");
      setError(false);

      setEmail("");
      setPassword("");

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);

    } catch (error) {
      console.log(error.code);

      if (error.code === "auth/email-already-in-use") {
        setMessage("❌ User already registered");
      } else {
        setMessage("❌ Something went wrong. Try again.");
      }

      setError(true);

      setTimeout(() => setMessage(""), 3000);
    }
  };



  return (
    <div className="auth-page">

      <div className="auth-card">

        {message && (
          <div
            className="auth-message"
            style={{
              color: error ? "red" : "green",
              fontWeight: "bold"
            }}
          >
            {message}
          </div>
        )}

        <h1 className="auth-title">
          Create Account ✨
        </h1>

        <p className="auth-subtitle">
          Join Glow Salt today
        </p>

        <form onSubmit={handleSignup} className="auth-form">

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* PASSWORD FIELD WITH EYE 👁️ */}
          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button type="submit">
            Signup
          </button>

        </form>

      </div>
    </div>
  );
}

export default Signup;