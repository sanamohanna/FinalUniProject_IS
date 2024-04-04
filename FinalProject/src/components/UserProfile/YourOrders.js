import React, { useState, useEffect } from 'react';
import './YourOrders.css'
import { ShowDetailsModal } from './ShowDetailsModal';

const YourOrders = () => {

    const [orders, setOrders] = useState([]);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [rowToshow, setRowToshow] = useState(null);
    const [currentOrderId, setCurrentOrderId] = useState(null); // New state to keep track of the current editing course ID
    const userId = 2;
    const fetchOrders = async () => {
        try {
            const response = await fetch(`http://localhost:3002/orders`,{
                method: 'GET',
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        fetchOrders();
    }, []); 
    const handleViewClick = (orderId) => {
        const order = orders.find((row) => row.id === orderId);
        if (order) {
          setIsDetailsModalOpen(true);
          setCurrentOrderId(order.id); // This should now set the correct order ID
           setRowToshow(order); 
        } else {
          console.error("Order not found for ID:", orderId);
        }
      };
    return (
        <div className='yourorders'>
            <h1 className='mainhead1'>Your Orders</h1>
            {
            }
            <table className='yourorderstable'>
                <thead>
                    <tr>
                        <th scope='col'>Oder ID</th>
                        <th scope='col'>Status</th>
                        <th scope='col'>Invoice</th>
                    </tr>
                </thead>

                <tbody>
                    {orders.map((item, index) => {
                        return (
                            <tr key={index}>
                                <td data-label='OrderID'>{item.id}</td>
                                <td data-label='Delivery Status'>
                                    <div>
                                        {item.status == 'Delivered' && <span className='greendot'></span>}
                                        {item.status == 'On the way' && <span className='yellowdot'></span>}
                                        {item.status == 'Cancelled' && <span className='reddot'></span>}
                                        {item.status}
                                    </div>
                                </td>
                                <td data-label='Invoice'>
                                    <button className='mainbutton1' onClick={() => handleViewClick(item.id)}
                                    >View</button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            {isDetailsModalOpen && (
            <ShowDetailsModal
                closeModal={() => {
                setIsDetailsModalOpen(false);
                setCurrentOrderId(null); // Correct usage of the setter function for currentOrderId
                setRowToshow(null);
                }}
                defaultValue={orders.find((row) => row.id === currentOrderId) || {}}
                orderId={currentOrderId}
            />
            )}

        </div>
    )
}

export default YourOrders;