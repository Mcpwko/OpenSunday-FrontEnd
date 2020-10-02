import React, {useEffect, useState} from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavbarText
} from 'reactstrap';

const Navigation = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    return (
        <div>
            <Navbar color="dark" dark expand="md">
                <NavbarBrand href="/">OpenSunday</NavbarBrand>
                <NavbarToggler onClick={toggle}/>
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="mr-auto" navbar>
                        <NavItem>
                            <NavLink href="/">Home</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/map">Map</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/activities">All activities</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/about">About</NavLink>
                        </NavItem>
                        {/*<UncontrolledDropdown nav inNavbar>*/}
                        {/*    <DropdownToggle nav caret>*/}
                        {/*        Options*/}
                        {/*    </DropdownToggle>*/}
                        {/*    <DropdownMenu right>*/}
                        {/*        <DropdownItem>*/}
                        {/*            Option 1*/}
                        {/*        </DropdownItem>*/}
                        {/*        <DropdownItem>*/}
                        {/*            Option 2*/}
                        {/*        </DropdownItem>*/}
                        {/*        <DropdownItem divider />*/}
                        {/*        <DropdownItem>*/}
                        {/*            Reset*/}
                        {/*        </DropdownItem>*/}
                        {/*    </DropdownMenu>*/}
                        {/*</UncontrolledDropdown>*/}
                    </Nav>
                    <NavbarText>©OpenSunday</NavbarText>
                </Collapse>
            </Navbar>
        </div>
    );
}

export default Navigation;
