import React, { useState , useEffect} from "react";
import "./Modal.css";

export const UPDATEModal = ({ closeModal, onSubmit, defaultValue = {}, courseId }) => {
  const [formState, setFormState] = useState(() => ({
    name: '',
    description: '',
    price: '',
    participantsnumber: '',
    age: '',
    date: '',
    photo: '',
    ...defaultValue // Use spread to override defaults if defaultValue exists
  }));

  // ...
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState('');

  useEffect(() => {
    // This useEffect will now correctly reset the form when defaultValue changes
    if (defaultValue) {
      setFormState({
        name: defaultValue.name || '',
        description: defaultValue.description || '',
        price: defaultValue.price || '',
        participantsnumber: defaultValue.participantsnumber || '',
        age: defaultValue.age || '',
        date: defaultValue.date || '',
        photo: defaultValue.photo || '',
      });
      if (defaultValue.photo) {
        setCurrentPhotoUrl(`${process.env.PUBLIC_URL}${defaultValue.photo}`);
      }
    }
  }, [defaultValue]);
  const [errors, setErrors] = useState("");
  const [file, setFile] = useState(null); 

  const validateForm = () => {
    if (formState.name && formState.description && formState.price && formState.participantsnumber && formState.age && formState.date && formState.photo) {
      setErrors("");
      return true;
    } else {
      let errorFields = [];
      for (const [key, value] of Object.entries(formState)) {
        if (!value) {
          errorFields.push(key);
        }
      }
      setErrors(errorFields.join(", "));
      return false;
    }
  };

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };
  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Update the file state
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;
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

    // Here you make the PUT request to your server endpoint
    fetch(`http://localhost:3002/UpdateCourses/${courseId}`, { // Use the correct endpoint for adding a course
    method: 'PUT',
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
      console.log('Success:', data);
      alert("course updated successfully:)");
      onSubmit(formState); // Update the local state to reflect the changes
      closeModal(); // Close the modal
    })
    .catch(error => {
      console.error('Error:', error);
      setErrors('Failed to update course');
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
            <label htmlFor="name">Name</label>
            <input name="name" onChange={handleChange} value={formState.name} />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              onChange={handleChange}
              value={formState.description}
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input name="price" onChange={handleChange} value={formState.price} />
          </div>
          <div className="form-group">
            <label htmlFor="participantsNumber">Participants</label>
            <input name="participantsnumber" onChange={handleChange} value={formState.participantsnumber} />
          </div>
          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input name="age" onChange={handleChange} value={formState.age} />
          </div>
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input name="date" onChange={handleChange} value={formState.date} />
          </div>
          {currentPhotoUrl && (
            <div className="form-group">
              <label>Current Photo</label>
              <img src={currentPhotoUrl} alt="Course" className="current-photo" />
            </div>
          )}

          {/* File input to upload a new photo */}
          <div className="form-group">
            <label htmlFor="photo">Photo</label>
            <input type="file" name="photo" onChange={handleFileChange} />
          </div>

          <button type="submit" className="btn">
            Submit
          </button>
        </form>
        {errors && <div className="error">{`Please include: ${errors}`}</div>}
      </div>
    </div>
  );
};