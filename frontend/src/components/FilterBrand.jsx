import { useState, useEffect } from "react"
import { Form } from "react-bootstrap"
import { useSearchParams } from "react-router-dom";

const FilterBrand = () => {
    const [brand, setBrand] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const currentCategory = searchParams.get("brand") || "";
        setBrand(currentCategory);
    }, [searchParams]);

    useEffect(() => {
        const params = {};

        if (brand) params.brand = brand;
        setSearchParams((prev) => {
            const updated = new URLSearchParams(prev);
            if (brand) updated.set("brand", brand);
            else updated.delete("brand");
            return updated;
        })
    }, [brand, setSearchParams]);

    return (
        <div>
            <Form.Select aria-label="Filter by category"
                style={{ maxwidth: "200px" }}
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
            >
                <option value="">All Brands</option>
                <option value="Apple">Apple</option>
                <option value="Samsung"> Samsung</option>
            </Form.Select>

        </div>
    )
}

export default FilterBrand