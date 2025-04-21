import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { ref, get, update } from 'firebase/database';
import Swal from 'sweetalert2';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loggedinuid, setloggedinuid] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                const uid = user.uid;
                setloggedinuid(uid);

                // Fetch orders only for the logged-in user
                const ordersRef = ref(db, 'orders');
                get(ordersRef)
                    .then((snapshot) => {
                        if (snapshot.exists()) {
                            const orderObject = snapshot.val();
                            const orderKeys = Object.keys(orderObject);
                            const orderEntries = orderKeys
                                .filter((key) => orderObject[key].uid === uid) // Filter orders by UID
                                .map((key) => ({
                                    key,
                                    ...orderObject[key],
                                }));
                            setOrders(orderEntries);
                        }
                    })
                    .catch((error) => {
                        console.error('Error fetching orders:', error);
                    });
            }
        });

        return () => {
            unsubscribe();
        };
    }, [loggedinuid]);


    const getorders = () => {
        const ordersRef = ref(db, 'orders');
        get(ordersRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const orderObject = snapshot.val();
                    const orderKeys = Object.keys(orderObject);
                    const orderEntries = orderKeys
                        .filter((key) => orderObject[key].uid === loggedinuid) // Filter orders by UID
                        .map((key) => ({
                            key,
                            ...orderObject[key],
                        }));
                    setOrders(orderEntries);
                }
            })
            .catch((error) => {
                console.error('Error fetching orders:', error);
            });
    }

    const cancelOrder = (orderKey) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone!',
            //icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, cancel it!',
            cancelButtonText: 'No, keep it',
            background: 'white',
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    html: `
                      <div class="p-5">
                        <div class="spinner-border text-dark" role="status">
                          <span class="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    `,
                    showConfirmButton: false,
                    background: 'white',
                });

                // Update the order status to "cancelled" in the Realtime Database
                const orderRef = ref(db, `orders/${orderKey}`);
                update(orderRef, { orderstatus: 'cancelled' })
                    .then(() => {

                        Swal.fire({
                            //icon: 'success',
                            title: 'Order cancelled successfully!',
                            showConfirmButton: true,
                            timer: 3000
                        });
                        getorders();
                    })
                    .catch((error) => {
                        Swal.fire({
                            //icon: 'error',
                            title: 'Error Cancelling the order',
                            showConfirmButton: true,
                            timer: 3000
                        });


                    });
            }
        });
    };


    return (
        <div className='table-responsive'>
            <h2>Orders</h2>
            {orders.length > 0 ? (
                <table className='table table-striped'>
                    <thead>
                        <tr>
                            <th>Order Date</th>
                            <th>Total Price</th>
                            <th>Payment Method</th>
                            <th>Order Status</th>
                            <th>Action</th>

                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.key}>
                                <td>{order.orderDate}</td>
                                <td>{order.total}</td>
                                <td>{order.paymentMethod}</td>
                                <td>{order.orderstatus}</td>
                                <td>
                                    {order.orderstatus !== 'cancelled' && order.orderstatus !== 'Delivered' && (
                                        <button onClick={() => cancelOrder(order.key)}>Cancel Order</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No orders found.</p>
            )}
        </div>
    );
};

export default Orders;
