import Order from "../models/orderModel.js";

// @desc Create new order
// @route POST /api/orders
export const createOrder = async (req, res) => {
    try {
        const { customerId, restaurantId, items, deliveryAddress } = req.body;
        
        // Calculate totalPrice based on items (quantity * price)
        let totalPrice = 0;
        items.forEach(item => {
            totalPrice += item.quantity * item.price;
        });
        
        const order = new Order({
            customerId,  // Manually inputted customerId
            restaurantId,  // Manually inputted restaurantId
            items,
            totalPrice,
            deliveryAddress
        });

        await order.save();
        res.status(201).json(order);
    } catch (error) {
        console.error("Error creating order:", error);  // Log error for debugging
        res.status(500).json({ error: "Server Error" });
    }
};

// @desc Get all orders
// @route GET /api/orders
export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find();  // No need to populate manually inputted fields
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
};

// @desc Get single order by ID
// @route GET /api/orders/:id
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
};

// @desc Update order details
// @route PATCH /api/orders/:id
export const updateOrderDetails = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Update order details
        const { items, deliveryAddress } = req.body;
        
        // Update only provided fields
        if (items) {
            order.items = items;

            // Recalculate totalPrice based on the new items
            order.totalPrice = 0;
            items.forEach(item => {
                order.totalPrice += item.quantity * item.price;
            });
        }
        if (deliveryAddress) order.deliveryAddress = deliveryAddress;

        await order.save();

        res.status(200).json(order);
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

// @desc Update order status
// @route PATCH /api/orders/:id
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });

        if (!order) return res.status(404).json({ message: "Order not found" });

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
};

// @desc Delete (Cancel) order
// @route DELETE /api/orders/:id
export const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, { status: "Canceled" }, { new: true });
        if (!order) return res.status(404).json({ message: "Order not found" });

        res.status(200).json({ message: "Order canceled", order });
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
};
 