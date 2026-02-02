import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import {
  FaWhatsapp,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
} from "react-icons/fa";
import "./Contact.css";

const Contact = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const phoneNumber = "+94712653157"; // WhatsApp number to receive messages

  // ✅ Scroll to top on page load (desktop + mobile)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !message) {
      alert("Please fill in all fields.");
      return;
    }
    const whatsappMessage = `Hello, my name is ${name}.%0A%0A${message}`;
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      whatsappMessage,
    )}`;
    window.open(whatsappURL, "_blank");
  };

  return (
    <div className="contact-page">
      <Navbar />

      <main className="contact-main">
        <div className="contact-container">
          {/* Contact Info */}
          <div className="contact-info">
            <h1>Get In Touch</h1>
            <p>
              We'd love to hear from you! Fill out the form or contact us
              directly via WhatsApp or email.
            </p>

            <div className="contact-details">
              <p>
                <FaMapMarkerAlt className="icon" /> No.247, Veyangoda Rd,
                Urapola
              </p>
              <p>
                <FaWhatsapp className="icon" /> (+94) 712653157
              </p>
              <p>
                <FaEnvelope className="icon" /> sunimalpremaratne@gmail.com
              </p>
            </div>

            <div className="social-links">
              <a
                href="https://www.facebook.com/profile.php?id=61582691996358&mibextid=ZbWKwL"
                target="_blank"
                rel="noreferrer"
              >
                <FaFacebook />
              </a>
            </div>

            {/* Map Embed */}
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.146324052157!2d80.1352139747589!3d7.109035892894425!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3038ebe2497b3%3A0x3cc019a3e05ba32a!2sISIRO%20Steel%20Industries!5e0!3m2!1sen!2slk!4v1770033173190!5m2!1sen!2slk"
                width="100%"
                height="200"
                style="border:0;"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form">
            <h2 className="form-topic">
              <FaWhatsapp className="whatsapp-icon" />
              Connect With Us via <span>WhatsApp</span>
            </h2>

            <form onSubmit={handleSubmit}>
              <label>
                Name
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>

              <label>
                Message
                <textarea
                  placeholder="Enter your message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </label>

              <button type="submit">Send Message</button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
