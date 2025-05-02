import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import CheckoutSteps from "../components/CheckoutSteps";
import FormContainer from "../components/FormContainer";
import { toast } from "react-toastify";
import { confirmAlert } from 'react-confirm-alert';

import Message from "../components/Message"
import Loader from "../components/Loader"
import { useCreateOrderMutation } from "../slices/ordersApiSlice";
import { clearCartItems } from "../slices/cartSlice"

const PlaceOrderScreen = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const cart = useSelector(state => state.cart)
    const { userInfo } = useSelector(state => state.auth)

    const [createOrder, { isLoading, error }] = useCreateOrderMutation()

    useEffect(() => {
        if (!cart.shippingAddress.address) {
            navigate("/shipping");
        } else if (!cart.paymentMathod) {
            navigate("/payment");
        }
    }, [cart.paymentMathod, cart.shippingAddress.address, navigate])

    const confirmAdminOrder = (name, isAdmin) => {
        return new Promise((resolve) => {
            confirmAlert({
                title: 'Admin Action Required',
                message: `${name.toUpperCase()}: Are you sure you want to place an order?\nYou are isAdmin: ${isAdmin}`,
                buttons: [
                    {
                        label: 'Yes',
                        onClick: () => resolve(true)
                    },
                    {
                        label: 'No',
                        onClick: () => resolve(false)
                    }
                ]
            });
        })
    }
    const placeOrderHandler = async () => {
        if (userInfo.isAdmin) {
            const confirm = await confirmAdminOrder(userInfo.name, userInfo.isAdmin)

            if (!confirm) {
                toast.error('Stop fucking around!')
                return
            }

            toast.success('Your order was placed!')
        }

        try {
            const res = await createOrder({
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMathod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice,
            }).unwrap()
            dispatch(clearCartItems())
            navigate(`/order/${res._id}`)
        } catch (error) {
            toast.error(error?.data?.message || error?.message || error?.status || "An error occurred");
        }
    }

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 step3 step4 />
            <Row>
                <Col md={8}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Address:</strong>
                                {cart.shippingAddress.address}, {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}
                            </p>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method:</strong>
                                {cart.paymentMathod}
                            </p>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Order Item</h2>
                            {cart.cartItems.length === 0 ?
                                (
                                    <Message>Your cart is empty</Message>
                                ) : (
                                    <ListGroup variant="flush">
                                        {cart.cartItems.map((item, index) => (
                                            <ListGroup.Item key={index}>
                                                <Row >
                                                    <Col xs={4} md={3} lg>
                                                        <Image src={item.image} alt={item.name} width={"100px"} />
                                                    </Col>
                                                    <Col xs={5} md lg>
                                                        <Link to={`/product/${item._id}`}>
                                                            {item.name}
                                                        </Link>
                                                    </Col>
                                                    <Col xs md lg>
                                                        {item.qty}X${item.price}=${item.qty * item.price}
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Items:</Col>
                                    <Col>
                                        ${cart.itemsPrice}
                                    </Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping:</Col>
                                    <Col>
                                        ${cart.shippingPrice}
                                    </Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax:</Col>
                                    <Col>
                                        ${cart.taxPrice}
                                    </Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Total:</Col>
                                    <Col>
                                        ${cart.totalPrice}
                                    </Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                {error && <Message variant="danger">{error.data?.message || error.status || "An error occurred"}</Message>}
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Button
                                    type="button"
                                    className="btn-block"
                                    disabled={cart.cartItems.length === 0}
                                    onClick={placeOrderHandler}
                                >
                                    Place Order
                                </Button>
                                {isLoading && <Loader />}
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </FormContainer>
    )
}

export default PlaceOrderScreen;