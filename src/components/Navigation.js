import React, {useContext, useEffect, useState} from 'react';
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

/** Navigation bar */
const Navigation = (props) => {
    const [acn1, setAcn1] = useState('active') // assumes link 1 is default active
    const [acn2, setAcn2] = useState('')
    const [acn3, setAcn3] = useState('')
    const [acn4, setAcn4] = useState('')

    const startChangeVis = id => {
        setAcn1('')
        setAcn2('')
        setAcn3('')
        setAcn4('')
        if (id === 'a') setAcn1('active')
        else if (id === 'b') setAcn2('active')
        else if (id === 'c') setAcn3('active')
        else if (id === 'd') setAcn4('active')
    }

    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    return (
        <div id="navigationBar">
            <Navbar color="dark" dark expand="md">
                <NavbarBrand tag={Link} to="/">
                    <img src={logo} alt="Logo"></img>
                </NavbarBrand>
                <NavbarToggler onClick={toggle}/>
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="mr-auto" navbar>
                        <NavItem>
                            <NavLink id="a" tag={Link} to="/" onClick={() => {
                                startChangeVis('a')
                            }} className={acn1}>Home</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink id="b" tag={Link} to="/map" onClick={() => {
                                startChangeVis('b')
                            }} className={acn2}>Map</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink id="c" tag={Link} to="/places" onClick={() => {
                                startChangeVis('c')
                            }} className={acn3}>Places</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink id="d" tag={Link} to="/about"
                                     onClick={() => {
                                         startChangeVis('d')
                                     }} className={acn4}>About</NavLink>
                        </NavItem>
                    </Nav>

                    <NavbarText>{props.auth}</NavbarText>
                </Collapse>
            </Navbar>
        </div>
    );
}


export default Navigation;
