import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js"
import userJoiSchema from "../schemas/userJoiSchema.js";
import generateToken from "../utils/generateToken.js";


// @desc     Auth user & get token
// @route    POST /api/users/login
// @access   Public

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email })
    const isMatched = await user.matchPassword(password)

    if (!user || !isMatched) {
        res.status(401)
        throw new Error("Invalid email or password")
    }
    generateToken(res, user._id)

    res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
    })
})

// @desc     Register user
// @route    POST /api/users/register
// @access   Public

const registerUser = asyncHandler(async (req, res) => {

    const { error, value } = userJoiSchema.validate(req.body)

    if (error !== undefined) {
        const [{ message }] = error.details;
        res.status(400)
        throw new Error(`Bad Request! ${message}`)
    }

    const { name, email, password } = value;

    const userExist = await User.findOne({ email })

    if (userExist) {
        res.status(400)
        throw new Error("User already exists")
    }

    const user = await User.create({
        name,
        email,
        password
    })

    if (!user) {
        res.status(400)
        throw new Error("Invalid user data")
    }

    generateToken(res, user._id)

    res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
    })

})

// @desc     Logout user / clear cookie
// @route    POST /api/users/logout
// @access   Privat

const logoutUser = asyncHandler(async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0)
    })
    res.status(200).json({ message: "Logged out successfully" })
})

// @desc     Get user profile
// @route    GET /api/users/profile
// @access   Privat

const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (!user) {
        res.status(404)
        throw new Error("User not found")
    }
    res.status(200).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
    })
})

// @desc     Update user profile
// @route    POST /api/users/profile
// @access   Privat

const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (!user) {
        res.status(404)
        throw new Error("User not found")
    }
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    if (req.body.password) {
        user.password = req.body.password
    }
    const updatedUser = await user.save()
    if (!updateUser) {
        res.status(404)
        throw new Error("User not found")
    }
    res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
    })
})

// @desc     get all users
// @route    GET /api/users
// @access   Privat/Admin
const getUsers = asyncHandler(async (req, res) => {
    // const user = await User.findById(req.user._id)
    const pageSize = process.env.PAGINATION_LIMIT;
    const page = Number(req.query.pageNumber) || 1;
    const count = await User.countDocuments()

    const users = await User.find({}).skip(pageSize * (page - 1)).limit(pageSize)

    if (!users) {
        res.status(404)
        throw new Error("User not found")
    }

    // res.status(200).json([...users]);
    res.status(200).json({ users, page, pages: Math.ceil(count / pageSize) });
})
// @desc     get user by ID
// @route    GET /api/users/:id
// @access   Privat/Admin
const getUserById = asyncHandler(async (req, res) => {
    const userId = req.params.id
    const user = await User.findById(userId).select("-password")
    if (!user) {
        res.status(404)
        throw new Error("User not found")
    }
    // const admin = await User.findById(req.user._id)
    // if (!admin) {
    //     res.status(404)
    //     throw new Error("Not Admin")
    // }
    // const user = await User.findOne({ _id: userId })
    // console.log(user);

    res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
    })
})
// @desc     Delete users
// @route    DELETE /api/users/:id
// @access   Privat/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const userId = req.params.id
    // console.log("userId===>", userId);
    const user = await User.findById(userId)
    if (!user) {
        res.status(404)
        throw new Error("User not Found")
    }
    if (user.isAdmin) {
        res.status(400)
        throw new Error("Cannot Delete Admin")
    }
    await User.deleteOne({ _id: user._id })
    res.status(200).json({ "message": "User deleted successfully" })
})

// @desc     Update users
// @route    PUT /api/users/:id
// @access   Privat/Admin
const updateUser = asyncHandler(async (req, res) => {
    const userId = req.params.id
    // console.log("userId===>", userId);
    const user = await User.findById(userId)
    if (!user) {
        res.status(404);
        throw new Error("User not found")
    }
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save()
    res.status(200).json(
        {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        }
    )
})

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser
}