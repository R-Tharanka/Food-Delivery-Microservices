// src/components/RestaurantRegister.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/restaurantRegister.css';

function RestaurantRegister() {
  const navigate = useNavigate("/");

  const [form, setForm] = useState({
    name: '',
    ownerName: '',
    location: '',
    contactNumber: '',
    profilePicture: null, // Will store the image file
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    ownerName: '',
    location: '',
    contactNumber: '',
    email: '',
    password: '',
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });

    if (name !== 'profilePicture') {
      validate(name, value);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, profilePicture: file });
  };

  // Restrict contact number to only numbers and limit to 10 digits
  const handleContactNumberChange = (e) => {
    const { value } = e.target;
    // Allow only numbers and limit to 10 digits
    if (/^\d{0,10}$/.test(value)) {
      setForm({ ...form, contactNumber: value });
    }
  };

  // Real-time field validation
  const validate = (name, value) => {
    const errorsCopy = { ...errors };

    switch (name) {
      case 'name':
        errorsCopy.name = value ? '' : 'Restaurant name is required';
        break;
      case 'ownerName':
        errorsCopy.ownerName = value ? '' : 'Owner name is required';
        break;
      case 'location':
        errorsCopy.location = value ? '' : 'Location is required';
        break;
      case 'contactNumber':
        const phoneRegex = /^[0-9]{10}$/;
        errorsCopy.contactNumber =
          phoneRegex.test(value) ? '' : 'Phone number must be exactly 10 digits';
        break;
      case 'email':
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        errorsCopy.email = emailRegex.test(value)
          ? ''
          : 'Please enter a valid email address';
        break;
      case 'password':
        const passwordRegex =
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        errorsCopy.password = passwordRegex.test(value)
          ? ''
          : 'Password must be at least 6 characters, include a number and a special character';
        break;
      default:
        break;
    }

    setErrors(errorsCopy);
  };

  // Check if the form is valid
  const validateForm = () => {
    return (
      Object.values(errors).every((err) => err === '') &&
      Object.values(form).every((value) => value !== '')
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('ownerName', form.ownerName);
      formData.append('location', form.location);
      formData.append('contactNumber', form.contactNumber);
      formData.append('profilePicture', form.profilePicture);
      formData.append('email', form.email);
      formData.append('password', form.password);

      const res = await fetch('http://localhost:5002/api/restaurant/register', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Restaurant registered successfully!');
       setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setMessage(data.message || 'Registration failed');
      }
    } catch (error) {
      setMessage('Error registering the restaurant');
    }
  };

  return (
    <div className="restaurant-register-container">
      <h2>Restaurant Registration</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          name="name"
          placeholder="Restaurant Name"
          value={form.name}
          onChange={handleChange}
        />
        {errors.name && <p className="error">{errors.name}</p>}

        <input
          type="text"
          name="ownerName"
          placeholder="Owner Name"
          value={form.ownerName}
          onChange={handleChange}
        />
        {errors.ownerName && <p className="error">{errors.ownerName}</p>}

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
        />
        {errors.location && <p className="error">{errors.location}</p>}

        <input
          type="text"
          name="contactNumber"
          placeholder="Contact Number"
          value={form.contactNumber}
          onChange={handleContactNumberChange} // Use the restricted function here
        />
        {errors.contactNumber && <p className="error">{errors.contactNumber}</p>}

        <div className="file-input-container">
          <label htmlFor="profilePicture">Select a profile picture</label>
          <input
            type="file"
            name="profilePicture"
            accept="image/*"
            id="profilePicture"
            onChange={handleFileChange}
          />
          {form.profilePicture && (
            <p>Selected: {form.profilePicture.name}</p>
          )}
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <button type="submit" disabled={!validateForm()}>
          Register
        </button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}

export default RestaurantRegister;
