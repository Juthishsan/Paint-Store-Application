import React from 'react'
import { onValue, ref } from 'firebase/database';

const Contact = () => {
  return (
    <div className='container pb-5'>
      <div className='row'>
        <div className='col-12 col-lg-6'>
          <section id="contact-details" className="section-p1 container">
            <div className="details">
              <span className='fw-bold'>GET IN TOUCH</span>
              <h2>Visit our store or contact us today</h2>
              <h3>Location</h3>
              <div>
                <li>
                  <i className="fa fa-map" />
                  <p>136 B, Karur Byepass Road, Moolappalayam, Erode - 638002.</p>
                </li>
                <li>
                  <i className="fa fa-envelope" />
                  <p>venkateshwarapaints3@gmail.com</p>
                </li>
                <li>
                  <i className="fa fa-phone" />
                  <p>+91 99422 25677 +91 70109 35545</p>
                </li>
                <li>
                  <i className="fa fa-clock" />
                  <p>Monday to Saturday : 9:00 AM - 7:00 PM </p>
                </li>
              </div>
            </div>
          </section>
        </div>
        <div className='col-12 col-lg-6'>
          <div className="map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d62592.97800205479!2d77.7208434!3d11.330243!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba96587c17005ff%3A0x4d2943c62190e8a5!2sSri%20Venkateswara%20Paints!5e0!3m2!1sen!2sin!4v1697308572351!5m2!1sen!2sin"
              className='w-100'
              height={450}
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>



    </div>
  )
}

export default Contact