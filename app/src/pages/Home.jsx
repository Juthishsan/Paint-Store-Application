import React from 'react'
import ExteriorFrontpage from './Products/ExteriorFrontPage';
import WoodpaintFrontPage from './Products/WoodpaintFrontPage';
import InteriorFrontPage from './Products/InteriorFrontPage';

const Home = ({ fitcomponent }) => {

  const GoToExterior = () => {
    fitcomponent("Products", "Exterior");
  };
  const GoToInterior = () => {
    fitcomponent("Products", "Interior");
  };
  const GoToWoods = () => {
    fitcomponent("Products", "WoodPaints");
  };

  return (
    <div>
      <>
        <section id="home">
          <div class="container">
            <h2> <span>Welcome to Sri Venkateshwara Paints</span> <br /> Your Online Paint Store</h2>
            <p>Get your favorite paint delivered to your doorstep.</p>
            <button onClick={GoToInterior}>Explore Now</button>
          </div>
        </section>


        <section id="new" className="w-100 container-fluid mt-4">
          <div className="row">
          <div className="one col-lg-4 col-md-12 col-12">
              <div className="image-container position-relative">
                <img className="img-fluid same-height" src="Images/interior.png" alt="" />

                <div className="centered">
                  <h2>Interior Paints</h2>
                  <button className="btn btn-dark" onClick={GoToInterior}>Buy Now</button>
                </div>
              </div>
            </div>
            <div className="one col-lg-4 col-md-12 col-12">
              <div className="image-container position-relative">
                <img className="img-fluid same-height" src="Images/exterior.png" alt="" />
                <div className="centered">
                  <h2>Exterior Paints</h2>
                  <button className="btn btn-dark" onClick={GoToExterior}>Buy Now</button>
                </div>
              </div>
            </div>
            
            <div className="one col-lg-4 col-md-12 col-12">
              <div className="image-container position-relative">
                <img className="img-fluid same-height" src="Images/Wood.png" alt="" />

                <div className="centered">
                  <h2>Wood Paints</h2>
                  <button className="btn btn-dark" onClick={GoToWoods}>Buy Now</button>
                </div>
              </div>
            </div>

          </div>
        </section>

        <section id="Featured" className="my-5 pb-5">


          <div className="container text-center mt-5 py-5">
            <h3>Featured Interior Paints</h3>
            <hr className="mx-auto" />
            <p>Best Selling Interior Paints</p>
          </div>
          <InteriorFrontPage />
          <div className="container text-center mt-5 py-5">
            <h3>Featured Exterior Paints</h3>
            <hr className="mx-auto" />
            <p>Best Selling Exterior Paints</p>
          </div>
          <ExteriorFrontpage />
          <div className="container text-center mt-5 py-5">
            <h3>Featured Wood Paints</h3>
            <hr className="mx-auto" />
            <p>Best Selling Wood Paints</p>
          </div>
          <WoodpaintFrontPage />
        </section>
      </>

    </div>
  )
}

export default Home