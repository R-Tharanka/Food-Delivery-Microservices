import React, { useState, useEffect } from 'react';
import '../styles/register.css';
import { useNavigate } from 'react-router-dom'
function SuperAdminRegister() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); 

  const validate = (field, value) => {
    let error = '';

    switch (field) {
      case 'name':
        if (!value.trim()) error = 'Name is required';
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) error = 'Invalid email';
        break;
      case 'password':
        if (value.length < 6) error = 'Password must be at least 6 characters';
        break;
      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newForm = { ...form, [name]: value };
    setForm(newForm);

    const newErrors = { ...errors, [name]: validate(name, value) };
    setErrors(newErrors);
  };

  useEffect(() => {
    const noErrors = Object.values(errors).every((err) => !err);
    const allFieldsFilled = Object.values(form).every((val) => val.trim() !== '');
    setIsFormValid(noErrors && allFieldsFilled);
  }, [errors, form]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5002/api/superAdmin/register', {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Registration Successful!');
        setForm({ name: '', email: '', password: '' });
        setErrors({});
        setTimeout(() => {
          navigate('/restaurant/home'); // Redirect to IndexPage after 2 seconds
        }, 2000);
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage('❌ Error during registration');
    }
  };

  return (
    <div className="register-container">
      <h2>Super Admin Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
        />
        {errors.name && <p className="error">{errors.name}</p>}

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

        <button type="submit" disabled={!isFormValid}>Register</button>

        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}

export default SuperAdminRegister;
