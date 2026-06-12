"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = protect;
exports.authorize = authorize;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Protect middleware: Verifies bearer tokens and attaches payload to request context.
 */
function protect(req, res, next) {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return res.status(401).json({ success: false, message: 'Authorization token is missing.' });
    }
    try {
        const secret = process.env.JWT_SECRET || 'sih_hackaholics_smart_attend_secret_2026';
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.user = {
            id: decoded.id,
            role: decoded.role
        };
        next();
    }
    catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid token signature.' });
    }
}
/**
 * Authorize middleware: Filters requests by specific security roles.
 */
function authorize(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Forbidden: Access restricted to [${roles.join(', ')}] roles.`
            });
        }
        next();
    };
}
