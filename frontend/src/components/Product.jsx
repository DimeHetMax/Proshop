import { Card } from "react-bootstrap"
import { Link } from "react-router-dom"
import Rating from "./Rating"

const Product = ({ product }) => {
    return (
        <Card className="product-card">
            <Link to={`/product/${product._id}`} className="product-image-stage">
                <Card.Img src={product.image} variant="top" className="product-image" />
            </Link>
            <Card.Body>
                <span className="product-category">{product.category}</span>
                <Link to={`/product/${product._id}`}>
                    <Card.Title as="div" className="product-title">
                        <strong>{product.name}</strong>
                    </Card.Title>
                </Link>
                <Card.Text as="div">
                    <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                </Card.Text>
                <Card.Text as="div" className="product-price">
                    ${product.price}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}
export default Product
