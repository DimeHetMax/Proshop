import Spinner from "react-bootstrap/Spinner";
const style = {
    width: "50px",
    height: "50px",
    margin: "auto",
    display: "block"
}

const Loader = () => {
    return (
        <Spinner animation="border" role="status" style={style} variant="dark" />
    )
}

export default Loader;