import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";

function AuthForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitLabel = isSignUp ? "Create account" : "Sign in";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-form">
      <h2>{isSignUp ? "Create account" : "Welcome back"}</h2>
      <p className="form-note">
        {isSignUp
          ? "Create an account to post updates."
          : "Sign in to post and view your profile."}
      </p>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
          required
        />
        <button type="submit" disabled={isSubmitting || !email || !password}>
          {isSubmitting ? "Please wait..." : submitLabel}
        </button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <button
        type="button"
        className="btn btn-link"
        onClick={() => setIsSignUp((prev) => !prev)}
      >
        {isSignUp
          ? "Have an account? Sign in"
          : "Need an account? Create one"}
      </button>
      <Link to="/" className="nav-link mt-2 d-inline-block">
        Back to feed
      </Link>
    </section>
  );
}

export default AuthForm;
