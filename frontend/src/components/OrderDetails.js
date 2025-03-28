import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/orders/${id}`)
      .then(response => setOrder(response.data))
      .catch(error => console.error("Error fetching order details:", error));
  }, [id]);

  if (!order) return <p>Loading...</p>;

  return (
    <div className="container">
      <h2>Order Details</h2>
      <div>
        <p><strong>Customer ID:</strong> {order.customerId}</p>
        <p><strong>Restaurant ID:</strong> {order.restaurantId}</p>
        <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
        <h4>Items:</h4>
        <ul>
          {order.items.map(item => (
            <li key={item.foodId}>
              <strong>Food ID:</strong> {item.foodId} | <strong>Quantity:</strong> {item.quantity} | <strong>Price:</strong> {item.price}
            </li>
          ))}
        </ul>
        <p><strong>Total Price:</strong> {order.totalPrice}</p>
      </div>
    </div>
  );
}

export default OrderDetails;
