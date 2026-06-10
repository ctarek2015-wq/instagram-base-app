import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import { onChildAdded, ref as databaseRef } from "firebase/database";
import { database } from "../firebase";
import Composer from "./Composer";
import "./NewsFeed.css";

const POSTS_FOLDER_NAME = "posts";

function NewsFeed({ currentUser, isFirebaseConfigured, onRequestSignIn }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!isFirebaseConfigured || !database) {
      return undefined;
    }

    const messagesRef = databaseRef(database, POSTS_FOLDER_NAME);
    const unsubscribe = onChildAdded(messagesRef, (data) => {
      setPosts((prevState) => [...prevState, { key: data.key, val: data.val() }]);
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [isFirebaseConfigured]);

  const postListItems = [...posts]
    .reverse()
    .map((post) => (
      <Link to={`/post/${post.key}`} className="post-link" key={post.key}>
        <Card className="post-card">
          {post.val.imageLink && (
            <Card.Img src={post.val.imageLink} alt="Post media" variant="top" />
          )}
          <Card.Body>
            <Card.Subtitle className="mb-2 text-muted">
              {post.val.authorEmail || "Anonymous"}
            </Card.Subtitle>
            <Card.Text>{post.val.text}</Card.Text>
          </Card.Body>
        </Card>
      </Link>
    ));

  return (
    <section className="news-feed">
      <h2>News Feed</h2>
      {!isFirebaseConfigured ? (
        <p className="text-muted">
          Configure Firebase in <code>.env</code> to load posts.
        </p>
      ) : currentUser ? (
        <Composer currentUser={currentUser} />
      ) : (
        <p className="text-muted">
          <button className="btn btn-outline-info btn-sm" onClick={onRequestSignIn}>
            Create Account or Sign In
          </button>
          {' '}to post.
        </p>
      )}

      <div className="post-list">{postListItems.length ? postListItems : "No posts yet."}</div>
    </section>
  );
}

export default NewsFeed;
