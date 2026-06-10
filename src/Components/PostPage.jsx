import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ref, get } from "firebase/database";
import { Card, Button } from "react-bootstrap";
import { database } from "../firebase";

const POSTS_FOLDER_NAME = "posts";

function PostPage() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const postRef = ref(database, `${POSTS_FOLDER_NAME}/${postId}`);

    get(postRef)
      .then((snapshot) => {
        if (!snapshot.exists()) {
          setPost(null);
          return;
        }
        setPost(snapshot.val());
      })
      .catch((error) => {
        setErrorMessage(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [postId]);

  if (loading) {
    return <p>Loading post...</p>;
  }

  if (errorMessage) {
    return <p className="text-danger">{errorMessage}</p>;
  }

  if (!post) {
    return <p>Post not found.</p>;
  }

  return (
    <section className="post-page">
      <Button variant="outline-primary" onClick={() => navigate("/")}>
        Back
      </Button>
      <Card className="post-card post-page-card mt-3">
        {post.imageLink && <Card.Img src={post.imageLink} alt="Post media" />}
        <Card.Body>
          <Card.Subtitle className="mb-2 text-muted">
            {post.authorEmail || "Anonymous"}
          </Card.Subtitle>
          <Card.Text>{post.text}</Card.Text>
        </Card.Body>
      </Card>
    </section>
  );
}

export default PostPage;
