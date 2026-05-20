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
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      // create auth user
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user = userCredential.user;

      // 🔥 save user in firestore
      await setDoc(
        doc(db, "users", user.uid),
        {
          email: user.email,
          displayName: user.email.split("@")[0],
          createdAt: serverTimestamp(),
        }
      );

      // stop auto login
      await signOut(auth);

      setMessage(
        "🎉 Account Created Successfully! Redirecting..."
      );

      setEmail("");
      setPassword("");

      setTimeout(() => {
        navigate("/login", {
          replace: true,
        });
      }, 2000);

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

        <form
          onSubmit={handleSignup}
          className="auth-form"
        >

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e)=>
              setEmail(e.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e)=>
              setPassword(e.target.value)
            }
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