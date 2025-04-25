import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import styles from '../styles/IndexPage.module.css';

function IndexPage() {
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  const [showSignUpOptions, setShowSignUpOptions] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLoginClick = () => {
    setShowLoginOptions(true);
    setShowSignUpOptions(false); // Hide SignUp options if they are visible
  };

  const handleSignUpClick = () => {
    setShowSignUpOptions(true);
    setShowLoginOptions(false); // Hide Login options if they are visible
  };

  return (
    <div className={styles['index-container']}>
      <h1>Welcome</h1>
      <button className={`${styles.button} ${styles['login-btn']}`} onClick={handleLoginClick}>
        Login
      </button>
      <button className={`${styles.button} ${styles['signup-btn']}`} onClick={handleSignUpClick}>
        SignUp
      </button>
      <button className={`${styles.button} ${styles['homepage-btn']}`}>
        HomePage
      </button>

      {/* Render Login Options */}
      {showLoginOptions && (
        <div className={styles['button-group']}>
          <button
            className={`${styles.button} ${styles['admin-btn']}`}
            onClick={() => navigate('/superadmin/login')} // Redirect to SuperAdmin login
          >
            Login as SuperAdmin
          </button>
          <button
            className={`${styles.button} ${styles['restaurant-btn']}`}
            onClick={() => navigate('/restaurant/login')} // Redirect to RestaurantAdmin login
          >
            Login as RestaurantAdmin
          </button>
        </div>
      )}

      {/* Render SignUp Options */}
      {showSignUpOptions && (
        <div className={styles['button-group']}>
          <button
            className={`${styles.button} ${styles['admin-btn']}`}
            onClick={() => navigate('/superadmin/register')} // Redirect to SuperAdmin register
          >
            SignUp as SuperAdmin
          </button>
          <button
            className={`${styles.button} ${styles['restaurant-btn']}`}
            onClick={() => navigate('/restaurant/register')} // Redirect to RestaurantAdmin register
          >
            SignUp as RestaurantAdmin
          </button>
        </div>
      )}
    </div>
  );
}

export default IndexPage;