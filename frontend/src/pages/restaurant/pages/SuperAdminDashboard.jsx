import React, { useEffect, useState } from 'react';
import '../styles/dashboard.css';

function SuperAdminDashboard() {
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [superAdminName, setSuperAdminName] = useState('');


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('superAdminName');
    window.location.href = '/restaurant/home'; // redirect to login page
  };
  

  const [editing, setEditing] = useState(null); // stores restaurant ID that is being edited
  const [formData, setFormData] = useState({
    name: '',
    ownerName: '',
    location: '',
    contactNumber: '',
  });

  const filteredRestaurants = restaurants.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  

  // Fetch restaurants when the component mounts
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5002/api/superadmin/restaurants', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        const data = await res.json();
        if (res.ok) {
          setRestaurants(data);
        } else {
          setError(data.message || 'Failed to fetch restaurants');
        }
      } catch (err) {
        setError('Server error while fetching restaurants');
      }
    };
  
    const name = localStorage.getItem('superAdminName');
    if (name) setSuperAdminName(name); // ✅ add this line
  
    fetchRestaurants();
  }, []);
  

  // Edit button click handler
  const handleEditClick = (restaurant) => {
    setEditing(restaurant._id); // set the restaurant being edited
    setFormData({
      name: restaurant.name,
      ownerName: restaurant.ownerName,
      location: restaurant.location,
      contactNumber: restaurant.contactNumber,
    });
  };

  // Handle form data changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle the Save button click
  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5002/api/superadmin/restaurant/${editing}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        // Update the restaurant list with the edited data
        setRestaurants(
          restaurants.map((rest) =>
            rest._id === editing ? { ...rest, ...formData } : rest
          )
        );
        setEditing(null); // close the edit form
        alert(data.message);
      } else {
        alert(data.message || 'Save failed');
      }
    } catch (err) {
      alert('Server error during saving');
    }
  };

  // Delete restaurant handler
  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this restaurant?');
    if (!confirm) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5002/api/superadmin/restaurant/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setRestaurants(restaurants.filter((r) => r._id !== id));
        alert(data.message);
      } else {
        alert(data.message || 'Delete failed');
      }
    } catch (err) {
      alert('Server error during deletion');
    }
  };

  return (
    <div className="rdashboard-container">
        <div className="dashboard-header">
  <p>Welcome, <strong>{superAdminName}</strong> 👋</p>
  <button className="logout-btn" onClick={handleLogout}>Logout</button>
</div>

      <h2>🍽️ Restaurants</h2>
      {error && <p className="error">{error}</p>}
      <input
  type="text"
  placeholder="Search by restaurant name..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  className="search-bar"
/>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Owner</th>
            <th>Location</th>
            <th>Contact</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {filteredRestaurants.map((rest) => (

            <tr key={rest._id}>
              <td>{rest.name}</td>
              <td>{rest.ownerName}</td>
              <td>{rest.location}</td>
              <td>{rest.contactNumber}</td>
              <td>
                <button className="sedit-btn" onClick={() => handleEditClick(rest)}>
                  Edit
                </button>
                <button className="sdelete-btn" onClick={() => handleDelete(rest._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editing && (
        <div className="edit-form">
          <h3>Edit Restaurant</h3>

          <input
            type="text"
            name="name"
            placeholder="Restaurant Name"
            value={formData.name}
            onChange={handleInputChange}
          />

          <input
            type="text"
            name="ownerName"
            placeholder="Owner Name"
            value={formData.ownerName}
            onChange={handleInputChange}
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleInputChange}
          />

          <input
            type="text"
            name="contactNumber"
            placeholder="Contact Number"
            value={formData.contactNumber}
            onChange={handleInputChange}
          />

          <button onClick={handleSaveEdit} className="save-btn">
            Save
          </button>
          <button onClick={() => setEditing(null)} className="cancel-btn">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default SuperAdminDashboard;
