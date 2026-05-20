import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // 🔥 Prevent logged-in user from staying on login page
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.email === "admin@gmail.com") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }
    });

    return () => unsub();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      setMessage("🎉 Login Successful!");

      setEmail("");
      setPassword("");

      // 🔥 Immediate redirect (no delay issues)
      if (user.email === "admin@gmail.com") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }

    } catch (error) {
      setMessage("❌ " + error.message);

      setTimeout(() => {
        setMessage("");
      }, 3000);
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
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">
            Login
          </button>

        </form>

      </div>
    </div>
  );
}

export default Login;