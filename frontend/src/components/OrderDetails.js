import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BsFilePdf } from "react-icons/bs";
import { jsPDF } from "jspdf";

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTI1NjRiOTU5MjliOGYyNDhkOGEzMCIsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTc0NDM1MDQ1MSwiZXhwIjoxNzQ2OTQyNDUxfQ.C85afR3WOuprjtjU2Kp1zF6W0eOwbWLExHZ0c5-Z2iY"; // Replace with actual token

  useEffect(() => {
    axios.get(`http://localhost:5005/api/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => setOrder(response.data))
      .catch(error => console.error("Error fetching order details:", error));
  }, [id]);

  if (!order) return (
    <div style={{ textAlign: "center", fontSize: "20px", color: "#888", marginTop: "100px" }}>
      Loading...
    </div>
  );

  const statusColors = {
    Pending: { backgroundColor: "#ffecb3", color: "#b38f00" },
    Confirmed: { backgroundColor: "#d1f2eb", color: "#1e7e34" },
    Preparing: { backgroundColor: "#d0e2ff", color: "#004085" },
    "Out for Delivery": { backgroundColor: "#ffe3e3", color: "#721c24" },
    Delivered: { backgroundColor: "#e6ffed", color: "#1a7f37" },
    Canceled: { backgroundColor: "#f8d7da", color: "#721c24" }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginX = 20;
    let currentY = 40;

    // Title (centered and styled like: ____ ORDER DETAILS ____)
    const title = "__________ ORDER DETAILS __________";
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 139); // Dark blue
    doc.setFont("helvetica", "bold");
    doc.text(title, pageWidth / 2, 20, { align: "center" });

    // Frame layout variables
    const borderTop = 30;
    const borderPadding = 5;
    const startX = marginX - borderPadding;
    let borderHeight = 0;

    // Start yellow background inside content area
    doc.setFillColor(255, 255, 204); // Light yellow
    doc.rect(startX, borderTop, 170, 200, "F"); // temp height, later corrected

    // Customer ID - red bold
    doc.setFontSize(14);
    doc.setTextColor(200, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text(`Customer ID: ${order.customerId}`, marginX, currentY);
    currentY += 10;

    // Other fields - normal black
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.text(`Restaurant ID: ${order.restaurantId}`, marginX, currentY);
    currentY += 10;
    doc.text(`Delivery Address: ${order.deliveryAddress}`, marginX, currentY);
    currentY += 10;
    doc.text(`Status: ${order.status}`, marginX, currentY);
    currentY += 10;

    // Items list
    doc.text("Items:", marginX, currentY);
    currentY += 10;

    order.items.forEach((item) => {
      doc.text(`Food ID: ${item.foodId}`, marginX + 10, currentY);
      currentY += 8;
      doc.text(`Quantity: ${item.quantity}`, marginX + 10, currentY);
      currentY += 8;
      doc.text(`Price: Rs. ${item.price}`, marginX + 10, currentY);
      currentY += 10;
    });

    // Total price
    doc.setFontSize(13);
    doc.setTextColor(30, 90, 200);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Price: Rs. ${order.totalPrice}`, marginX, currentY);
    currentY += 15;

    // Created at
    const createdAt = new Date(order.createdAt).toLocaleString();
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Created At: ${createdAt}`, marginX, doc.internal.pageSize.height - 20);

    // Final correct yellow box height
    borderHeight = currentY - borderTop + 10;
    doc.setDrawColor(0);
    doc.setLineWidth(0.8);
    doc.roundedRect(startX, borderTop, 170, borderHeight, 5, 5); // outer border
    doc.setLineWidth(0.2);
    doc.roundedRect(startX + 3, borderTop + 3, 164, borderHeight - 6, 4, 4); // inner border

    doc.save(`Order_${order._id}.pdf`);

    // Show success alert after downloading
    alert("Your order details report downloaded successfully!");
  };

  return (
    <div style={{
      padding: "30px",
      backgroundColor: "#f6f9fc",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "600px",
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        position: "relative"
      }}>
        {/* PDF Download Button */}
        <button
          onClick={generatePDF}
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            backgroundColor: "#f6f9fc",
            border: "none",
            cursor: "pointer",
            padding: "10px",
            fontSize: "20px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            width: "50px"
          }}
        >
          <BsFilePdf size={24} color="#e60000" />
        </button>

        <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>
          Order Details
        </h2>

        <p><strong>Customer Name:</strong> {order.customerId}</p>
        <p><strong>Restaurant Name:</strong> {order.restaurantId}</p>
        <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
        <p>
          <strong>Status:</strong>
          <span style={{
            marginLeft: "10px",
            padding: "4px 10px",
            borderRadius: "5px",
            fontWeight: "bold",
            fontSize: "0.95rem",
            ...statusColors[order.status] || {}
          }}>
            {order.status}
          </span>
        </p>

        <h4 style={{ marginTop: "30px" }}>Items:</h4>
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {order.items.map((item, index) => (
            <li key={item.foodId || index} style={{
              backgroundColor: "#f0f4f8",
              padding: "12px 16px",
              borderRadius: "6px",
              marginBottom: "10px"
            }}>
              <p><strong>Food :</strong> {item.foodId}</p>
              <p><strong>Quantity:</strong> {item.quantity}</p>
              <p><strong>Price:</strong> Rs. {item.price}</p>
            </li>
          ))}
        </ul>

        <p style={{
          fontSize: "18px",
          fontWeight: "bold",
          textAlign: "right",
          marginTop: "20px",
          color: "#1a73e8"
        }}>
          Total Price: Rs. {order.totalPrice}
        </p>
      </div>
    </div>
  );
}

export default OrderDetails;
