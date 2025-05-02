import { LinkContainer } from "react-router-bootstrap"
import { Table, Button } from "react-bootstrap"
import { FaTrash, FaEdit, FaCheck } from "react-icons/fa"
import { confirmAlert } from 'react-confirm-alert';
import { toast } from "react-toastify"
import { useParams } from "react-router-dom"

import Message from "../../components/Message"
import Loader from "../../components/Loader"
import Paginate from "../../components/Paginate"
import { useGetUsersQuery, useDeleteUserMutation } from "../../slices/usersApiSlice"

const UserListScreen = () => {
    const { pageNumber } = useParams()
    const { data, isLoading, error } = useGetUsersQuery({ pageNumber })
    console.log(data);
    const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation()

    const deleteHandler = async (id) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: `Are you sure you want to delete user ${id}?`,
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            await deleteUser(id).unwrap();
                            toast.success(`User ${id} deleted!`);
                        } catch (err) {
                            toast.error(err?.data?.message || err.error);
                        }
                    }
                },
                {
                    label: 'No',
                    onClick: () => {
                        toast.info(`Cancelled deleting user ${id}`);
                    }
                }
            ]
        });
    }
    return (
        <div>
            <h1>Users</h1>
            {loadingDelete && <Loader />}
            {isLoading ?
                <Loader />
                : error ?
                    <Message variant="danger">{error}</Message> : (
                        <div>
                            <Table striped hover responsive className="table-sm">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>NAME</th>
                                        <th>EMAIL</th>
                                        <th>ADMIN</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.users.map((user) => (
                                        <tr key={user._id}>
                                            <td>{user._id}</td>
                                            <td>{user.name}</td>
                                            <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                                            <td>{user.isAdmin ? (<FaCheck color="green" />) : (<FaCheck color="red" />)}</td>

                                            <td>
                                                <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                                    <Button variant="light" className="btn-sm"><FaEdit /></Button>
                                                </LinkContainer>
                                                <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(user._id)}>
                                                    <FaTrash style={{ color: "white" }} />
                                                </Button>

                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                            </Table>
                            <Paginate pages={data.pages} page={data.page} isAdmin={true} query="userlist" />
                        </div>
                    )
            }


        </div >
    )
}

export default UserListScreen