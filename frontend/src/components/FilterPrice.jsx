import { useState, useEffect } from "react"
import { Form, Row, Col } from "react-bootstrap"
import { useSearchParams } from "react-router-dom";


const FilterPrice = () => {
    const [minPrice, setMinPrice] = useState("")
    const [maxPrice, setMaxPrice] = useState("")
    const [, setSearchParams] = useSearchParams()

    useEffect(() => {
        const params = {};
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        setSearchParams((prev) => {
            const updated = new URLSearchParams(prev);
            if (minPrice) updated.set("minPrice", minPrice);
            else updated.delete("minPrice");
            if (maxPrice) updated.set("maxPrice", maxPrice);
            else updated.delete("maxPrice");
            return updated;
        })

    }, [minPrice, maxPrice, setSearchParams])
    return (
        <div>
            <Form

            >
                <Row >
                    <Col>
                        <Form.Control
                            size="sm"
                            type="number"
                            placeholder="Min price"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            min="0"
                        />
                    </Col>
                    <Col>
                        <Form.Control
                            size="sm"
                            type="number"
                            placeholder="Max price"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            min="0"
                        />
                    </Col>
                </Row>
            </Form>
        </div>
    );
}

export default FilterPrice