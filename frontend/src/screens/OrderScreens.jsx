import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";

import Message from "../components/Message";
import Loader from "../components/Loader";
import {
    useGetOrderDetailsQuery,
    usePayOrderMutation,
    useGetPayPalClintIdQuery,
    useDeliverOrderMutation,
} from "../slices/ordersApiSlice";

const OrderScreen = () => {
    const { id: orderId } = useParams();
    const {
        data: order,
        refetch,
        isLoading,
        error
    } = useGetOrderDetailsQuery(orderId);
    // console.log("order =====>", order);

    const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
    const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation()

    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
    const { data: paypal, isLoading: loadingPayPal, error: errorPayPal } = useGetPayPalClintIdQuery();
    const { userInfo } = useSelector(state => state.auth)
    // console.log("userInfo", userInfo);
    useEffect(() => {
        if (!errorPayPal && !loadingPayPal && paypal.clientId) {
            const loadPayPalScript = async () => {
                paypalDispatch({
                    type: "resetOptions",
                    value: {
                        'client-id': paypal.clientId,
                        currency: "USD",
                    }
                })
                paypalDispatch({ type: "setLoadingStatus", value: "pending" })
            }

            if (order && !order.isPaid && !userInfo.isAdmin) {

                if (!window.paypal) {

                    loadPayPalScript()
                }

            }
        }
    }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal, userInfo])

    // const onApproveTest = async () => {
    //     await payOrder({ orderId, details: { payer: {} } })
    //     refetch()
    //     toast.success("Payment successful")
    // }
    const onApprove = (data, actions) => {
        return actions.order.capture().then(async function (details) {

            try {
                await payOrder({ orderId, details }).unwrap()
                refetch()
                toast.success("Payment successful")
            } catch (error) {
                toast.error(error?.data?.message || error.message)
            }
        })
    }
    const onError = (err) => {
        toast.error(err.message)
    }
    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: order.totalPrice,
                    },
                },
            ],
        }).then((orderId) => {
            return orderId;
        });
    };

    // function onApprove() { }
    // function onApproveTest() { }
    // function onError() { }
    // function createOrder() { }
    const deliverOrderHandler = async () => {
        try {
            await deliverOrder(orderId)
            refetch()
            toast.success("Order delivered")
        } catch (err) {
            toast.error(err?.data?.message || err.message)
        }
    }
    return (
        isLoading ? (
            <Loader />
        ) : error ? (
            <Message variant='danger'>{error?.data?.message || error.error}</Message>
        ) : (
            <div>
                {userInfo.isAdmin ? (
                    <Link to="/admin/orderlist" className="btn btn-light my-3">
                        Go Back
                    </Link>
                ) : (
                    <Link to="/profile" className="btn btn-light my-3">
                        Go Back
                    </Link>
                )}
                <Row xs md lg>
                    <Col xs={12} md={10} lg={8} >
                        <h1 className="order-title">Order</h1>
                    </Col>
                    <Col xs={12} md={10} lg={8}>
                        <p className="order-text-id">id: {order._id}</p>
                    </Col>
                </Row>


                <Row>
                    <Col md={8}>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h2>Shipping</h2>
                                <p>
                                    <strong>Name: </strong>{order.user.name}
                                </p>
                                <p>
                                    <strong>Email: </strong>{order.user.email}
                                </p>
                                <p>
                                    <strong>Address: </strong>{order.shippingAddress.address},{" "}
                                    {order.shippingAddress.city}{" "}{order.shippingAddress.postalCode},{" "}
                                    {order.shippingAddress.country}{"."}
                                </p>
                                {order.isDelivered ? (
                                    <Message variant="success">Delivered on {order.deliveredAt}</Message>
                                ) : (
                                    <Message variant="danger">Not Delivered</Message>
                                )}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <h2>Payment Method</h2>
                                <p>
                                    <strong>Method: </strong>
                                    {order.paymentMethod}
                                </p>
                                {order.isPaid ? (
                                    <Message variant="success">Paid on {order.paidAt}</Message>
                                ) : (
                                    <Message variant="danger">Not Paid</Message>
                                )}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <h2>Order Items</h2>
                                {order.orderItems.map((item, index) => (
                                    <ListGroup.Item key={index}>
                                        <Row>
                                            <Col md={1}>
                                                <Image src={item.image} alt={item.name} fluid rounded />
                                            </Col>
                                            <Col>
                                                <Link to={`/product/${item.product}`}>
                                                    {item.name}
                                                </Link>
                                            </Col>
                                            <Col md={4}>
                                                {item.qty} X {item.price} = ${item.qty * item.price}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
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
                                        <Col>Items</Col>
                                        <Col>${order.itemsPrice}</Col>
                                    </Row>
                                    <Row>
                                        <Col>Shipping</Col>
                                        <Col>${order.shippingPrice}</Col>
                                    </Row>
                                    <Row>
                                        <Col>Tax</Col>
                                        <Col>${order.taxPrice}</Col>
                                    </Row>
                                    <Row>
                                        <Col>Total</Col>
                                        <Col>${order.totalPrice}</Col>
                                    </Row>
                                </ListGroup.Item>
                                {order && order.totalPrice && !order.isPaid && (
                                    <ListGroup.Item>
                                        {loadingPay && <Loader />}
                                        {isPending ? <Loader /> : (
                                            <div>
                                                {/*  <Button onClick={onApproveTest} style={{ marginBottom: "10px" }}> Test Pay Order</Button> */}
                                                <div>
                                                    <PayPalButtons createOrder={createOrder} onApprove={onApprove} onError={onError}></PayPalButtons>
                                                </div>
                                            </div>
                                        )}
                                    </ListGroup.Item>
                                )}
                                {loadingDeliver && <Loader />}
                                {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                    <ListGroup.Item>
                                        <Button type="button" className="btn btn-block" onClick={deliverOrderHandler}>Mark as Delivered</Button>
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    )
}

export default OrderScreen