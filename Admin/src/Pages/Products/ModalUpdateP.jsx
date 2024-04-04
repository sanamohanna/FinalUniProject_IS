import React, { useState, useEffect } from "react";
import "./Modal.css";

export const UPDATEModal = ({ closeModal, onSubmit, defaultValue = {}, productId }) => {
  const [formState, setFormState] = useState({
    productname: '',
    description: '',
    price: '',
    categoryname: '',
    ...defaultValue // Spread to override defaults if defaultValue exists
  });

  const [errors, setErrors] = useState("");

  useEffect(() => {
    setFormState(prevState => ({ ...prevState, ...defaultValue }));
  }, [defaultValue]);

  const categories = [
    { name: 'Candles' },
    { name: 'Paint Art' },
    { name: 'candles' },
    { name: 'Paint art' },
    { name: 'paint art' },
    { name: 'paint Art' }
  ];

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let errorFields = Object.entries(formState).reduce((acc, [key, value]) => {
      if (!value) acc.push(key);
      return acc;
    }, []);

    if (errorFields.length === 0) {
      setErrors("");
      return true;
    } else {
      setErrors(`Please include: ${errorFields.join(", ")}`);
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const categoryMatch = categories.some(category => category.name === formState.categoryname);
    if (!categoryMatch) {
      alert("Invalid category. Select: 'Candles', 'Paint Art'");
      return;
    }else{
      if(formState.categoryname == 'candles'){
        formState.categoryname = 'Candles';
      }
      if(formState.categoryname == 'paint art' || formState.categoryname == 'Paint art' || formState.categoryname == 'paint Art'){
        formState.categoryname = 'Paint Art';
      }
    }

    const jsonData = JSON.stringify(formState);

    fetch(`http://localhost:3002/UpdateProducts/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: jsonData
    })
    .then(response => {
      if (!response.ok) {
        alert("something wrong :(");
        throw new Error('Network response was not ok');
        
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      alert("product updated successfully:)");
      onSubmit({ ...formState, id: productId }); // Ensure product ID and other state info is updated in the parent state
      closeModal(); // Close the modal
    })
    .catch(error => {
      console.error('Error:', error);
      setErrors('Failed to update product');
    });
  };

  return (
    <div
      className="modal-container"
      onClick={(e) => {
        if (e.target.className === "modal-container") closeModal();
      }}
    >
      <div className="modal">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="productname">Name</label>
            <input name="productname" onChange={handleChange} value={formState.productname} required />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea name="description" onChange={handleChange} value={formState.description} required />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input name="price" onChange={handleChange} value={formState.price} required />
          </div>
          <div className="form-group">
            <label htmlFor="categoryname">Category</label>
            <input name="categoryname" onChange={handleChange} value={formState.categoryname} required />
          </div>
          <button type="submit" className="btn">Submit</button>
          {errors && <div className="error">{errors}</div>}
        </form>
      </div>
    </div>
  );
};
