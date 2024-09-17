import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Footer.css'; // นำเข้าไฟล์ CSS สำหรับ Footer

const Footer = () => {
  return (
    <footer className="bg-light text-center text-lg-start mt-auto">
      <div className="bg-dark text-light py-3 footer-content">
        <p className="mb-0 footer-text">&copy; {new Date().getFullYear()} IHOME Chavanich. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
