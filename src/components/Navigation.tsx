import React from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import { Link } from "react-router-dom"

export default function Navigation() {
  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
          <Link to="/" style={{alignSelf: 'center', color: '#4d4d4d', padding: 5}}>
              Home
            </Link>
            <Link to="/in-progress" style={{alignSelf: 'center', color: '#4d4d4d', padding: 5}}>
              Your Keys
            </Link>
            {/* <Link to="/recent" style={{alignSelf: 'center', color: '#4d4d4d', padding: 5}}>
              Recent
            </Link> */}
            <Link to="/update-profile" style={{alignSelf: 'center', color: '#4d4d4d', padding: 5}}>
              Profile
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  )
}
