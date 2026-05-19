import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";

function Signup() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {

      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      setMessage("🎉 Account Created Successfully!");

      setEmail("");
      setPassword("");

      setTimeout(() => {
        setMessage("");
      }, 3000);

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

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">
            Signup
          </button>

        </form>

      </div>
    </div>
  );
}

export default Signup;