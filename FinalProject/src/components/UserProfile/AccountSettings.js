import React, { useState, useEffect } from 'react';
import './AccountSettings.css';

const AccountSettings = () => {
  const [userDetails, setUserDetails] = useState({ userName: '', email: '' });

  const fetchDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3002/userdetails`,{
        method: 'GET',
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch details');
      }
      const data = await response.json();
      console.log("Fetched user details:", data); // Debugging: Confirm fetched data
      if (data && data.length > 0) {
        // Assuming the user details are in the first element of the array
        setUserDetails({
          userName: data[0].username, // Make sure the property name matches what's in the array
          email: data[0].email
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDetails().then(() => console.log("State after fetchDetails:", userDetails)); // This might still show initial state due to async nature
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prevDetails => {
      const updatedDetails = {
        ...prevDetails,
        [name]: value,
      };
      console.log("Updated state on handleChange:", updatedDetails); // Debugging: Confirm state updates on change
      return updatedDetails;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3002/userdetails`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDetails),
      });

      if (!response.ok) {
        throw new Error('Failed to update user details');
      }

      console.log('User details updated successfully');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='accountsettings'>
      <h1 className='mainhead1'>Personal Information</h1>
      <div className='form'>
        <div className='form-group'>
          <label htmlFor='name'>Your Name <span>*</span></label>
          <input type='text' name='userName' id='name' onChange={handleChange} value={userDetails.userName || ''}/>
        </div>
        <div className='form-group'>
          <label htmlFor='email'>Email <span>*</span></label>
          <input type='email' name='email' id='email' onChange={handleChange} value={userDetails.email || ''}/>
        </div>
      </div>
      <button className='mainbutton1' onClick={handleSubmit}>Save Changes</button>
    </div>
  );
};

export default AccountSettings;
