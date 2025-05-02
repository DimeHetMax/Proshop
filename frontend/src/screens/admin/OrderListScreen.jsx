import { LinkContainer } from "react-router-bootstrap"
import { Table, Button } from "react-bootstrap"
import { FaTimes, FaTrash } from "react-icons/fa"
import { useParams } from "react-router-dom"
import { confirmAlert } from 'react-confirm-alert';

import { toast } from "react-toastify";

import Message from "../../components/Message"
import Loader from "../../components/Loader"
import Paginate from "../../components/Paginate"

import { useGetOrdersQuery } from "../../slices/ordersApiSlice"
import { useDeleteOrderMutation } from "../../slices/ordersApiSlice"

const OrderListScreen = () => {
    const { pageNumber } = useParams()
    const { data, isLoading, error } = useGetOrdersQuery({ pageNumber })
    const [deleteOrder] = useDeleteOrderMutation()

    const deleteHandler = (id) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: `Are you sure you want to delete order ${id}?`,
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            await deleteOrder(id)
                            toast.success(`Order ${id} deleted!`)
                        } catch (err) {
                            toast.error(err?.data?.message || err.error)
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
        <div>

            <h1>Orders</h1>
            {isLoading ?
                <Loader />
                : error ?
                    <Message variant="danger">{error}</Message> : (
                        <div>
                            <Table striped hover responsive className="table-sm">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>USER</th>
                                        <th>DATE</th>
                                        <th>TOTAL</th>
                                        <th>PAID</th>
                                        <th>DELIVERED</th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.orders.map((order) => (
                                        <tr key={order._id}>
                                            <td>{order._id}</td>
                                            <td>{order.user && order.user.name}</td>
                                            <td>{order.createdAt.substring(0, 10)}</td>
                                            <td>{order.totalPrice}</td>
                                            <td>{order.isPaid ? (order.paidAt.substring(0, 10)) : (<FaTimes color="red" />)}</td>
                                            <td>{order.isDelivered ? (order.deliveredAt.substring(0, 10)) : (<FaTimes color="red" />)}</td>
                                            <td>
                                                <LinkContainer to={`/order/${order._id}`}>
                                                    <Button variant="light" className="btn-sm">Details</Button>
                                                </LinkContainer>
                                            </td>
                                            <td>{order.isPaid && order.isDelivered && (<Button variant="light" className="btn-sm" onClick={() => deleteHandler(order._id)}><FaTrash color="red" /></Button>)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <Paginate pages={data.pages} page={data.page} isAdmin={true} query="orderlist" />
                        </div>
                    )}
        </div>
    )
}

export default OrderListScreen