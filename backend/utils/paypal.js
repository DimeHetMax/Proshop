import dotenv from "dotenv"
dotenv.config()
const { PAYPAL_CLIENT_ID, PAYPAL_API_SECRET, PAYPAL_API_URL } = process.env;


async function getPayPalAccessToken() {
    const auth = Buffer.from(PAYPAL_CLIENT_ID + ":" + PAYPAL_API_SECRET).toString("base64");
    const url = `${PAYPAL_API_URL}/v1/oauth2/token`;
    const headers = {
        Accept: "application/json",
        "Accept-Language": "en_US",
        Authorization: `Basic ${auth}`
    }
    const body = "grant_type=client_credentials";

    const response = await fetch(url, {
        method: "POST",
        headers,
        body
    })
    if (!response.ok) throw new Error("Failed to get access token");

    const paypalData = await response.json();
    return paypalData.access_token;
}

export async function checkIfNewTransaction(orderModel, paypalTransactionId) {
    try {
        const orders = await orderModel.find({
            "paymentResult.id": paypalTransactionId
        })
        return orders.length === 0;
    } catch (error) {
        console.log(error);
    }

}

export async function verifyPayPalPayment(paypalTransactionId) {
    const accessToken = await getPayPalAccessToken()
    const paypalResponse = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${paypalTransactionId}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
        }
    })

    if (!paypalResponse.ok) throw new Error("Failed to verify payment");
    const paypalData = await paypalResponse.json();
    return {
        verified: paypalData.status === "COMPLETED",
        value: paypalData.purchase_units[0].amount.value,
    }
}