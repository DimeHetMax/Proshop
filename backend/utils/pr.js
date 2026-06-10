// const checkAge = (age) => {
//     return new Promise((resolve, reject) => {
//         if (age >= 18) {
//             resolve(`${age} - доступ есть`)

import { response } from "express"

//         } else {
//             reject(`${age} -- мало лет`)

//         }
//     })
// }

// checkAge(18).then(data => console.log(data)).catch(err => console.log(err))

// checkAge(11).then(data => console.log(data)).catch(err => console.log(err))

// checkAge(25).then(data => console.log(data)).catch(err => console.log(err))

// const wait = (ms) => {
//     return new Promise(resolve => {
//         setTimeout(()=>resolve(ms), ms)
//     })
// }

// wait(200000).then((data) => console.log(`Прошло ${data} секунды`));

// await wait(ms)
// console.log("Ждём 1 сек");


// const sunAsunc = (a, b) => {
//     return new Promise((resolve, reject) => {
//         if (typeof a === "number" && typeof b === "number") {
//             setTimeout(resolve(a + b), 1000)
//         } else {
//             reject("Ошибка типов")
//         }
//     })
// }
// const res = async () => {
//     try {
//         const result = await sunAsunc(5, 10)
//         console.log(result);
//     } catch (error) {
//         console.log(error);
//     }
// }
// res()

// const newURL = "fakeURL"


// const fetchAPI = (url, header) => {
//     const { headers } = header
//     return new Promise((resolve, reject) => {
//         if (url && header) {
//             setTimeout(() => resolve(`We fetch this token:${url} with:${headers.Authorization}`,), 2000)
//         } else {
//             reject(console.log("ERROR"))
//         }
//     })
// }
// const getPayPalAccessToken = async () => {
//     const auth = Buffer.from("PAPAL_CLIENT_ID" + ":" + "PAYPAL_API_SECRET").toString("base64")
//     const url = `${newURL}/v1/oauth2/token`;
//     const headers = {
//         Accept: "application/json",
//         "Accept-Language": "en_US",
//         Authorization: `Basic ${auth}`
//     }
//     const body = "grant_type=client_credentials";
//     try {
//         const response = await fetchAPI(url, {
//             method: "POST",
//             headers,
//             body
//         })
//         if (!response) {
//             console.log("ERROR RESPONSE");
//         }
//         return response;
//     } catch (error) {
//         console.log(error);
//     }
// }


// const verifyPayPalPayment = async () => {
//     try {
//         const accesstToken = await getPayPalAccessToken()
//         console.log("accesstToken  ===>", accesstToken);

//     } catch (error) {

//     }

// }

// verifyPayPalPayment()
// import https from "https";

// https.get("https://api.telegram.org", (res) => {
//     console.log("Status Code:", res.statusCode);
// }).on("error", (e) => {
//     console.error("HTTPS error:", e);
// });
