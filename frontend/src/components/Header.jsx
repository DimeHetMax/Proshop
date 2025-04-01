import { useState, useEffect } from "react";
import { Navbar, Nav, Container, Badge, NavDropdown, Spinner } from "react-bootstrap"
import { FaShoppingCart, FaUser } from "react-icons/fa"
import { LinkContainer } from "react-router-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { useGetOrdersQuery } from "../slices/ordersApiSlice"
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import logo from "../assets/logo.png"

const Header = () => {
    const { cartItems } = useSelector((state) => state.cart)
    const { userInfo } = useSelector((state) => state.auth)

    const { data: orders, isLoading } = useGetOrdersQuery()
    const [pendingDeliveries, setPendingDeliveries] = useState(0);
    console.log(pendingDeliveries);
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const [logoutApiCall] = useLogoutMutation()

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap()
            dispatch(logout())
            navigate("/login")
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (orders) {
            const filteredOrders = orders.filter(order => order.isPaid && !order.isDelivered);
            setPendingDeliveries(filteredOrders.length);
        }
    }, [orders])
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
                            {userInfo ? (
                                <NavDropdown title={userInfo.name}>
                                    <LinkContainer to="/profile">
                                        <NavDropdown.Item>Profile</NavDropdown.Item>
                                    </LinkContainer>
                                    <NavDropdown.Item onClick={logoutHandler}>
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            )
                                : (

                                    <LinkContainer to="/login">
                                        <Nav.Link ><FaUser />Sign In</Nav.Link>
                                    </LinkContainer>
                                )}
                            {userInfo && userInfo.isAdmin && (
                                <NavDropdown title="Admin" id="adminmenu">
                                    <LinkContainer to="/admin/productlist">
                                        <NavDropdown.Item>
                                            Products
                                        </NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/admin/userlist">
                                        <NavDropdown.Item>
                                            Users
                                        </NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/admin/orderlist">
                                        <NavDropdown.Item>
                                            Orders
                                            <Badge pill bg='dark' >
                                                {isLoading ? <Spinner animation="border" variant="dark" /> : pendingDeliveries}
                                            </Badge>
                                        </NavDropdown.Item>
                                    </LinkContainer>
                                </NavDropdown>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar >
        </header >
    )
}
export default Header;