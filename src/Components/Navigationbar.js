import { Navbar, Nav } from 'react-bootstrap';

import { Link } from "react-router-dom"

export default function Navigationbar() {
  return (<div>

    <Navbar bg="dark" variant="dark">
      <div class="navigationBar">
        <Navbar.Brand >
        <Link to={{pathname: `/all-banks`}}>
          All Banks</Link></Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link >
            <Link to={{pathname: `/favourites`}}>
            Favourites</Link></Nav.Link>
                </Nav>
                </div>
              </Navbar>
        </div>)
}