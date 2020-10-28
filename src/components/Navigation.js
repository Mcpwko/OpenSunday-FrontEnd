/**
 * Javascript file for handling the navigation bar
 */
import React, {useEffect, useState} from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    NavbarText
} from 'reactstrap';
import {Link} from "react-router-dom";
import logo from '../assets/Logo.png';


const Navigation = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    function setActive(link) {

    }

    return (
        <div id="navigationBar">
            <Navbar color="dark" dark expand="md">
                <NavbarBrand href="/">
                    <img src={logo} alt="Logo"></img>
                </NavbarBrand>
                <NavbarToggler onClick={toggle}/>
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="mr-auto" navbar>
                        <NavItem>
                            <NavLink tag={Link} to="/" activeClassName="active">Home</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} to="/map" activeClassName="active">Map</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} to="/about" activeClassName="active">About</NavLink>
                        </NavItem>
                    </Nav>

                    <NavbarText>{props.auth}</NavbarText>
                </Collapse>
            </Navbar>
        </div>
    );
}

export default Navigation;
