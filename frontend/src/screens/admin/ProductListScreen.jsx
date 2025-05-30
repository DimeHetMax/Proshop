import { LinkContainer } from "react-router-bootstrap"
import { Table, Button, Row, Col } from "react-bootstrap"
import { FaEdit, FaTrash } from "react-icons/fa"
import { toast } from "react-toastify"
import { useParams } from "react-router-dom"
import { confirmAlert } from 'react-confirm-alert';

import Message from "../../components/Message"
import Loader from "../../components/Loader"
import Paginate from "../../components/Paginate"

import { useGetProductsQuery } from "../../slices/productsApiSlice"
import { useCreateProductMutation, useDeleteProductMutation } from "../../slices/productsApiSlice"
const ProductListScreen = () => {
    const { pageNumber } = useParams()
    // const { query } = useParams()
    // console.log("useParams query in ProductList ==>", query);
    const { data, isLoading, error, refetch } = useGetProductsQuery({ pageNumber })
    const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation()
    const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();

    const createProductHandler = async () => {
        // console.log("Button Click");
        if (window.confirm("are you sure you want to create a new product?")) {
            try {
                await createProduct();
                toast.success("Product Created")
                refetch()
            } catch (err) {
                toast.error(err?.data?.message || err.error)
            }
        }
    }

    const deleteHandler = async (id) => {
        // if (window.confirm("Are you sure?")) {
        //     try {
        //         await deleteProduct(id);
        //         toast.success("Product Deleted")
        //         refetch()
        //     } catch (err) {
        //         toast.error(err?.data?.message || err.error)
        //     }
        // }
        confirmAlert({
            title: 'Confirm to delete',
            message: `Are you sure you want to delete this product ${id}?`,
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            await deleteProduct(id).unwrap();
                            toast.success(`Product ${id} deleted!`);
                        } catch (err) {
                            toast.error(err?.data?.message || err.error);
                        }
                    }
                },
                {
                    label: 'No',
                    onClick: () => {
                        toast.info(`Cancelled deleting product ${id}`);
                    }
                }
            ]
        });
    }

    return (
        <div>
            <Row className="align-items-center">
                <Col>
                    <h1>Products</h1>
                </Col>
                <Col>
                    <Button className="my-3 btn-sm" onClick={createProductHandler}>
                        <FaEdit /> Create Product
                    </Button>
                </Col>
            </Row>
            {loadingCreate && <Loader />}
            {loadingDelete && <Loader />}
            {isLoading ? <Loader /> : error ? <Message variant="danger">{error.data.message}</Message> : (
                <div>
                    <Table striped hover responsive className="table-sm">
                        <thead>
                            <tr>
                                <td>ID</td>
                                <td>NAME</td>
                                <td>PRICE</td>
                                <td>CATEGORY</td>
                                <td>BRAND</td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody>
                            {data.products.map((product) => (
                                <tr key={product._id}>
                                    <td>{product._id}</td>
                                    <td>{product.name}</td>
                                    <td>{product.price}</td>
                                    <td>{product.category}</td>
                                    <td>{product.brand}</td>
                                    <td>
                                        <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                            <Button variant="light" className="btn-sm mx-2" >
                                                <FaEdit />
                                            </Button>
                                        </LinkContainer>
                                        <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(product._id)}>
                                            <FaTrash style={{ color: "white" }} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Paginate pages={data.pages} page={data.page} isAdmin={true} query="productlist" />
                </div>
            )}
        </div>
    )
}

export default ProductListScreen