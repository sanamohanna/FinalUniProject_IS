import React, { useState, useEffect } from 'react';
import './UserAddress.css';

const UserAddress = () => {
    const [userAddress, setUserAddress] = useState({ address: '', postalcode: '' });
  
    const fetchDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3002/userdetails`,{
          method: 'GET',
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error('Failed to fetch Address');
        }
        const data = await response.json();
        console.log("Fetched user Address:", data); // Debugging: Confirm fetched data
        if (data && data.length > 0) {
          // Assuming the user details are in the first element of the array
          setUserAddress({
            address: data[0].address, // Make sure the property name matches what's in the array
            postalcode: data[0].postalcode
          });
          console.log(data[0].address + " ++++ " + data[0].postalcode);
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    useEffect(() => {
      fetchDetails().then(() => console.log("State after fetchDetails:", userAddress)); // This might still show initial state due to async nature
    }, []);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setUserAddress(prevAddress => {
        const updatedAddress = {
          ...prevAddress,
          [name]: value,
        };
        console.log("Updated state on handleChange:", updatedAddress); // Debugging: Confirm state updates on change
        return updatedAddress;
      });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const response = await fetch(`http://localhost:3002/userAddress`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userAddress),
        });
  
        if (!response.ok) {
          throw new Error('Failed to update user address');
        }
  
        console.log('User address updated successfully');
      } catch (error) {
        console.error(error);
      }
    };
  
    return (
      <div className='Address_settings'>
        <h1 className='mainhead_address'>Address Information</h1>
        <div className='form_address'>
          <div className='form-group_address'>
            <label htmlFor='name'>Your Address <span>*</span></label>
            <input type='text' name='address' id='address' onChange={handleChange} value={userAddress.address || ''}/>
          </div>
          <div className='form-group_address'>
            <label htmlFor='email'>Your PostalCode <span>*</span></label>
            <input type='email' name='postalcode' id='postalcode' onChange={handleChange} value={userAddress.postalcode || ''}/>
          </div>
        </div>
        <button className='mainbutton1' onClick={handleSubmit}>Save Changes</button>
      </div>
    );
};

export default UserAddress;
