import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Button, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../slices/cartSlice";

const PaymentScreen = () => {
    const [paymentMathod, setPaymentMathod] = useState("PayPal")
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart;

    useEffect(() => {
        if (!shippingAddress) {
            navigate("/shipping")
        }
    }, [navigate, shippingAddress])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMathod))
        navigate("/placeorder")
    }

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 step3 />
            <h1>Payment Method</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group>
                    <Form.Label as="legend">Select Method</Form.Label>
                    <Col>
                        <Form.Check
                            type="radio"
                            className="my-2"
                            label="PayPal or Credit Card"
                            id="PayPal"
                            name="paymentMethod"
                            checked
                            onChange={(e) => setPaymentMathod(e.target.value)}
                        ></Form.Check>
                    </Col>
                </Form.Group>
                <Button type="submit" variant="primary">Continue</Button>
            </Form>
        </FormContainer>
    )
}

export default PaymentScreen;