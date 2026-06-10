import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import { onChildAdded, ref as databaseRef } from "firebase/database";
import { database } from "../firebase";
import Composer from "./Composer";
import "./NewsFeed.css";

const POSTS_FOLDER_NAME = "posts";

function NewsFeed({ currentUser }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const messagesRef = databaseRef(database, POSTS_FOLDER_NAME);
    const unsubscribe = onChildAdded(messagesRef, (data) => {
      setPosts((prevState) => [...prevState, { key: data.key, val: data.val() }]);
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

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
      {currentUser ? (
        <Composer currentUser={currentUser} />
      ) : (
        <p className="text-muted">
          <Link to="/authform">Sign in</Link> to post.
        </p>
      )}

      <div className="post-list">{postListItems.length ? postListItems : "No posts yet."}</div>
    </section>
  );
}

export default NewsFeed;
