import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import AddProducts from './forms/AddProducts';
import { db, storage } from '../firebase';
import { child, get, ref, remove, update } from 'firebase/database';
import { deleteObject, ref as reference } from 'firebase/storage';
import Swal from 'sweetalert2';

const Products = () => {
  const [addproduct, setaddproduct] = useState(false)
  const [editproduct, seteditproduct] = useState(false)
  const [tableData, setTableData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [editdata, seteditdata] = useState({})
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const openModal = (rowData) => {
    setSelectedRowData(rowData);
    setModalOpen(true);
  };



  const [selectedType, setSelectedType] = useState(''); // Initialize wi

  useEffect(() => {

    const dataRef = ref(db, '/products');
    get(dataRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const dataObject = snapshot.val();
          const dataKeys = Object.keys(dataObject);
          const dataEntries = dataKeys.map((key) => ({
            key,
            ...dataObject[key],
          }));
          dataEntries.sort((a, b) => a.rank - b.rank);
          setTableData(dataEntries);
          setFilteredData(dataEntries);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);



  const getproducts = () => {
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
      timer: 3000
    });
    const dataRef = ref(db, '/products');
    get(dataRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const dataObject = snapshot.val();
          const dataKeys = Object.keys(dataObject);
          const dataEntries = dataKeys.map((key) => ({
            key,
            ...dataObject[key],
          }));
          dataEntries.sort((a, b) => a.rank - b.rank);
          setTableData(dataEntries);
          setFilteredData(dataEntries); // Initially, set filteredData to all data
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }

  const handleEdit = (row) => {

    seteditproduct(true)
    seteditdata(row)
  };

  const handleDelete = (key, imageURL) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this product!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
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

        console.log(key, imageURL)
        const productImageRef = reference(storage, imageURL);

        deleteObject(productImageRef).then(() => {
          deleteProduct(key)
        }).catch((error) => {
          Swal.fire('Deleted!', 'The product has been deleted.', 'error');
        });
      }
    });
  };


  const deleteProduct = (key) => {
    const updatedData = filteredData.filter((item) => item.key !== key);
    setFilteredData(updatedData);
    const productRef = ref(db, `products/${key}`);
    remove(productRef)
    Swal.fire('Deleted!', 'The product has been deleted.', 'success');
  };


  const columns = [
    {
      name: 'Rank',
      selector: 'rank',
      sortable: true,
    },

    {
      name: 'Image',
      cell: (row) => <img src={row.imageURL} alt="Product" className='img-fluid' height={100} width={100} loading='lazy' />,
    },
    {
      name: 'Type',
      selector: 'type',
    },
    {
      name: 'Name',
      selector: 'name',
    },

    {
      name: 'Price',
      selector: (row) => `₹ ${row.price}`,
      sortable: true,
    },
    {
      name: 'Action',
      cell: (row) => (
        <div className='d-flex flex-row'>
          <i className='bi bi-pencil-square pe-3' onClick={() => handleEdit(row)}></i>
          <i className='bi bi-trash-fill px-3' onClick={() => handleDelete(row.key, row.imageURL)}></i>
          <i className='bi bi-eye-fill px-3' onClick={() => openModal(row)}></i>
        </div>
      ),
    },

  ];

  const paginationOptions = {
    rowsPerPageText: 'Rows per page:',
    rangeSeparatorText: 'of',
  };


  const handleSearch = (searchQuery, selectedType) => {
    let filteredItems = tableData;

    if (searchQuery) {
      filteredItems = filteredItems.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedType) {
      filteredItems = filteredItems.filter((item) =>
        item.type.toLowerCase() === selectedType.toLowerCase()
      );
    }

    setFilteredData(filteredItems);
  };



  const handleEditSave = (e) => {
    e.preventDefault()
    console.log(editdata)

    const { key, ...updateddetails } = editdata;
    const productRef = ref(db, `products/${editdata.key}`);
    updateddetails.name = editdata.name
    updateddetails.rank = editdata.rank
    updateddetails.price = editdata.price
    updateddetails.type = editdata.type
    updateddetails.info = editdata.info
    update(productRef, updateddetails).then(() => {
      Swal.fire('Updated', 'The product has been updated', 'success');
      seteditdata(null);
      seteditproduct(!editproduct)
      getproducts()
    })
      .catch((error) => {
        console.error('Error updating product:', error);
        Swal.fire('Error', 'An error occurred while updating the product', 'error');
      });
  }
  return (
    <div>

      <div className='sticky-top'>
        <div className='d-flex flex-row justify-content-between'>
          <div className='fw-bold'>
            Products
          </div>
          <div>
            <button className='' onClick={() => setaddproduct(!addproduct)}>Add Products</button>
          </div>
        </div>
        <div className="container mt-4 mb-2">
          <div className='row'>
            <div className='col-md-6'>
              <div className='input-group'>
                <span className='input-group-text'><i className='bi bi-search'></i></span>
                <input
                  type="text"
                  placeholder="Search product name..."
                  className='form-control'
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    handleSearch(e.target.value, selectedType);
                  }}
                />
              </div>

            </div>
            <div className='col-md-6 m-lg-0 my-3'>
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  handleSearch(searchText, e.target.value);
                }}
                className='form-select' // Apply the Bootstrap form-select class here
              >
                <option value="">All Types</option>
                <option value="Interior">Interior</option>
                <option value="Exterior">Exterior</option>
                <option value="Wood">Wood</option>
              </select>
            </div>
          </div>



        </div>

      </div>

      <div className='container mt-4 mb-2'>
        <div className='row'>
          <div className='col-md-12'>
            <div style={{ overflowX: 'auto', height: "70vh" }}>
              <DataTable
                className="table table-bordered table-striped "
                columns={columns}
                data={filteredData}
                pagination
                paginationComponentOptions={paginationOptions}
                highlightOnHover
                pointerOnHover
                striped
                paginationRowsPerPageOptions={[10, 25, 50, 100]}
              />
            </div>
          </div>
        </div>
      </div>


      {addproduct && (
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
            <div className="modal-dialog modal-md border-0 modal-dialog-centered ">
              <div className="modal-content text-bg-green border-0 rounded-4">
                <div className="modal-body" >
                  <div className='d-flex flex-row justify-content-between pb-3'>

                    <h5 className='animate__animated animate__fadeInDown text-center fw-bold'>
                      Add Product
                    </h5>
                    <h5 className='animate__animated animate__fadeInUp ' onClick={() => setaddproduct(!addproduct)}>
                      <i className="bi bi-x-circle-fill"></i>
                    </h5>
                  </div>
                  <div >
                    <AddProducts getproducts={getproducts} setaddproduct={setaddproduct} />
                  </div>
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {editproduct && (
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
            <div className="modal-dialog modal-md border-0 modal-dialog-centered ">
              <div className="modal-content text-bg-green border-0 rounded-4">
                <div className="modal-body" >
                  <div className='d-flex flex-row justify-content-between pb-3'>

                    <h5 className='animate__animated animate__fadeInDown text-center fw-bold'>
                      Add Product
                    </h5>
                    <h5 className='animate__animated animate__fadeInUp ' onClick={() => seteditproduct(!editproduct)}>
                      <i className="bi bi-x-circle-fill"></i>
                    </h5>
                  </div>
                  <div>
                    <form>
                      <div className="mb-3">
                        <label htmlFor="name" className="form-label fw-bold">Product Name</label>
                        <input
                          type="text"
                          className="input-field"
                          id="name"
                          value={editdata.name}
                          onChange={(e) => seteditdata({ ...editdata, name: e.target.value })}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="type" className="form-label fw-bold">Product Type</label>
                        <select
                          className="input-field"
                          id="type"
                          value={editdata.type}
                          onChange={(e) => seteditdata({ ...editdata, type: e.target.value })}
                        >
                          <option value="interior">Interior</option>
                          <option value="exterior">Exterior</option>
                          <option value="wood">Wood</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="price" className="form-label fw-bold">Product Price</label>
                        <input
                          type="number"
                          className="input-field"
                          id="price"
                          value={editdata.price}
                          onChange={(e) => seteditdata({ ...editdata, price: e.target.value })}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="rank" className="form-label fw-bold">Product Rank</label>
                        <input
                          type="number"
                          className="input-field"
                          id="rank"
                          value={editdata.rank}
                          onChange={(e) => seteditdata({ ...editdata, rank: e.target.value })}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="rank" className="form-label fw-bold">Product Description</label>
                        <textarea
                          type="number"
                          className="input-field"
                          id="info"
                          value={editdata.info}
                          onChange={(e) => seteditdata({ ...editdata, info: e.target.value })}
                        />
                      </div>
                      <button className="submit my-3" onClick={handleEditSave}>Save</button>
                    </form>
                  </div>
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}




      {isModalOpen && selectedRowData && (
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
            <div className="modal-dialog modal-md border-0 modal-dialog-centered ">
              <div className="modal-content text-bg-green border-0 rounded-4">
                <div className="modal-body" >
                  <div className='d-flex flex-row justify-content-between pb-3'>

                    <h5 className='animate__animated animate__fadeInDown text-center fw-bold'>
                      Product Info
                    </h5>
                    <h5 className='animate__animated animate__fadeInUp ' onClick={() => setModalOpen(false)}>
                      <i className="bi bi-x-circle-fill"></i>
                    </h5>
                  </div>
                  <div>
                    <div className='container border px-3 rounded-3'>
                      <div className='row'>
                        <div className='col-md-12 d-flex flex-row justify-content-center pb-3'>
                          <img className='img-fluid' src={selectedRowData.imageURL} width={200} loading='lazy' />
                        </div>
                        <div className='col-md-6'>
                          <label className='fw-bold'>Product ID:</label>
                          <p> {selectedRowData.key}</p>
                        </div>
                        <div className='col-md-6'>
                          <label className='fw-bold'>Product Name:</label>
                          <p> {selectedRowData.name}</p>
                        </div>
                        <div className='col-md-6'>
                          <label className='fw-bold'>Product Price:</label>
                          <p>₹ {selectedRowData.price}</p>
                        </div>
                        <div className='col-md-6'>
                          <label className='fw-bold'>Product Type:</label>
                          <p> {selectedRowData.type}</p>
                        </div>
                        <div className='col-md-6'>
                          <label className='fw-bold'>Product Description:</label>
                          <p> {selectedRowData.info}</p>
                        </div>

                      </div>
                    </div>

                  </div>
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Products