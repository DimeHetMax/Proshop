// const checkAge = (age) => {
//     return new Promise((resolve, reject) => {
//         if (age >= 18) {
//             resolve(`${age} - доступ есть`)

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

const getUser = (userId) => {
    return new Promise((resolve, reject) => {
        if (userId !== 0) {
            setTimeout(() => {
                resolve({ id: userId, name: "User #userId" })
            }, 1000)
        } else {
            reject("Неверный ID")
        }
    }

    )
}
getUser(1).then(console.log).catch(console.log)

const result = async () => {
    try {
        const res = await getUser(4)
        console.log(res);
    } catch (error) {
        console.log(error);
    }
}
result()