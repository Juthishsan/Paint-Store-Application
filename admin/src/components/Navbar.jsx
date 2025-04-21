import React from 'react';
import Swal from 'sweetalert2';
import { auth } from '../firebase';

const Navbar = ({ componentrender, component }) => {
    const logout = async () => {
        Swal.fire({
            html: `
        <div className="p-5">
          <div className="spinner-border text-dark" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      `,
            showConfirmButton: false,
            background: 'transparent',
        });

        try {
            await auth.signOut();
            Swal.fire({
                icon: 'success',
                title: 'Logout Successful',
                showConfirmButton: true,
                confirmButtonColor: '#212529',
            });
        } catch (error) {
            // Handle error
        }
    };

    return (
        <div className="">
            <div className="d-lg-block d-none">
                <div className="vh-100 d-flex flex-column justify-content-between py-4 pe-3 border-end ps-4 position-fixed">
                    <div className="d-flex flex-column gap-4">
                        <img className="" src="Images/SVP logo 2.png" width="150px" alt="Logo" />
                        <h5 className={` ${component === 'Products' ? 'text-coral' : ''}`} onClick={() => componentrender('Products')}>
                            Products
                        </h5>
                        <h5 className={` ${component === 'Orders' ? 'text-coral' : ''}`} onClick={() => componentrender('Orders')}>
                            Orders
                        </h5>
                        <h5 className={` ${component === 'Users' ? 'text-coral' : ''}`} onClick={() => componentrender('Users')}>
                            Users
                        </h5>
                        <h5 className={` ${component === 'Admins' ? 'text-coral' : ''}`} onClick={() => componentrender('Admins')}>
                            Admins
                        </h5>
                        <h5 className={` ${component === 'Profile' ? 'text-coral' : ''}`} onClick={() => componentrender('Profile')}>
                            Profile
                        </h5>
                    </div>
                    <div>
                        <button className="" onClick={() => logout()}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>

        
        </div>
    );
};

export default Navbar;
