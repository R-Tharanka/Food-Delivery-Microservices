import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function CustomerProfile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5001/api/auth/customer/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data.data.customer);
      } catch (err) {
        setError("Could not fetch profile");
      }
    })();
  }, []);

  if (error) return <p>{error}</p>;
  if (!profile) return <p>Loading…</p>;

  return (
    <div>
      <Header />
      <h2>Welcome back, {profile.firstName}!</h2>
      <p>
        <strong>Email:</strong> {profile.email}<br/>
        <strong>Phone:</strong> {profile.phone}<br/>
        <strong>Location:</strong> {profile.location || "N/A"}
      </p>
      <Footer />
    </div>
  );
}
