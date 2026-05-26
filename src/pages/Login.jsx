import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user?.email === "admin@gmail.com") {
        navigate("/admin", { replace: true });
      } else if (user) {
        navigate("/", { replace: true });
      }
    });

    return () => unsub();
  }, [navigate]);



  const handleLogin = async (e) => {
    e.preventDefault();

    setEmailError(false);
    setPasswordError(false);
    setMessage("");

    const cleanEmail = email.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!cleanEmail) {
      setEmailError(true);
      setMessage("❌ Email is required");
      return;
    }

    if (!emailRegex.test(cleanEmail)) {
      setEmailError(true);
      setMessage("❌ Incorrect email");
      return;
    }

    if (!password) {
      setPasswordError(true);
      setMessage("❌ Password is required");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        cleanEmail,
        password
      );

      const user = userCredential.user;

      setMessage("🎉 Login Successful!");

      setEmail("");
      setPassword("");

      setTimeout(() => {
        if (user.email === "admin@gmail.com") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }, 800);

    } catch (error) {

      if (error.code === "auth/user-not-found") {
        setEmailError(true);
        setMessage("❌ Account not found");
      } else {
        setPasswordError(true);
        setMessage("❌ Incorrect password");
      }

      setTimeout(() => setMessage(""), 3000);
    }
  };



  return (
    <div className="auth-page">

      <div className="auth-card">

        {message && (
          <div className="auth-message">
            {message}
          </div>
        )}

        <h1 className="auth-title">
          Welcome Back 👋
        </h1>

        <p className="auth-subtitle">
          Login to continue shopping
        </p>

        <form onSubmit={handleLogin} className="auth-form">

          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(false);
            }}
            className={emailError ? "error-input" : ""}
          />

          {/* PASSWORD FIELD WITH EYE 👁️ INSIDE */}
          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(false);
              }}
              className={passwordError ? "error-input" : ""}
            />

            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button type="submit">
            Login
          </button>

        </form>

      </div>
    </div>
  );
}

export default Login;