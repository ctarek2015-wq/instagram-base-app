import { useState } from "react";
import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";
import {
  push,
  ref as databaseRef,
  set,
} from "firebase/database";
import { storage, database } from "../firebase";

const IMAGES_FOLDER_NAME = "images";
const POSTS_FOLDER_NAME = "posts";

function Composer({ currentUser }) {
  const [textInputValue, setTextInputValue] = useState("");
  const [fileInputFile, setFileInputFile] = useState(null);
  const [fileInputValue, setFileInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const writeData = async (event) => {
    event.preventDefault();
    if (!fileInputFile || !textInputValue.trim()) {
      return;
    }

    setErrorMessage("");
    setIsUploading(true);

    try {
      const fileRef = storageRef(
        storage,
        `${IMAGES_FOLDER_NAME}/${Date.now()}-${fileInputFile.name}`
      );

      const snapshot = await uploadBytes(fileRef, fileInputFile);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      const postListRef = databaseRef(database, POSTS_FOLDER_NAME);
      const newPostRef = push(postListRef);

      await set(newPostRef, {
        imageLink: downloadUrl,
        text: textInputValue.trim(),
        authorEmail: currentUser?.email || "",
        createdAt: Date.now(),
      });

      setTextInputValue("");
      setFileInputFile(null);
      setFileInputValue("");
    } catch (error) {
      const rawMessage =
        error?.message ||
        error?.code ||
        "Failed to upload image and create post.";

      if (
        /preflight|cors|cross-origin|failed to fetch|net::err_failed/i.test(
          rawMessage
        )
      ) {
        setErrorMessage(
          "Storage upload blocked by CORS. Configure Firebase Storage CORS for https://ctarek2015-wq.github.io and retry."
        );
        return;
      }

      setErrorMessage(rawMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="composer">
      <form onSubmit={writeData}>
        <input
          type="file"
          value={fileInputValue}
          onChange={(event) => {
            const file = event.target.files[0];
            if (!file) {
              return;
            }
            setFileInputFile(file);
            setFileInputValue(event.target.value);
          }}
        />
        <input
          type="text"
          value={textInputValue}
          placeholder="Share a quick update"
          onChange={(event) => setTextInputValue(event.target.value)}
        />
        <button
          type="submit"
          disabled={isUploading || !textInputValue.trim() || !fileInputFile}
        >
          {isUploading ? "Uploading..." : "Post"}
        </button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </section>
  );
}

export default Composer;
