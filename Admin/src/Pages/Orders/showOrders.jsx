import React from "react";
import { useState, useEffect } from "react";
import { Table } from "./orderTable";
import { ShowDetailsModal } from "./ShowDetailsModal";
import { orderService } from "./OrderService";

function ShowOrders() {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [Orows, setRows] = useState([]);
  const [currentOrderId, setCurrentOrderId] = useState(null); // New state to keep track of the current editing course ID
  const [rowToshow, setRowToshow] = useState(null);

  useEffect(() => {
    orderService
      .getOrders() // Ensure getOrders is called as a function
      .then((data) => {
        console.log("Fetched data:", data.rows); // Check the actual structure of the fetched data
        setRows(data.rows);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setRows([]); // Ensure rows is an empty array in case of error
      });
  }, []);
  const handleSubmit = (showOrder) => {
    const showRows = Orows.map((row) =>
      row.id === showOrder.id ? showOrder : row
    );
    setRows(showRows);
    setIsDetailsModalOpen(false);
  };
  const handleshowRow = (orderId) => {
    const order = Orows.find((row) => row.id === orderId);
    if (order) {
      setIsDetailsModalOpen(true);
      setCurrentOrderId(order.id); // This should now set the correct order ID
      setRowToshow(order);
    } else {
      console.error("Order not found for ID:", orderId);
    }
  };
  const approveOrder = (orderId) => {
    let status = { status: "completed" }; // Create an object with the status property
    fetch(`http://localhost:3002/updateOrderStatus/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json", // Set the headers to indicate the type of content being sent
      },
      body: JSON.stringify(status), // Convert the status object to a JSON string
    })
      .then((response) => {
        if (!response.ok) {
          alert("something wrong :(");
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        alert("status updated successfully:)");
        console.log("Order approved:", data);
        // Add logic to update the UI based on the response
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const disapproveOrder = (orderId) => {
    let status = { status: "cancelled" }; // Create an object with the status property
    fetch(`http://localhost:3002/updateOrderStatus/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json", // Set the headers to indicate the type of content being sent
      },
      body: JSON.stringify(status), // Convert the status object to a JSON string
    })
      .then((response) => {
        if (!response.ok) {
          alert("something wrong :(");
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        alert("status updated successfully:)");
        console.log("Order approved:", data);
        // Add logic to update the UI based on the response
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="showOrders">
      <Table
        rows={Orows}
        showRow={handleshowRow}
        approveOrder={approveOrder}
        disapproveOrder={disapproveOrder}
      />
      {isDetailsModalOpen && (
        <ShowDetailsModal
          closeModal={() => {
            setIsDetailsModalOpen(false);
            setRowToshow(null);
          }}
          defaultValue={Orows.find((row) => row.id === currentOrderId) || {}}
          orderId={currentOrderId}
        />
      )}
      {console.log(currentOrderId + "******")}
    </div>
  );
}

export default ShowOrders;
