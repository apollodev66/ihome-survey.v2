import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import './Login.css'; // Import the custom CSS file

import ihomeLogo from './img/ihome_logo.jpg';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://d15c-171-5-45-166.ngrok-free.app/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ CODE: username, USERPASS: password }),
      });
      
      const data = await response.json();

      if (data.status === 'ok') {
        // Save token and MYNAMETH in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('myNameth', data.mynameth);

        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: `Welcome, ${data.mynameth}! Redirecting to the dashboard...`,
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          navigate('/dashboard');
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: data.message,
        });
      }
    } catch (err) {
      console.error('Login error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text: 'An error occurred while processing your request.',
      });
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Row className="w-100">
        <Col md={8} lg={6} xl={4} className="mx-auto">
          <div className="login-form-container shadow-sm p-4">
            <div className="text-center mb-4">
              <img 
                src={ihomeLogo} 
                alt="Ihome Logo" 
                className="logo-img mb-3" 
              />
              <h1>IHOME | Chavanich</h1>
            </div>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formUsername" className="mb-3">
                <Form.Control
                  type="text"
                  placeholder=" "
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <Form.Text className="text-muted">
                  รหัสพนักงาน
                </Form.Text>
              </Form.Group>
              <Form.Group controlId="formPassword" className="mb-3">
                <Form.Control
                  type="password"
                  placeholder=" "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Form.Text className="text-muted">
                  รหัสผ่าน
                </Form.Text>
              </Form.Group>
              <Button variant="danger" type="submit" className="w-100">
                Login
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
