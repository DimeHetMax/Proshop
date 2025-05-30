import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';

import Product from "../models/productModel.js"
import { calcPrices } from '../utils/calcPrices.js';
import { verifyPayPalPayment, checkIfNewTransaction } from '../utils/paypal.js';

// @desc    Create new order
// @route    POST /api/orders
// @access   Private  

// const addOrderItems = asyncHandler(async (req, res) => {
//     const {
//         orderItems,
//         shippingAddress,
//         paymentMethod,
//         itemsPrice,
//         taxPrice,
//         shippingPrice,
//         totalPrice
//     } = req.body;
//     if (orderItems && orderItems.length === 0) {
//         res.status(400);
//         throw new Error("No order items")
//     } else {
//         const order = new Order({
//             orderItems: orderItems.map((x) => ({
//                 ...x,
//                 product: x._id,
//                 _id: undefined,
//             })),
//             user: req.user._id,
//             shippingAddress,
//             paymentMethod,
//             itemsPrice,
//             taxPrice,
//             shippingPrice,
//             totalPrice
//         })
//         const createdOrder = await order.save()
//         res.status(201).json(createdOrder)
//     }
// });
const addOrderItems = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod } = req.body;
    if (orderItems && orderItems.length === 0) {
        res.status(400)
        throw new Error("No order items")
    } else {
        const itemsFromDB = await Product.find({
            _id: { $in: orderItems.map((x) => x._id) },
        })

        const dbOrderItems = orderItems.map((itemFromClient) => {
            const matchingItemFromDb = itemsFromDB.find((itemFromDB) => itemFromDB._id.toString() === itemFromClient._id);
            return {
                ...itemFromClient,
                product: itemFromClient._id,
                price: matchingItemFromDb.price,
                _id: undefined,
            }
        })
        const { itemsPrice, taxPrice, shippingPrice, totalPrice } = calcPrices(dbOrderItems)
        const order = new Order({
            orderItems: dbOrderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice, taxPrice,
            shippingPrice,
            totalPrice
        })
        const createdOrder = await order.save()
        res.status(201).json(createdOrder)
    }
})
// @desc    Get logged in user orders
// @route    GET /api/orders/myorders
// @access   Private  

const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json(orders);
});

// @desc    Get order by ID
// @route    GET /api/orders/:id
// @access   Private  

const getOrderByID = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) {
        res.status(404);
        throw new Error("Order not found")
    }
    res.status(200).json(order)
});

// @desc    Update order to paid
// @route    PUT /api/orders/:id/pay
// @access   Private  

// const updateOrderToPaid = asyncHandler(async (req, res) => {

//     const order = await Order.findById(req.params.id)
//     if (!order) {
//         res.status(404)
//         throw new Error("Order not Found!")
//     }

//     order.isPaid = true;
//     order.paidAt = Date.now();
//     order.paymentResult = {
//         id: req.body.id,
//         status: req.body.status,
//         update_time: req.body.update_time,
//         email_address: req.body.payer.email_address
//     }
//     const updatedOrder = await order.save();

//     res.status(200).json(updatedOrder)
// });
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const { verified, value } = await verifyPayPalPayment(req.body.id)
    if (!verified) throw new Error("Payment not veryfied")

    const isNewTransaction = await checkIfNewTransaction(Order, req.body.id)
    if (!isNewTransaction) throw new Error("Transaction has been used before")

    const order = await Order.findById(req.params.id);
    if (order) {
        const paidCorrectAmount = order.totalPrice.toString() === value;
        if (!paidCorrectAmount) throw new Error("Incorrect amount paid")
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address
        }
        const updatedOrder = await order.save();

        res.status(200).json(updatedOrder)
    } else {
        res.status(404)
        throw new Error("Order not found")
    }
});
// @desc    Update order to delivered
// @route    PUT /api/orders/:id/deliver
// @access   Private/Admin

const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        res.status(404)
        throw new Error("Order not found")
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now()

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder)
});

// @desc    Get all orders
// @route    GET /api/orders
// @access   Private/Admin

const getOrders = asyncHandler(async (req, res) => {
    const pageSize = process.env.PAGINATION_LIMIT;
    const page = Number(req.query.pageNumber) || 1;
    const count = await Order.countDocuments();

    const orders = await Order.find({}).populate("user", "id name").skip(pageSize * (page - 1)).limit(pageSize)
    res.status(200).json({ orders, page, pages: Math.ceil(count / pageSize) })
});

const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate("user", "id name")

    res.status(200).json(orders)
})

const deleteOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
    if (!order) {
        res.status(404)
        throw new Error("Resource not found")
    }
    await Order.deleteOne({ _id: order._id })
    res.status(200).json({ message: "Order removed" });
})
// @desc    Delete an order
// @route    DELETE /api/orders/:id
// @access   Private/Admin

export {
    addOrderItems,
    getMyOrders,
    getOrderByID,
    updateOrderToPaid,
    updateOrderToDelivered,
    getOrders,
    getAllOrders,
    deleteOrder
}