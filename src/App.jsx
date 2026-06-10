import "./App.css";
import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, isFirebaseConfigured, firebaseConfigError } from "./firebase";
import AuthForm from "./Components/AuthForm";
import Chat from "./Components/Chat";
import NewsFeed from "./Components/NewsFeed";
import PostPage from "./Components/PostPage";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [shouldRenderAuthForm, setShouldRenderAuthForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoggedInUser(null);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoggedInUser(user);
      if (user) {
        setShouldRenderAuthForm(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleAuthForm = () => {
    setShouldRenderAuthForm((prevState) => {
      const nextState = !prevState;
      if (nextState) {
        navigate("/");
      }
      return nextState;
    });
  };

  const handleSignOut = async () => {
    if (!auth) {
      return;
    }

    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out failed:", error.message);
    }
  };

  const renderHomeRoute = shouldRenderAuthForm && !loggedInUser ? (
    <AuthForm
      currentUser={loggedInUser}
      onAuthComplete={toggleAuthForm}
    />
  ) : (
    <NewsFeed
      currentUser={loggedInUser}
      isFirebaseConfigured={isFirebaseConfigured}
      onRequestSignIn={toggleAuthForm}
    />
  );

  return (
    <div className="app-shell">
      <header className="top-nav">
        <Link to="/" className="brand">
          Instagram Base
        </Link>
        <nav>
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/chat" className="nav-link">
            Chat
          </Link>
          {isFirebaseConfigured && !loggedInUser && (
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={toggleAuthForm}
            >
              Create Account or Sign In
            </button>
          )}
          {isFirebaseConfigured && loggedInUser && (
            <div className="nav-user">
              <span>{loggedInUser.email}</span>
              <button
                type="button"
                className="btn btn-sm btn-outline-light"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </div>
          )}
        </nav>
      </header>

      {!isFirebaseConfigured && (
        <section className="alert alert-warning m-3" role="alert">
          Firebase is not configured yet. Update <code>.env</code> with your project values,
          or this app will not be able to load feed/auth/posts.
          <div className="mt-2 text-danger">{firebaseConfigError}</div>
        </section>
      )}

      <main>
        <Routes>
          <Route path="/" element={renderHomeRoute} />
          <Route
            path="/authform"
            element={
              <AuthForm
                currentUser={loggedInUser}
                onAuthComplete={() => navigate("/")}
              />
            }
          />
          <Route path="/post/:postId" element={<PostPage isFirebaseConfigured={isFirebaseConfigured} />} />
          <Route path="/posts/:postId" element={<PostPage isFirebaseConfigured={isFirebaseConfigured} />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
