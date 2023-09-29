"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const predictions_routes_1 = require("./routes/predictions.routes");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';");
    next();
});
app.use('/prediction', predictions_routes_1.predictionRoutes);
//? Express Error Middleware
app.use((error, req, res, next) => {
    console.log('in express error middleware', error, 'in the end');
    const status = error.status || 500;
    const message = error.message || 'server internal error';
    res.status(status).json({ status: 'error', message: message });
});
app.listen(process.env.PORT, () => console.log(`server is running on port ${process.env.PORT}`));
