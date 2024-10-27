"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const cors_1 = __importDefault(require("cors"));
const item_1 = require("./routes/item");
require("dotenv/config");
const client = new client_1.PrismaClient();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3002;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/api/v1/item', item_1.itemRouter);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
