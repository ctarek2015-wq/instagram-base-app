import "./App.css";
import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, isFirebaseConfigured, firebaseConfigError } from "./firebase";
import AuthForm from "./Components/AuthForm";
import Chat from "./Components/Chat";
import NewsFeed from "./Components/NewsFeed";
import PostPage from "./Components/PostPage";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setCurrentUser(null);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

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
          {isFirebaseConfigured && !currentUser && (
            <Link to="/authform" className="nav-link">
              Sign In
            </Link>
          )}
          {isFirebaseConfigured && currentUser && (
            <div className="nav-user">
              <span>{currentUser.email}</span>
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
          or this app will not be able to load feed/auth posts.
          <div className="mt-2 text-danger">{firebaseConfigError}</div>
        </section>
      )}

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <NewsFeed
                currentUser={currentUser}
                isFirebaseConfigured={isFirebaseConfigured}
              />
            }
          />
          <Route
            path="/authform"
            element={
              <AuthForm
                isFirebaseConfigured={isFirebaseConfigured}
                currentUser={currentUser}
              />
            }
          />
          <Route
            path="/post/:postId"
            element={<PostPage isFirebaseConfigured={isFirebaseConfigured} />}
          />
          <Route path="/chat" element={<Chat />} />
          <Route path="/posts/:postId" element={<PostPage isFirebaseConfigured={isFirebaseConfigured} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
