const mongoose = require('mongoose');

const canteenOrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        name: String,
        quantity: Number,
        price: Number
    }],
    totalAmount: { type: Number, required: true },
    mealType: { type: String, enum: ['Breakfast', 'Lunch', 'Snacks', 'Dinner'], required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['Placed', 'Preparing', 'Ready', 'Delivered', 'Cancelled'], default: 'Placed' },
    paymentMode: { type: String, enum: ['Wallet', 'Cash', 'Deducted from Salary'], default: 'Wallet' }
}, { timestamps: true });

const canteenMenuSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, enum: ['Breakfast', 'Lunch', 'Snacks', 'Dinner', 'Beverages', 'Main Course'], required: true },
    price: { type: Number, required: true },
    description: { type: String },
    isVeg: { type: Boolean, default: true },
    isAvailable: { type: Boolean, default: true },
    day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'All'], default: 'All' }
}, { timestamps: true });

// --- New schemas for Canteen Portal (Coupon System) ---

const couponRequestSchema = new mongoose.Schema({
    requestId: { type: String, required: true, unique: true },
    employeeId: { type: String, required: true },
    employeeName: { type: String, required: true },
    department: { type: String, required: true },
    type: { type: String, enum: ['employee', 'guest'], required: true },
    quantity: { type: Number, required: true },
    amount: { type: Number, required: true },
    requestDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    guestName: { type: String },
    guestPurpose: { type: String },
    serveTime: { type: String }
}, { timestamps: true });

const couponIssuanceSchema = new mongoose.Schema({
    issuanceId: { type: String, required: true, unique: true },
    employeeId: { type: String, required: true },
    employeeName: { type: String, required: true },
    department: { type: String, required: true },
    couponNumbers: [{ type: String }],
    quantity: { type: Number, required: true },
    amount: { type: Number, required: true },
    issueDate: { type: Date, default: Date.now },
    validTill: { type: Date, required: true },
    paymentStatus: { type: String, enum: ['paid', 'pending'], default: 'pending' }
}, { timestamps: true });

const canteenSaleSchema = new mongoose.Schema({
    saleId: { type: String, required: true, unique: true },
    employeeId: { type: String, required: true },
    employeeName: { type: String, required: true },
    department: { type: String, required: true },
    quantity: { type: Number, required: true },
    amount: { type: Number, required: true },
    saleDate: { type: Date, default: Date.now },
    paymentMethod: { type: String, enum: ['cash', 'salary-deduction', 'online'], required: true },
    status: { type: String, enum: ['completed', 'pending'], default: 'completed' }
}, { timestamps: true });

const CanteenOrder = mongoose.model('CanteenOrder', canteenOrderSchema);
const CanteenMenu = mongoose.model('CanteenMenu', canteenMenuSchema);
const CouponRequest = mongoose.model('CouponRequest', couponRequestSchema);
const CouponIssuance = mongoose.model('CouponIssuance', couponIssuanceSchema);
const CanteenSale = mongoose.model('CanteenSale', canteenSaleSchema);

module.exports = { CanteenOrder, CanteenMenu, CouponRequest, CouponIssuance, CanteenSale };
