import React, { useState } from "react";
import { app, storage } from './config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import './images_upload.css';
const ReactFirebaseFileUpload = () => {
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState(0);

  const handleChange = e => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    // Create a reference to the storage location
    const storageRef = ref(storage, `uploads/${image.name}`);
    
    // Start the upload process
    const uploadTask = uploadBytesResumable(storageRef, image);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on('state_changed',
        (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress);
        }, 
        (error) => {
            // Handle unsuccessful uploads
            console.log(error);
        }, 
        () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setUrl(downloadURL);
            });
        }
    );
};

  console.log("image: ", image);

  return (
    <div className="upload-container">
      <progress value={progress} max="100" />
      <br />
      <br />
      <input type="file" onChange={handleChange} />
      <button onClick={handleUpload}>Upload</button>
      <br />
      {url}
      <br />
      <img src={url || "http://via.placeholder.com/300"} alt="firebase-image" />
    </div>
  );
};

export { ReactFirebaseFileUpload };
