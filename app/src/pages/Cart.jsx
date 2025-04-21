import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { ref, get, remove, set, push, runTransaction, onValue } from 'firebase/database';
import Swal from 'sweetalert2';
import { onAuthStateChanged } from 'firebase/auth';
import qrcode from '../assets/qr-code.png'

const Cart = ({ componentrender }) => {
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [totalCartPrice, setTotalCartPrice] = useState(0);
  const [data, setdata] = useState()

  const [loggedinuid, setloggedinuid] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setloggedinuid(uid);

        const userRef = ref(db, 'users/' + uid + '/profile');
        get(userRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              setloggedinuid(uid);
              const userData = snapshot.val();

              setdata(userData)
            }
          })
          .catch((error) => {
            console.error('Error fetching Realtime Database data:', error);
          });
      }
    });



    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const dataRef = ref(db, 'users/' + loggedinuid + '/cart');
    get(dataRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const dataObject = snapshot.val();
          const dataKeys = Object.keys(dataObject);
          const dataEntries = dataKeys.map((key) => ({
            key,
            ...dataObject[key],
          }));
          setTableData(dataEntries);
        }
      })
      .catch((error) => {
        console.error('Error fetching cart data:', error);
      });
  }, [loggedinuid]);


  useEffect(() => {
    if (selectedPaymentMethod === "online") {
      console.log("online")
      setshowqr(true)
    }
    else {
      setshowqr(false)
    }
  })


  const fetchfromcart = () => {
    const dataRef = ref(db, 'users/' + loggedinuid + '/cart');
    get(dataRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const dataObject = snapshot.val();
          const dataKeys = Object.keys(dataObject);
          const dataEntries = dataKeys.map((key) => ({
            key,
            ...dataObject[key],
          }));
          setTableData(dataEntries);
        }
      })
      .catch((error) => {
        console.error('Error fetching cart data:', error);
      });
  }
  useEffect(() => {
    const fetchProductDetails = async () => {
      const productDetails = [];

      for (const entry of tableData) {
        const productRef = ref(db, 'products/' + entry.productID);

        try {
          const productSnapshot = await get(productRef);

          if (productSnapshot.exists()) {
            const productData = productSnapshot.val();

            productDetails.push({
              key: entry.key,
              productID: entry.productID,
              productImage: productData.imageURL,
              productName: productData.name,
              productPrice: productData.price,
              quantity: entry.quantity,
            });
          }
        } catch (error) {
          console.error('Error fetching product details:', error);
        }
      }

      setFilteredData(productDetails);
    };

    fetchProductDetails();
  }, [tableData]);


  const fetchProductDetails = async () => {
    const productDetails = [];

    for (const entry of tableData) {
      const productRef = ref(db, 'products/' + entry.productID);

      try {
        const productSnapshot = await get(productRef);

        if (productSnapshot.exists()) {
          const productData = productSnapshot.val();

          productDetails.push({
            key: entry.key,
            productID: entry.productID,
            productImage: productData.imageURL,
            productName: productData.name,
            productPrice: productData.price,
            quantity: entry.quantity,
          });
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    }

    setFilteredData(productDetails);
  };




  const handleQuantityChange = (key, newQuantity) => {
    // Update the quantity in the Realtime Database
    const cartItemRef = ref(db, `users/${loggedinuid}/cart/${key}`);

    // Use transaction to update the quantity without removing other properties
    runTransaction(cartItemRef, (currentData) => {
      return { ...currentData, quantity: parseInt(newQuantity, 10) || 1 };
    })
      .then(() => {
        console.log(`Quantity updated for key ${key}. New quantity: ${newQuantity}`);
      })
      .catch((error) => {
        console.error('Error updating quantity:', error);
      });
  };



  const decrease = (key) => {
    // Decrease the quantity in the Realtime Database
    const cartItemRef = ref(db, `users/${loggedinuid}/cart/${key}`);

    // Use transaction to update the quantity without removing other properties
    runTransaction(cartItemRef, (currentData) => {
      const currentQuantity = currentData.quantity || 0;

      // Ensure quantity does not go below 1
      const newQuantity = Math.max(1, currentQuantity - 1);

      return { ...currentData, quantity: newQuantity };
    })
      .then(() => {
        console.log(`Quantity decreased for key ${key}.`);
        fetchfromcart(); // Fetch updated cart data after quantity update
        Swal.close();
      })
      .catch((error) => {
        console.error('Error updating quantity:', error);
      });
  };

  const increase = (key) => {
    // Increase the quantity in the Realtime Database
    const cartItemRef = ref(db, `users/${loggedinuid}/cart/${key}`);

    // Use transaction to update the quantity without removing other properties
    runTransaction(cartItemRef, (currentData) => {
      const currentQuantity = currentData.quantity || 0;
      const newQuantity = currentQuantity + 1;

      return { ...currentData, quantity: newQuantity };
    })
      .then(() => {
        fetchfromcart(); // Fetch updated cart data after quantity update
        Swal.close();
        console.log(`Quantity increased for key ${key}.`);
      })
      .catch((error) => {
        console.error('Error updating quantity:', error);
      });
  };





  useEffect(() => {
    calculateTotalCartPrice();
  }, [filteredData]);

  const calculateTotalCartPrice = () => {
    let total = 0;

    for (const productDetails of filteredData) {
      total += productDetails.productPrice * productDetails.quantity;
    }

    setTotalCartPrice(total);
  };


  const deletecartitem = (cartKey) => {
    Swal.fire({
      title: 'Confirm Deletion',
      text: 'Are you sure you want to delete this item from the cart?',
      //icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
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
          background: 'transparent',
          timer: 3000
        });

        setFilteredData((prevData) => prevData.filter((item) => item.key !== cartKey));

        const cartItemRef = ref(db, 'users/' + loggedinuid + '/cart/' + cartKey);

        remove(cartItemRef)
          .then(() => {
            Swal.fire({
              //icon: 'success',
              title: 'Item removed from the cart',
              showConfirmButton: true,
              timer: 3000
            });
          })
          .catch((error) => {
            Swal.fire({
              //icon: 'error',
              title: 'Error removing item from the cart:',
              showConfirmButton: true,
              timer: 3000
            });
            console.error('Error removing item from the cart:', error);
          });
      }
    });
  };


  const [paytmentmodal, setpaymentmodal] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cod");
  const [showqr, setshowqr] = useState()



  const clearCart = (loggedinuid) => {
    // Reference to the user's cart
    const cartRef = ref(db, `users/${loggedinuid}/cart/`);

    // Remove the entire cart
    remove(cartRef)
      .then(() => {
        console.log('Cart cleared successfully!');
      })
      .catch((error) => {
        console.error('Error clearing the cart:', error);
      });
  };

  const buytheproduct = () => {
    Swal.fire({
      html: `
                <div class="p-5">
                    <div class="spinner-border text-dark" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            `,
      showConfirmButton: false,
      background: 'transparent',
      timer: 3000
    });
    const orderDate = new Date().toISOString();

    const productDetails = tableData;

    const orderDetails = {
      orderDate,
      items: productDetails,
      total: totalCartPrice,
      paymentMethod: selectedPaymentMethod,
      uid: loggedinuid,
      orderstatus: "Processing"
    };

    const ordersRef = ref(db, 'orders');
    push(ordersRef, orderDetails)
      .then(() => {
        // Successfully saved the order
        console.log('Order placed successfully!');
        clearCart(loggedinuid)
        setpaymentmodal(false)
        fetchfromcart()
        Swal.fire({
          //icon: 'success',
          title: 'Order Placed Successfully',
          showConfirmButton: true,
        });
        componentrender("Cart")
        setTimeout(() => {
          window.location.reload();
        }, 3000);

      })
      .catch((error) => {
        console.error('Error placing the order:', error);
      });
  };


  return (
    <div className='d-flex flex-column '>
      <section id="cart-container" class="container my-5">
        <table width="100%">
          <thead>
            <tr>
              <td>Remove</td>
              <td>Product Image</td>
              <td>Product Name</td>
              <td>Price</td>
              <td>Quantity</td>
              <td>Total</td>
            </tr>
          </thead>

          {filteredData.length > 0 ? (


            <tbody>
              {filteredData.map((productDetails) => (
                <tr key={productDetails.key}>
                  <td>
                    <i
                      onClick={() => deletecartitem(productDetails.key)}
                      className="fas fa-trash-alt"
                    ></i>
                  </td>
                  <td>
                    <img
                      src={productDetails.productImage}
                      alt={productDetails.productName}
                      className='img-fluid'
                    />
                  </td>
                  <td>{productDetails.productName}</td>
                  <td>₹ {productDetails.productPrice}</td>
                  <td>

                    <i
                      onClick={() => decrease(productDetails.key)}
                      className='bi bi-dash pe-3'
                      style={{ fontSize: "20px" }}></i>

                    <input
                      className="rounded border w-25 pl-1"
                      value={productDetails.quantity}
                      type="number"
                      onChange={(e) => handleQuantityChange(productDetails.key, e.target.value)}
                    />
                    <i
                      onClick={() => increase(productDetails.key)}
                      style={{ fontSize: "20px" }}
                      className='bi bi-plus ps-3'
                    ></i>
                  </td>
                  <td>₹ {productDetails.productPrice * productDetails.quantity}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="5" className="text-end py-3 pe-2">Total Cart Price:</td>
                <td>₹ {totalCartPrice}</td>
              </tr>
            </tbody>

          ) : (
            <p className='text-center mt-3'>No items found in the cart.</p>
          )}


        </table>

      </section>
      <section id="cart-bottom" class="container mb-5">
        <div class="row">
          <div class="total col-lg-12 col-md-12 col-12">
            <div>
              <h5>Cart Total</h5>
              <div class="d-flex justify-content-between">
                <h6>Subtotal</h6>
                <p>₹ {totalCartPrice}</p>
              </div>
              <hr class="second-hr" />
              <div class="d-flex justify-content-between">
                <h6>Total</h6>
                <p>₹ {totalCartPrice}</p>
              </div>
              <div className=''>
                <button class="mx-auto" onClick={() => setpaymentmodal(true)}>Proceed to checkout</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {paytmentmodal && (<div>
        <div>
          <div
            className="modal d-block border-0"
            role="dialog"
            style={{
              display: 'block',
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(3px)',
            }}
          >
            <div className="modal-dialog modal-fullscreen border-0 modal-dialog-centered">
              <div className="modal-content text-bg-green border-0 rounded-4">
                <div className="modal-body">
                  <div className='d-flex flex-row justify-content-between pb-3'>
                    <h5 className='animate__animated animate__fadeInDown text-center fw-bold'>
                      Order Confirmation
                    </h5>
                    <h5 className='animate__animated animate__fadeInUp' onClick={() => setpaymentmodal(false)}>
                      <i className="bi bi-x-circle-fill"></i>
                    </h5>
                  </div>

                  <div className='d-flex flex-column justify-content-between ' style={{ height: "100vh" }}>
                    <div>
                    </div>
                    <div>
                      <div className='container pb-5' >
                        <div className="row">

                          <div className=" col-lg-6 col-12">
                            <div className='row'>
                              <div className='col-md-6'>
                                <p className='animate__animated animate__fadeIn'>
                                  <span className='fw-bold'>First Name:</span>
                                  <br />
                                  {data.firstname}
                                </p>
                              </div>
                              <div className='col-md-6'>
                                <p className='animate__animated animate__fadeIn'>
                                  <span className='fw-bold'>Last Name:</span>
                                  <br />
                                  {data.lastname}
                                </p>
                              </div>
                              <div className='col-md-6'>
                                <p className='animate__animated animate__fadeIn'>
                                  <span className='fw-bold'>City:</span>
                                  <br />
                                  {data.city}
                                </p>
                              </div>
                              <div className='col-md-6'>
                                <p className='animate__animated animate__fadeIn'>
                                  <span className='fw-bold'>State:</span>
                                  <br />
                                  {data.state}
                                </p>
                              </div>
                              <div className='col-md-6'>
                                <p className='animate__animated animate__fadeIn'>
                                  <span className='fw-bold'>Address:</span>
                                  <br />
                                  {data.address}
                                </p>
                              </div>
                              <div className='col-md-6'>
                                <p className='animate__animated animate__fadeIn'>
                                  <span className='fw-bold'>Pincode:</span>
                                  <br />
                                  {data.pincode}
                                </p>
                              </div>
                              <div className='col-md-6'>
                                <p className='animate__animated animate__fadeIn'>
                                  <span className='fw-bold'>Phone:</span>
                                  <br />
                                  {data.phone}
                                </p>
                              </div>
                            </div>

                          </div>
                          <hr className="second-hr d-lg-none d-block" />
                          <div className=" col-lg-6 col-12">
                            <div>
                              <h5 className='text-coral'>Cart Total</h5>
                              <div className="d-flex justify-content-between">
                                <h6 className='text-coral'>Subtotal</h6>
                                <p>₹ {totalCartPrice}</p>
                              </div>
                              <div className="d-flex justify-content-between">
                                <h6 className='text-dark fw-bold'>Total</h6>
                                <p className='text-coral'>₹ {totalCartPrice}</p>
                              </div>
                            </div>
                            <hr className="second-hr" />

                            <div className=''>
                              <div className='mb-3'>
                                {showqr && (
                                  <div>
                                    <img src={qrcode} className='w-75 d-lg-block d-none' alt='QR Code' />
                                    <img src={qrcode} className='w-100 d-lg-none d-block' alt='QR Code' />
                                  </div>
                                )}
                              </div>

                              <div className="form-group mb-3">
                                <label htmlFor="paymentMethodDropdown" className="fw-bold ps-1 mb-2 text-dark">Payment Method:</label>
                                <select
                                  className="form-control"
                                  id="paymentMethodDropdown"
                                  value={selectedPaymentMethod}
                                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                >
                                  <option value="cod">Cash on Delivery (COD)</option>
                                  <option value="online">Online Payment</option>
                                </select>
                              </div>

                              <button className="mx-auto" onClick={() => buytheproduct()}>Proceed to checkout</button>
                            </div>
                          </div>
                          <div>
                          </div>
                          <div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>)
      }
      <div>

      </div>
    </div >
  );
};

export default Cart;
