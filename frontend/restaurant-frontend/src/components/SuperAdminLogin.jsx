import React, { useState } from 'react';
import '../styles/login.css';
import { useNavigate } from 'react-router-dom';

function SuperAdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const validate = (name, value) => {
    let error = '';

    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) error = 'Email is required';
      else if (!emailRegex.test(value)) error = 'Invalid email format';
    }

    if (name === 'password') {
      if (!value) error = 'Password is required';
      else if (value.length < 6) error = 'Password must be at least 6 characters';
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    const error = validate(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailError = validate('email', form.email);
    const passwordError = validate('password', form.password);
    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    try {
      const res = await fetch('http://localhost:5002/api/superAdmin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        const { token, name } = data; // Ensure 'name' comes from backend!
        localStorage.setItem('token', token);
        localStorage.setItem('superAdminName', name);
        setMessage('✅ Login Successful!');
        navigate('/super-admin/dashboard');
      } else {
        setMessage(data.message || '❌ Login failed');
      }
    } catch (err) {
      setMessage('❌ Error during login');
    }
  };

  return (
    <div className="login-container">
      <h2>Super Admin Login</h2>
      <form onSubmit={handleSubmit} noValidate>
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

        <button type="submit">Login</button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}

export default SuperAdminLogin;
