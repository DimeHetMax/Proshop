import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
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
        <Form onSubmit={submitHandler} className='d-flex'>
            <Form.Control
                type='text'
                name="q"
                onChange={(e) => setKeyword(e.target.value)}
                value={keyword}
                placeholder='Search Product...'
                className='mr-sm-2 ml-sm-5'
            ></Form.Control>
            <Button type='submit' variant="outline-success" className='p-2 mx-2'>Search</Button>
        </Form>
    )
}

export default SearchBox