import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "../firebase";

function AuthForm({ currentUser }) {
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
      if (!isFirebaseConfigured || !auth) {
        throw new Error("Firebase auth is not configured yet.");
      }

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

  if (!isFirebaseConfigured) {
    return (
      <section className="auth-form">
        <h2>Firebase not configured</h2>
        <p>Please add your Firebase values to .env before signing in.</p>
      </section>
    );
  }

  if (currentUser) {
    return (
      <section className="auth-form">
        <h2>You&apos;re already signed in</h2>
        <p>
          <Link to="/" className="nav-link">
            Go to feed
          </Link>
        </p>
      </section>
    );
  }

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
