import { Row, Col } from "react-bootstrap"

import Product from "../components/Product.jsx"
import Loader from "../components/Loader.jsx";
import Message from "../components/Message.jsx";

import { useGetProductsQuery } from "../slices/productsApiSlice.js";

const HomeScreen = () => {
    const { data: products, isLoading, isError } = useGetProductsQuery()

    return (
        <div>
            {isLoading ? (<Loader />) :
                isError ? (
                    <Message variant="danger">
                        Error...Sorry!
                    </Message>
                ) : (
                    <div>
                        <h1>Latest Products</h1>
                        <Row>
                            {products.map((product, index) => (
                                <Col key={product.id || index} sm={12} md={6} lg={4} xl={3}>
                                    <Product product={product} />
                                </Col>
                            ))}
                        </Row>
                    </div>
                )}

        </div>
    )
}
export default HomeScreen