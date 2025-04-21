import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { get, push, ref, set } from 'firebase/database';
import Swal from 'sweetalert2';
import { onAuthStateChanged } from 'firebase/auth';

const Exterior = () => {
    const [tableData, setTableData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);






    useEffect(() => {
        Swal.fire({
            html: `
                <div class="p-5" >
                  <div class="spinner-border text-dark" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
              `,
            showConfirmButton: false,
            background: 'transparent',
            timer: 3000
        });
        const dataRef = ref(db, '/products');
        get(dataRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const dataObject = snapshot.val();
                    const dataKeys = Object.keys(dataObject);

                    // Filter and map dataEntries with type "exterior"
                    const dataEntries = dataKeys
                        .map((key) => ({
                            key,
                            ...dataObject[key],
                        }))
                        .filter((entry) => entry.type === "exterior")
                        .sort((a, b) => a.rank - b.rank);

                    setTableData(dataEntries);
                    setFilteredData(dataEntries);

                }
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);




    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                setloggedinuid(uid)

                // Reference to the user's data within the Realtime Database
                const userRef = ref(db, 'users/' + uid);

                // Check if the user data exists in the Realtime Database
                get(userRef)
                    .then((snapshot) => {
                        if (snapshot.exists()) {
                            setloggedinuid(uid);
                            const userData = snapshot.val();


                        } else {

                        }
                    })
                    .catch((error) => {
                        console.error('Error fetching Realtime Database data:', error);
                    });
            } else {

            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const [loggedinuid, setloggedinuid] = useState(null);
    const addtocart = (productID) => {
        if (loggedinuid) {

            push(ref(db, 'users/' + loggedinuid + '/cart'), {
                productID,
                quantity: 1,
            });
            Swal.fire({
                //icon: 'success',
                title: 'Successfully Added to the cart',
                showConfirmButton: true,
                timer: 3000
            });
        }
        else {
            Swal.fire({
                //icon: 'warning',
                title: 'Log in to use cart',
                showConfirmButton: true,
                timer: 3000
            });

        }
    }


    const [bigmodal, setbigmodal] = useState(false);
    const [ModalProduct, setModalProduct] = useState(false);
    const openbigmodal = (productID) => {

        const selectedProduct = tableData.find((product) => product.key === productID);

        setbigmodal(true);
        setModalProduct(selectedProduct);
    };

    return (
        <div>
            <section id="Featured" className="my-5 pb-5">
                <div className="row mx-auto container-fluid">
                    {tableData.map((entry) => (
                        <div className="product text-center col-lg-3 col-md-4 col-12" key={entry.key}>
                            <img
                                className="mb-3"
                                src={entry.imageURL}
                                style={{ height: "40vh", width: "100%" }}
                                alt={entry.name}
                            />
                            <h5 className="p-name">{entry.name}</h5>
                            <h4 className="p-price">{`₹${entry.price} `}</h4>


                            <br />
                            <button className="buy-btn my-2 me-2" onClick={() => addtocart(entry.key)}>Add to Cart</button>
                            <button className="buy-btn my-2" onClick={() => openbigmodal(entry.key)}>More Details</button>
                        </div>
                    ))}
                </div>
            </section>








            {bigmodal && (<div>

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
                        <div className="modal-dialog modal-xl border-0 modal-dialog-centered ">
                            <div className="modal-content text-bg-green border-0 rounded-4">
                                <div className="modal-body" >
                                    <div className='d-flex flex-row justify-content-between pb-3'>

                                        <h5 className='animate__animated animate__fadeInDown text-center fw-bold display-6'>
                                            Product Info
                                        </h5>
                                        <h5 className='animate__animated animate__fadeInUp' onClick={() => setbigmodal(false)}>
                                            <i className="bi bi-x-circle-fill"></i>
                                        </h5>
                                    </div>
                                    <div>


                                        <div>
                                            <section class="sproduct container mb-3 ">
                                                <div class="row mt-5">
                                                    <div class="col-lg-5 col-md-12 col-12">
                                                        <img class="img-fluid w-100" src={ModalProduct.imageURL} id="MainImg"
                                                            alt="" />
                                                    </div>
                                                    <div class="col-lg-6 col-md-12 col-12">

                                                        <div className='d-flex flex-row justify-content-between mt-3'>
                                                            <h3> {ModalProduct.name}</h3>
                                                            <h3>₹{ModalProduct.price}</h3>
                                                        </div>
                                                        <div className='my-2 text-end'>
                                                            <button class="buy-btn btn-lg" onClick={() => addtocart(ModalProduct.key)}>Add to cart</button>

                                                        </div>
                                                        <h4 class="mt-4">Product Description</h4>
                                                        <span>{ModalProduct.info}</span>
                                                    </div>

                                                </div>
                                            </section>
                                        </div>
                                    </div>
                                    <div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)}
        </div>

    )
};

export default Exterior;
