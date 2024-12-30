import Alert from "react-bootstrap/Alert";

const Message = ({ variant = "info", children }) => {

    return (
        <Alert variant={variant}>
            {children}
        </Alert>
    )
}
// Message.defaultProps = {
//     variant: "info"
// }

export default Message;