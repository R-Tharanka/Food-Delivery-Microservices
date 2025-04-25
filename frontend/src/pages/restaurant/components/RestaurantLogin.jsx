// src/components/RestaurantLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/restaurantLogin.css'; // You can style it separately

function RestaurantLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validate(name, value); // Validate field as user types
  };

  // Real-time field validation
  const validate = (name, value) => {
    let errorsCopy = { ...errors };

    switch (name) {
      case 'email':
        // Email validation regex
        const emailRegex =
          /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        errorsCopy.email = emailRegex.test(value)
          ? ''
          : 'Please enter a valid email address';
        break;
      case 'password':
        // Password should be at least 6 characters
        errorsCopy.password =
          value.length >= 6 ? '' : 'Password must be at least 6 characters';
        break;
      default:
        break;
    }

    setErrors(errorsCopy);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if there are any validation errors before submitting
    if (Object.values(errors).some((err) => err !== '') || !validateForm()) {
      return;
    }

    try {
      const res = await fetch('http://localhost:5002/api/restaurant/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        setMessage('Login successful!');
        setTimeout(() => {
          navigate('/restaurant/dashboard'); // Redirect to the dashboard after successful login
        }, 2000);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Error logging in');
    }
  };

  // Function to check if form is valid (no errors)
  const validateForm = () => {
    return !Object.values(errors).some((err) => err !== '');
  };

  return (
    <div className="restaurant-login-container">
      <h2>Restaurant Login</h2>
      <form onSubmit={handleSubmit}>
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
          Login
        </button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}

export default RestaurantLogin;
