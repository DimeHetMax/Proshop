import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { FaSearch } from 'react-icons/fa'
import { useSearchParams, useNavigate } from 'react-router-dom'

const SearchBox = () => {
    const navigate = useNavigate()
    // const { keyword: urlKeyword } = useParams()
    const [searchParams,] = useSearchParams();
    const initialKeyword = searchParams.get("keyword") || "";

    // const [keyword, setKeyword] = useState(urlKeyword || "")
    const [keyword, setKeyword] = useState(initialKeyword)

    const submitHandler = (e) => {
        e.preventDefault()

        const params = new URLSearchParams(searchParams)
        if (keyword.trim()) {
            params.set("keyword", keyword)
            navigate(`?${params.toString()}`)

            setKeyword("")
        } else {
            navigate("/")
        }
    }

    return (
        <Form onSubmit={submitHandler} className='site-search'>
            <FaSearch className='site-search-icon' aria-hidden='true' />
            <Form.Control
                type='text'
                name="q"
                onChange={(e) => setKeyword(e.target.value)}
                value={keyword}
                placeholder='Search Product...'
                aria-label='Search products'
            ></Form.Control>
            <Button type='submit' aria-label='Submit product search'>
                Search
            </Button>
        </Form>
    )
}

export default SearchBox
