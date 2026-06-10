import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();

export const sendTelegramMessage = async ({ id, totalPrice, name, email, street, city, postalCode, country }) => {

    const text = `
    🧾 *New paid Order!*
    
    *ID:* \`${id.toString()}\`
    *Price:* $${totalPrice.toFixed(2)}
    👤 *User:* ${name}
    📧 *Email:* ${email}
    
    📦 *Shipping address:*
    ${street}, ${city}
    ${postalCode}, ${country}
    `
    try {
        const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: process.env.CHAT_ID,
                text,
                parse_mode: 'Markdown'
            }),
        });
        const data = await response.json();
        console.log("Telegram OK:", data);
    } catch (error) {
        console.log("Error to send Telegram message", error);
    }

}
