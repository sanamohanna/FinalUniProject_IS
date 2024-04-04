import React, { useState } from "react";
import "./Modal.css";


export const ModalAdd = ({ closeModal, onAddCourse }) => {
  // Initialize form state with empty fields for a new course
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    price: '',
    participantsnumber: '',
    age: '',
    date: '',
    photo: ''
  });

  const [errors, setErrors] = useState("");
  const [file, setFile] = useState(null); 

  const validateForm = () => {
    // Create an array from formState values and include 'file' if it's set
    const allValues = [...Object.values(formState), file];
  
    if (allValues.every(value => value)) {
      setErrors("");
      return true;
    } else {
      let errorFields = [];
      for (const [key, value] of Object.entries(formState)) {
        if (!value) {
          errorFields.push(key);
        }
      }
      if (!file) errorFields.push('photo');
      setErrors(errorFields.join(", "));
      return false;
    }
  };

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Update the file state
    console.log(file);

  };

  
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create formData for file upload
    const formData = new FormData();
    // Append all form fields except 'photo' to formData
    for (const [key, value] of Object.entries(formState)) {
      formData.append(key, value);
    }
  
    // Append the file to formData if a file was selected
    if (file) {
       formData.append('photo', file);
    } else {
      // If no file was selected and we're not editing (no default photo)
      if (!formState.photo) {
        alert("Please include a photo.");
        return;
      }
    }
  
    // Send a single POST request with formData to upload the course info and photo
    fetch('http://localhost:3002/AddCourses', { // Use the correct endpoint for adding a course
      method: 'POST',
      body: formData // formData contains both the file and other form fields
    })
    .then(response => {
      if (!response.ok) {
        alert("something wrong :(");
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Course added successfully:', data);
      alert("course added successfully:)");
      onAddCourse(data); // Update parent component state with the new course
      closeModal(); // Close the modal after successful addition
    })
    .catch(error => {
      console.error('Error adding course:', error);
      setErrors('Failed to add course');
    });
};


  return (
    <div className="modal-container" onClick={(e) => {
        if (e.target.className === "modal-container") closeModal();
      }}>
    <div className="modal" >
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
        <input name="price" onChange={handleChange} value={formState.price} required  />
      </div>
      <div className="form-group">
        <label htmlFor="participantsNumber">Participants</label>
        <input name="participantsnumber" onChange={handleChange} value={formState.participantsnumber} required />
      </div>
      <div className="form-group">
        <label htmlFor="age">Age</label>
        <input name="age" onChange={handleChange} value={formState.age} required />
      </div>
      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input name="date" onChange={handleChange} value={formState.date} required />
      </div>
      <div className="form-group">
        <label htmlFor="photo">Photo</label>
        <input type="file" name="photo" onChange={handleFileChange}  />
        </div>

      <button type="submit" className="btn">
        Add Course
      </button>
    </form>
    {errors && <div className="error">{`Please include: ${errors}`}</div>}
    {console.log("error "+errors)}
  </div>
</div>
  );
};
