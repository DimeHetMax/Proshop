import { Navbar, Nav, Container, Badge } from "react-bootstrap"
import { FaShoppingCart, FaUser } from "react-icons/fa"
import { LinkContainer } from "react-router-bootstrap"
import { useSelector } from "react-redux"
import logo from "../assets/logo.png"

const Header = () => {
    const { cartItems } = useSelector((state) => state.cart)
    // console.log("cartItems====>", cartItems);
    return (
        <header>
            <Navbar bg="gray" vatiant="gray" expand="md" collapseOnSelect>
                <Container>
                    <LinkContainer to="/">
                        <Navbar.Brand >
                            <img src={logo} alt="ProSHop" width="20px" />
                            ProShop
                        </Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <LinkContainer to="/cart">
                                <Nav.Link >
                                    <FaShoppingCart />
                                    {
                                        cartItems.length > 0 && (
                                            <Badge pill bg="success" >
                                                {cartItems.reduce((a, c) => a + c.qty, 0)}
                                            </Badge>
                                        )
                                    }
                                    Cart
                                </Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/login">
                                <Nav.Link ><FaUser />Sign In</Nav.Link>
                            </LinkContainer>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}
export default Header;