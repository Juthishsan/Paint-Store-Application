import React, { useEffect, useState } from 'react'
import Interior from './Products/Interior';
import Exterior from './Products/Exterior';
import Woodpaints from './Products/Woodpaints';

const Products = ({ productref, componentrender }) => {
    const [component, setcomponent] = useState("Interior")

    const render = () => {
        switch (component) {
            case "Interior":
                return <Interior componentrender={componentrender}/>;
            case "Exterior":
                return <Exterior  componentrender={componentrender}/>;
            case "WoodPaints":
                return <Woodpaints componentrender={componentrender}/>;
        }
    }


    useEffect(() => {
        // Use the productref prop to set the initial component once, when the component mounts
        if (productref === "Interior") {
            setcomponent("Interior");
        } else if (productref === "Exterior") {
            setcomponent("Exterior");
        } else if (productref === "WoodPaints") {
            setcomponent("WoodPaints");
        }
    }, [productref]);

    return (
        <div className=''>
            <div className="container text-center py-2">
                <h3>Our Featured Products</h3>
                <hr className="mx-auto" />
                <p>Here you can check our new products with fair price</p>
            </div>
            <div className='d-flex flex-row justify-content-center container '>
                <div className='d-flex flex-row justify-content-center border rounded pt-2'>
                <p className={` p-2 fw-regular mx-2 ${component === "Interior" ? "text-coral" : ""}`} onClick={() => setcomponent("Interior")}>Interior Paints</p> <p className={` p-2 fw-regular mx-2 ${component === "Exterior" ? "text-coral" : ""}`} onClick={() => setcomponent("Exterior")}>Exterior Paints</p>       <p className={` p-2 fw-regular mx-2 ${component === "WoodPaints" ? "text-coral" : ""}`} onClick={() => setcomponent("WoodPaints")}>Wood Paints</p>
                </div>
            </div>

            <div className='container mt-3'>
                {render()}
            </div>






        </div>
    )
}

export default Products