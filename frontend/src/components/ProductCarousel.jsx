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
                <Container fluid="md" className="hero-carousel">
                    <div className="carousel-wrapper">
                        <Carousel pause="false" fade>
                            {products.map(product => (
                                <Carousel.Item key={product._id}>
                                    <Link to={`/product/${product._id}`}>
                                        <div className="hero-slide">
                                            <div className="hero-copy">
                                                <span className="hero-eyebrow">Featured product</span>
                                                <h2>{product.name}</h2>
                                                <p>Designed to fit beautifully into your everyday.</p>
                                                <div className="hero-meta">
                                                    <strong>${product.price}</strong>
                                                    <span>Explore product</span>
                                                </div>
                                            </div>
                                            <div className="hero-product-stage">
                                                <Image src={product.image} alt={product.name} fluid className="carousel-image" />
                                            </div>
                                        </div>
                                    </Link>
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    </div>
                </Container>
            )
}

export default ProductCarousel
