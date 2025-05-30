import { useState, useEffect } from "react";
import { Table, Form, Button, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaTimes, FaTrash } from "react-icons/fa";
import { confirmAlert } from 'react-confirm-alert';

import Message from "../components/Message";
import Loader from "../components/Loader";
import { useProfileMutation } from "../slices/usersApiSlice";
import { useGetMyOrdersQuery, useDeleteOrderMutation } from "../slices/ordersApiSlice";
import { setCredentials } from "../slices/authSlice";


const ProfileScreen = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.auth)

    const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation()
    const [deleteOrder] = useDeleteOrderMutation()
    const { data: orders, isLoading, error, refetch } = useGetMyOrdersQuery();
    // console.log("orders====>", orders);
    useEffect(
        () => {
            if (userInfo) {
                setName(userInfo.name);
                setEmail(userInfo.email)
            }
        },
        [userInfo.name, userInfo.email, userInfo]
    )


    const submitHandler = async (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            toast.error("Password do not match")
        }
        try {
            const res = await updateProfile({ _id: userInfo._id, name, email, password }).unwrap()
            dispatch(setCredentials(res))
            refetch()
            toast.success("User Updated")
        } catch (error) {
            toast.error(error?.data?.message || error.error)
        }
    }
    const onDeleteHandler = async (id) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: `Are you sure you want to delete order ${id}?`,
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            await deleteOrder(id).unwrap();
                            toast.success(`User ${id} deleted!`);
                        } catch (err) {
                            toast.error(err?.data?.message || err.error);
                        }
                    }
                },
                {
                    label: 'No',
                    onClick: () => {
                        toast.info(`Cancelled deleting order ${id}`);
                    }
                }
            ]
        });
    }
    return (
        <Row>
            <Col md={3}>
                <h2>User Profile</h2>
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId="name" className="my-2">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="name"
                            placeholder="Enter name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="email" className="my-2">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="password" className="my-2">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="confirmPassword" className="my-2">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>
                    <Button type="submit" variant="primary" className="my-2">
                        Update
                    </Button>
                    {loadingUpdateProfile && <Loader />}
                </Form>
            </Col>
            <Col md={9}>
                <h2>
                    My Orders
                </h2>
                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <Message variant="danger">
                        {error?.data?.message || error.error}
                    </Message>
                ) : (
                    <Table striped hover responsive className="table-sm" size="sm">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>DATE</th>
                                <th>TOTAL</th>
                                <th>PAID</th>
                                <th>DELIVERED</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders?.map(order => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.createdAt.substring(0, 10)}</td>
                                    <td>${order.totalPrice}</td>
                                    <td>{order.isPaid ? (order.paidAt.substring(0, 10)) : (<FaTimes style={{ color: "red" }} />)}</td>
                                    <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : (<FaTimes style={{ color: "red" }} />)}</td>
                                    <td>
                                        <LinkContainer to={`/order/${order._id}`}>
                                            <Button variant="light" className="btn-sm">Details</Button>
                                        </LinkContainer>
                                    </td>
                                    {userInfo.isAdmin && (<td>
                                        <FaTrash style={{ color: "red" }} onClick={() => onDeleteHandler(order._id)} variant="primary" />
                                    </td>)}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Col>
        </Row>
    )
}

export default ProfileScreen