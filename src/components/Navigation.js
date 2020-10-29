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

    let active = [true, false, false];

    function setActive(link) {
        switch (link) {
            case 0:
                active[0] = true;
                active[1] = false;
                active[2] = false;
                break;
            case 1:
                active[0] = false;
                active[1] = true;
                active[2] = false;
                break;
            case 2:
                active[0] = false;
                active[1] = false;
                active[2] = true;
                break;
        }
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
                            <NavLink active={active[0]} tag={Link} to="/" onClick={setActive(0)}>Home</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink active={active[1]} tag={Link} to="/map" onClick={setActive(1)}>Map</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink active={active[2]} tag={Link} to="/about" onClick={setActive(2)}>About</NavLink>
                        </NavItem>
                    </Nav>

                    <NavbarText>{props.auth}</NavbarText>
                </Collapse>
            </Navbar>
        </div>
    );
}

export default Navigation;
