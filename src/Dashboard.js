import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from './components/Table';
import NavBar from './components/Navbar';
import Footer from './components/Footer';
import Swal from 'sweetalert2'; // นำเข้า SweetAlert2
import './App.css';

const Dashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [myNameth, setMyNameth] = useState(''); 
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedNameth = localStorage.getItem('myNameth');

    if (!token) {
      Swal.fire({
        title: 'Unauthorized',
        text: 'You need to log in to access this page.',
        icon: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      }).then(() => {
        navigate('/');
      });
    } else {
      setIsLoggedIn(true); 
      setMyNameth(storedNameth || '');
    }
  }, [navigate]);

  return (
    <div id="root">
      <NavBar />
      <div className="content container mt-4">
        {isLoggedIn ? (
          <>
            <p>สวัสดี, {myNameth}!</p> 
            <Table />
          </>
        ) : (
          <p>Please log in to view the content.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
