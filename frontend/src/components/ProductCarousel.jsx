import { Link } from "react-router-dom"
import { Image, Carousel, Container } from "react-bootstrap"

import Message from "./Message"
import Loader from "./Loader"
import { useGetTopProductsQuery } from "../slices/productsApiSlice"

const ProductCarousel = () => {
    const { data: products, isLoading, error } = useGetTopProductsQuery()
    // console.log("products in Carousel===>", products);
    return isLoading ?
        (
            <Loader />
        )
        : error
            ? (
                <Message variant="danger">
                    {error?.data?.message || error?.error}
                </Message>)
            : (
                <Container fluid="md" className="mb-4">
                    <div className="carousel-wrapper">
                        <Carousel pause="false" fade className="bg-primary mb-4">
                            {products.map(product => (
                                <Carousel.Item key={product._id}>
                                    <Link to={`/product/${product._id}`}>
                                        <Image src={product.image} alt={product.name} fluid className="carousel-image" />
                                        <Carousel.Caption className="carousel-caption carousel-caption-custom">
                                            <h2>
                                                {product.name} {product.price}
                                            </h2>
                                        </Carousel.Caption>
                                    </Link>
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    </div>
                </Container>
            )
}

export default ProductCarousel