import { Row, Col } from "react-bootstrap"
import { useParams, Link } from "react-router-dom";

import Product from "../components/Product.jsx"
import Loader from "../components/Loader.jsx";
import Message from "../components/Message.jsx";
import Paginate from "../components/Paginate.jsx";
import ProductCarousel from "../components/ProductCarousel.jsx";
// import Meta from "../components/Meta.jsx";

import { useGetProductsQuery } from "../slices/productsApiSlice.js";

const HomeScreen = () => {
    const { pageNumber, keyword, brand, category, minPrice, maxPrice } = useParams()
    const { data, isLoading, isError } = useGetProductsQuery({ keyword, pageNumber, brand, category, minPrice, maxPrice })
    // console.log("data in HomeScreen --->>>", data);

    return (
        <div>
            { /*If we have a keyword than we show the link back to be able to return to all products  */}
            {!keyword ? (<ProductCarousel />) : (<Link to="/" className="btn btn-light mb-4">Go Back</Link>)}
            {isLoading ? (<Loader />) :
                isError ? (
                    <Message variant="danger">
                        Error...Sorry!
                    </Message>
                ) : (
                    <div>

                        <h1>Latest Products</h1>
                        {data.products.length === 0 && <Message>{`Sorry! There is no ${keyword}`} </Message>}
                        <Row>
                            {data.products.map((product, index) => (
                                <Col key={product.id || index} sm={12} md={6} lg={4} xl={3}>
                                    <Product product={product} />
                                </Col>
                            ))}
                        </Row>
                        <Paginate pages={data.pages} page={data.page} keyword={keyword ? keyword : ""} />
                    </div>
                )}

        </div>
    )
}
export default HomeScreen