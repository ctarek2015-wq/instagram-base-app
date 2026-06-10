import "./App.css";
import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import AuthForm from "./Components/AuthForm";
import Chat from "./Components/Chat";
import NewsFeed from "./Components/NewsFeed";
import PostPage from "./Components/PostPage";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
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
          {!currentUser && (
            <Link to="/authform" className="nav-link">
              Sign In
            </Link>
          )}
          {currentUser && (
            <div className="nav-user">
              <span>{currentUser.email}</span>
              <button type="button" className="btn btn-sm btn-outline-light" onClick={handleSignOut}>
                Sign Out
              </button>
            </div>
          )}
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<NewsFeed currentUser={currentUser} />} />
          <Route
            path="/authform"
            element={<AuthForm />}
          />
          <Route path="/post/:postId" element={<PostPage />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
