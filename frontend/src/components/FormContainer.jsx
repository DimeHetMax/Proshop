import { Container, Row, Col } from "react-bootstrap"


const FormContainer = ({ children }) => {
    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col xs={12} md={10} lg={8}>
                    {children}
                </Col>
            </Row>
        </Container>
    )

}

export default FormContainer;