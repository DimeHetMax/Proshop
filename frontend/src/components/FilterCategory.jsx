import { useState, useEffect } from "react"
import { Form } from "react-bootstrap"
import { useSearchParams } from "react-router-dom";

const FilterCategory = () => {
    const [category, setCategory] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const currentCategory = searchParams.get("category") || "";
        setCategory(currentCategory);
    }, [searchParams]);

    useEffect(() => {
        const params = {};

        if (category) params.category = category;
        setSearchParams((prev) => {
            const updated = new URLSearchParams(prev);
            if (category) updated.set("category", category);
            else updated.delete("category");
            return updated;
        })
    }, [category, setSearchParams]);

    return (
        <div>
            <Form.Select aria-label="Filter by category"
                style={{ maxwidth: "200px" }}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            >
                <option value="">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Phones"> Phones</option>
                <option value="Books">Books</option>
                <option value="Accessories">Accessories</option>
            </Form.Select>

        </div>
    )
}

export default FilterCategory