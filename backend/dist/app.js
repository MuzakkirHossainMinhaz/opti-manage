"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_status_1 = __importDefault(require("http-status"));
const path_1 = __importDefault(require("path"));
const ErrorHandler_1 = __importDefault(require("./middlewares/ErrorHandler"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
//parsers
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: process.env.CORS_ORIGIN }));
// application routes
app.use("/api", routes_1.default);
// default route
app.get("/", (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../public/index.html"));
});
// 404 route
app.all(/(.*)/, (req, res) => {
    res.status(http_status_1.default.NOT_FOUND).json({
        success: false,
        message: "404! This Route Not Found.",
        path: `${req.params[0]}`,
    });
});
// global error handler
app.use(ErrorHandler_1.default);
exports.default = app;
