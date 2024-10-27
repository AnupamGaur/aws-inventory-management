"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const client_s3_1 = require("@aws-sdk/client-s3");
const router = (0, express_1.Router)();
const client = new client_1.PrismaClient();
const s3Config = new client_s3_1.S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});
const mybucket = process.env.AWS_BUCKET_NAME;
const upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3Config,
        bucket: mybucket,
        acl: "public-read",
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const extension = file.originalname.split('.').pop();
            const filename = `${file.fieldname}-${uniqueSuffix}.${extension}`;
            cb(null, file.originalname);
        },
    }),
    limits: {
        files: 5
    },
    fileFilter(_, file, callback) {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return callback(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
        }
        callback(null, true);
    },
});
router.post('/', upload.array("img", 5), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = req.files;
        const imageUrls = files.map(file => file.location);
        console.log(imageUrls);
        let { item_name, category, item_code, item_description, unit, current_stock, last_updated_date, low_stock_warning, low_stock_units, price, gst_tax_rate, inclusive_of_tax } = req.body;
        current_stock = Number(current_stock);
        last_updated_date = new Date(last_updated_date);
        price = Number(price);
        low_stock_units = Number(low_stock_units);
        low_stock_warning = Boolean(low_stock_warning);
        inclusive_of_tax = Boolean(inclusive_of_tax);
        const result = yield client.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            const data = yield prisma.item.create({
                data: {
                    item_name,
                    category,
                    item_code,
                    item_description,
                    unit,
                    current_stock,
                    last_updated_date,
                    low_stock_warning,
                    low_stock_units,
                    price,
                    gst_tax_rate,
                    inclusive_of_tax,
                    item_images: {
                        create: imageUrls.map(url => ({
                            image_url: url
                        }))
                    }
                },
                include: {
                    item_images: true
                }
            });
        }));
        res.status(200);
        return;
    }
    catch (err) {
        res.json({ error: err });
        console.log(err, "sent schema is not correct");
        return;
    }
}));
router.delete('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { item_ids } = req.body;
        if (!item_ids || !Array.isArray(item_ids) || item_ids.length === 0) {
            res.status(400).json({
                success: false,
                message: 'No items selected for deletion'
            });
            return;
        }
        yield client.item.deleteMany({
            where: {
                id: {
                    in: item_ids
                }
            }
        });
        res.json({
            success: true,
        });
        return;
    }
    catch (error) {
        console.error('Error in bulk delete:', error);
        res.status(500).json({
            success: false,
        });
        return;
    }
}));
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allitems = yield client.item.findMany();
        res.json(allitems);
        return;
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
        });
    }
}));
router.put('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, updated_stock } = req.body;
        if (!updated_stock || !id) {
            res.status(400).json({
                success: false,
                message: 'Invalid Input'
            });
            return;
        }
        console.log(id, "this is id");
        console.log(updated_stock, "this is updated stock");
        yield client.item.update({
            where: {
                id: id
            },
            data: {
                current_stock: updated_stock
            }
        });
        res.json({
            success: true,
        });
        return;
    }
    catch (error) {
        console.error('Error in Updation:', error);
        res.status(500).json({
            success: false,
        });
        return;
    }
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { item_name, category, item_code, item_description, unit, current_stock, last_updated_date, low_stock_warning, low_stock_units, price, gst_tax_rate, inclusive_of_tax } = req.body.formData;
    current_stock = Number(current_stock);
    last_updated_date = new Date(last_updated_date);
    price = Number(price);
    gst_tax_rate = gst_tax_rate;
    low_stock_units = Number(low_stock_units);
    try {
        const id = req.params.id;
        yield client.item.update({
            where: {
                id: id
            },
            data: {
                item_name,
                category,
                item_code,
                item_description,
                unit,
                current_stock,
                last_updated_date,
                low_stock_warning,
                low_stock_units,
                price,
                gst_tax_rate,
                inclusive_of_tax
            }
        });
        res.json({
            success: true,
        });
        return;
        console.log("Hi", id);
    }
    catch (error) {
        console.error('Error in Updation:', error);
        res.status(500).json({
            success: false,
        });
        return;
    }
}));
exports.itemRouter = router;
