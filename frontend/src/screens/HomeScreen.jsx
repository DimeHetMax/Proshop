import { Row, Col } from "react-bootstrap"
import { useSearchParams, Link } from "react-router-dom";

import Product from "../components/Product.jsx"
// import Loader from "../components/Loader.jsx";
import Message from "../components/Message.jsx";
import Paginate from "../components/Paginate.jsx";
import ProductCarousel from "../components/ProductCarousel.jsx";
import FilterCategory from "../components/FilterCategory.jsx";
import FilterBrand from "../components/FilterBrand.jsx";
import FilterPrice from "../components/FilterPrice.jsx";
// import Meta from "../components/Meta.jsx";

import { useGetProductsQuery } from "../slices/productsApiSlice.js";

const HomeScreen = () => {
    // const { pageNumber, keyword, brand, category, minPrice, maxPrice } = useParams()
    const [searchParams] = useSearchParams();
    const pageNumber = searchParams.get("page") || 1;
    const keyword = searchParams.get("keyword") || "";
    const brand = searchParams.get("brand") || "";
    const category = searchParams.get("category") || "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    const { data, isLoading, isError } = useGetProductsQuery({ keyword, pageNumber, brand, category, minPrice, maxPrice })
    // console.log("data in HomeScreen --->>>", data);


    return (
        <div>
            { /*If we have a keyword than we show the link back to be able to return to all products  */}
            {!keyword ? (<ProductCarousel />) : (<Link to="/" className="btn btn-light mb-4">Go Back</Link>)}
            {isLoading ? (null) :
                isError ? (
                    <Message variant="danger">
                        Error...Sorry!
                    </Message>
                ) : (
                    <div>

                        <h1>Latest Products</h1>

                        <Row className="mb-3" xs={1} md={4} lg={5}>
                            <Col><FilterCategory category={category} /></Col>
                            <Col><FilterBrand brand={brand} /></Col>
                            <Col><FilterPrice minPrice={minPrice} maxPrice={maxPrice} /></Col>
                        </Row>
                        {data.products.length === 0 && <Message>{`Sorry! There is no ${keyword}`} </Message>}
                        <Row>
                            {data.products.map((product, index) => (
                                <Col key={product.id || index} sm={12} md={6} lg={4} xl={3}>
                                    <Product product={product} />
                                </Col>
                            ))}
                        </Row>
                        <Paginate
                            pages={data.pages}
                            page={data.page}
                            keyword={keyword ? keyword : ""}
                            brand={brand}
                            category={category}
                            minPrice={minPrice}
                            maxPrice={maxPrice} />
                    </div>
                )}

        </div>
    )
}
export default HomeScreen