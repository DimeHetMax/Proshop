import bcrypt from "bcryptjs";

const users = [
    {
        name: "Admin User",
        email: "admin@email.com",
        password: bcrypt.hashSync("12345", 10)
    },
    {
        name: "Joy Bi",
        email: "joy@email.com",
        password: bcrypt.hashSync("12345", 10)
    },
    {
        name: "Max Gon",
        email: "max@email.com",
        password: bcrypt.hashSync("12345", 10)
    }
];

export default users;