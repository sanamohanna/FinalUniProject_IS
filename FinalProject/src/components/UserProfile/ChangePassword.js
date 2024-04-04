import React, { useState, useEffect } from 'react';

const ChangePassword = () => {
    const [passwordDetails, setPasswordDetails] = useState({
        oldPassword: '',
        newPassword: '',
    });
    const userId = 2; // You'll need to obtain this from the logged-in user context or props

    useEffect(() => {
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
                // Assuming the user details are in the first element of the data
                setPasswordDetails(prevState => ({ ...prevState, oldPassword: data.password }));
            } catch (error) {
                console.error(error);
            }
        };

        fetchDetails();
    }, [userId]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPasswordDetails(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:3002/userpassword`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    oldPassword: passwordDetails.oldPassword,
                    newPassword: passwordDetails.newPassword,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update user password');
            }

            const data = await response.json();
            console.log('Password updated successfully:', data);
            // Here you should clear the form or give user feedback
        } catch (error) {
            console.error('Error updating password:', error);
        }
    };

    return (
        <div className='accountsettings'>
            <h1 className='mainhead1'>Change Password</h1>
            <form onSubmit={handleSubmit} className='form'>
                <div className='form-group'>
                    <label htmlFor='oldpass'>Old Password <span>*</span></label>
                    <input
                        type="password"
                        name="oldPassword"
                        value={passwordDetails.oldPassword}
                        onChange={handleChange}
                        id='oldpass'
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor='newpass'>New Password <span>*</span></label>
                    <input
                        type="password"
                        name="newPassword"
                        value={passwordDetails.newPassword}
                        onChange={handleChange}
                        id='newpass'
                    />
                </div>

                <button type='submit' className='mainbutton1'>Save Changes</button>
            </form>
        </div>
    );
};

export default ChangePassword;
