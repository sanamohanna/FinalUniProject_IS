import React, { useState } from "react";
import "./Modal.css";
import { imagedb } from "../../FireBase/Config";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
export const ModalAdd = ({ closeModal, onAddProduct }) => {
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
  });
  const [file, setFile] = useState(null); // State for storing the file
  const [errors, setErrors] = useState("");

 
  const categories = [
    { name: 'Candles' },
    { name: 'Paint Art' },
    { name: 'candles' },
    { name: 'Paint art' },
    { name: 'paint art' },
    { name: 'paint Art' }
  ];



  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Set the file in state
  };

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const categoryMatch = categories.some(category => category.name === formState.category);
    if (!categoryMatch) {
      alert("Invalid category. select : 'Candles','Paint Art'");
      return;
    }else{
      if(formState.category == 'candles'){
        formState.category = 'Candles';
      }
      if(formState.category == 'paint art' || formState.category == 'Paint art' || formState.category == 'paint Art'){
        formState.category = 'Paint Art';
      }
    }
    if (!file) {
      setErrors('Please select a file to upload');
      return;
    }
    const jsonData = JSON.stringify(formState);

    fetch("http://localhost:3002/AddProduct", {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
      },
      body: jsonData, // Send the JSON data
    })
    .then(response => {
      if (!response.ok) {
        alert("something wrong :(");
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Product added successfully:', data);
      onAddProduct(data);
      alert("product added successfully:)");
      if(formState.category === "Candles"){
        const storageRef = ref(imagedb, `candles/p${data.id}.PNG`);
        uploadBytes(storageRef, file).then((snapshot) => {
          console.log('File uploaded successfully');
          alert("product added successfully:)");
        }).catch((error) => {
            console.error('Upload failed', error);
          });
      }
      if(formState.category === 'Paint Art'){
        const storageRef = ref(imagedb, `handwritingPaints/p${data.id}.jpeg`);
        uploadBytes(storageRef, file).then((snapshot) => {
          console.log('File uploaded successfully');
          alert("product added successfully:)");
        }).catch((error) => {
            console.error('Upload failed', error);
          });
      }


      closeModal();
    })
    .catch(error => {
      console.error('Error adding product:', error);
      setErrors('Failed to add product');
    });
  };

  return (
    <div className="modal-container" onClick={(e) => {
      if (e.target.className === "modal-container") closeModal();
    }}>
      <div className="modal">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input name="name" onChange={handleChange} value={formState.name} required />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              onChange={handleChange}
              value={formState.description}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input name="price" onChange={handleChange} value={formState.price} required />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input name="category" onChange={handleChange} value={formState.category} required />
          </div>
          <div className="form-group">
            <label htmlFor="image">Image</label>
            <input type="file" onChange={handleFileChange} />
          </div>
          <button type="submit" className="btn">Add Product</button>
        </form>
        {errors && <div className="error">{`Error: ${errors}`}</div>}
      </div>
    </div>
  );
};
