import React from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonRunning } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2"; // นำเข้า SweetAlert2

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        Swal.fire({
          title: "Logged out!",
          text: "You have been successfully logged out.",
          icon: "success",
          timer: 1000,
          showConfirmButton: false,
        }).then(() => {
          navigate("/");
        });
      }
    });
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand>IHOME | Chavanich</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/dashboard">
            Dashboard
          </Nav.Link>
          {/* <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
          <Nav.Link as={Link} to="/settings">Settings</Nav.Link> */}
        </Nav>
        <Button variant="outline-light" onClick={handleLogout}>
          <FontAwesomeIcon icon={faPersonRunning} /> Logout
        </Button>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
