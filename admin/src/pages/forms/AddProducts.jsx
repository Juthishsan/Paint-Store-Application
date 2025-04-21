
import React, { useRef, useState } from 'react'
import Swal from 'sweetalert2'
import { db, storage } from '../../firebase';
import { ref as reference, uploadBytes, getDownloadURL } from 'firebase/storage'
import { push, ref } from 'firebase/database';


function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}



const AddProducts = ({ setaddproduct, getproducts }) => {
    const productname = useRef()
    const productprice = useRef()
    const producttype = useRef()
    const productrank = useRef()
    const productinfo = useRef()
    const [file, setFiles] = useState([]);


    const handleFileChange = (e) => {
        const selectedFiles = e.target.files[0];
        setFiles(selectedFiles);
    };



    const handleSubmit = async (e) => {
        Swal.fire({
            html: `
              <div className="" >
                <div className="spinner-border text-dark" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            `,
            showConfirmButton: false,
            background: 'transparent',
        });
        e.preventDefault();
        const filename = generateRandomString(15);
        const imageRef = reference(storage, 'productimages/' + filename);
        try {
            await uploadBytes(imageRef, file);
            const downloadURL = await getDownloadURL(imageRef);
            const productpath = ref(db, 'products');
            const product = {
                name: productname.current.value,
                price: productprice.current.value,
                rank: productrank.current.value,
                type: producttype.current.value,
                info: productinfo.current.value,
                imageURL: downloadURL,
            };
            push(productpath, product);


            Swal.fire({
                icon: 'success',
                title: 'Product Upload Successful',
                showConfirmButton: true,
                confirmButtonColor: 'black',
            });
            productname.current.value = ""
            productrank.current.value = ""
            producttype.current.value = ""
            productprice.current.value = ""
            productinfo.current.value = ""
            setaddproduct()
            getproducts()
        } catch (error) {
            console.error("Error uploading file:", error);
            Swal.fire({
                icon: 'error',
                title: 'Product Upload UnSuccessful',
                showConfirmButton: true,
                confirmButtonColor: 'black',
            });
        }
    };





    return (
        <div>
            <form onSubmit={handleSubmit} className=''>
                <div className='row'>

                    <div className='col-md-12 mb-3'>
                        <label className='mb-2 fw-bold'>Product Image</label>
                        <input accept="image/*"
                            type="file" onChange={handleFileChange} className="input-field" style={{ paddingTop: "12px" }} required id="image" />
                    </div>
                    <div className='col-md-12 mb-3'>
                        <label className='mb-2 fw-bold'>Product Name</label>
                        <input className='input-field' placeholder='Product Name' ref={productname} required />
                    </div>
                    <div className='col-md-12 mb-3'>
                        <label className='mb-2 fw-bold'>Product Price</label>
                        <input className='input-field' placeholder='Product Price' ref={productprice} required />
                    </div>
                    <div className='col-md-12 mb-3'>
                        <label className='mb-2 fw-bold'>Product Type</label>
                        <select required className='input-field ' ref={producttype} >
                            <option value="interior" >Interior Paint</option>
                            <option value="exterior" >Exterior Paint</option>
                            <option value="wood" >Wood Paint</option>
                        </select>
                    </div>
                    <div className='col-md-12 mb-4 fw-bold'>
                        <label className='mb-2'>Product Rank</label>
                        <input className='input-field' placeholder='Product Rank' ref={productrank} required />
                    </div>
                    <div className='col-md-12 mb-4 fw-bold'>
                        <label className='mb-2'>Product Description</label>
                        <textarea className='input-field pt-2' ref={productinfo} required rows={5} ></textarea>
                    </div>
                    <div className='col-md-12 mb-4'>
                        <button className='w-100 submit' type='submit'>Submit</button>
                    </div>

                </div>
            </form>

        </div>
    )
}

export default AddProducts