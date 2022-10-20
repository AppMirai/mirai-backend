const { PrismaClient } = require('@prisma/client');
const joi = require('joi');
const { multer, upload } = require('../utils/uploadFile');
const fileHelper = require('../utils/file');

const prisma = new PrismaClient();

const store = upload.single('product_image');

module.exports = {
    index: async (req, res) => {
        try {
            const products = await prisma.products.findMany({
                include: {
                    product_images_detail: {},
                    brand: {},
                    category: {},
                    product_shades: {},
                },
            });

            res.status(200).json({ message: 'success retreived data!', data: products });
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    show: async (req, res) => {
        try {
            const { id } = req.params;

            const product = await prisma.products.findUnique({
                where: { id: Number(id) }, include: {
                    product_images_detail: {},
                    brand: {},
                    category: {},
                    product_shades: {},
                },
            });
            if (!product) return res.status(404).json({ message: 'failed get data!' });

            res.status(200).json({ message: 'success retreived data!', data: product });
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    create: async (req, res) => {
        const validate = async (data) => {
            const schema = joi.object({
                name: joi.string().required(),
                price: joi.number().required(),
                description: joi.string().required(),
                link_tokopedia: joi.string().required(),
                link_shopee: joi.string().required(),
                category_id: joi.number().required(),
                brand_id: joi.number().required(),
            }).unknown(true);
            return await schema.validate(data);
        }

        try {
            store(req, res, async (err) => {
                if (err instanceof multer.MulterError) {
                    return res.status(400).send({
                        error: "maximum file size is 2MB",
                    });
                } else if (req.fileValidationError) {
                    return res.status(400).send({
                        error: req.fileValidationError,
                    });
                } else if (err) {
                    return res.status(400).send({
                        error: err,
                    });
                }
                try {
                    const {
                        name,
                        price,
                        description,
                        link_tokopedia,
                        link_shopee,
                        category_id,
                        brand_id,
                    } = req.body;
                    const { error, value } = await validate(req.body);
                    if (error) {
                        let message = error.details[0].message.split('"');
                        message = message[1] + message[2];
                        res.status(400).send({
                            message: message,
                        });
                        return;
                    }

                    const category = await prisma.categories.findUnique({
                        where: { id: Number(category_id) },
                    });
                    if (!category) return res.status(404).json({ message: 'failed get data!' });

                    const brand = await prisma.brands.findUnique({
                        where: { id: Number(brand_id) },
                    });
                    if (!brand) return res.status(404).json({ message: 'failed get data!' });

                    if (!req.file) {
                        res.status(400).json({ message: 'please upload product_image!' });
                        return;
                    }

                    const product = await prisma.products.create({
                        data: {
                            name, price: Number(price), description, product_image_url: req.file.path, link_shopee, link_tokopedia, category_id: Number(category_id), brand_id: Number(brand_id)
                        }
                    });

                    res.status(201).json({ message: 'success create data!', data: product });
                } catch (error) {
                    res.status(500).send(error.message);
                }
            });

        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    update: async (req, res) => {
        const validate = async (data) => {
            const schema = joi.object({
                name: joi.string().required(),
                price: joi.number().required(),
                description: joi.string().required(),
                link_tokopedia: joi.string().required(),
                link_shopee: joi.string().required(),
                category_id: joi.number().required(),
                brand_id: joi.number().required(),
            }).unknown(true);
            return await schema.validate(data);
        }

        try {
            store(req, res, async (err) => {
                if (err instanceof multer.MulterError) {
                    return res.status(400).send({
                        error: "maximum file size is 2MB",
                    });
                } else if (req.fileValidationError) {
                    return res.status(400).send({
                        error: req.fileValidationError,
                    });
                } else if (err) {
                    return res.status(400).send({
                        error: err,
                    });
                }
                try {
                    const { id } = req.params;
                    const {
                        name,
                        price,
                        description,
                        link_tokopedia,
                        link_shopee,
                        category_id,
                        brand_id,
                    } = req.body;
                    const { error, value } = await validate(req.body);
                    if (error) {
                        let message = error.details[0].message.split('"');
                        message = message[1] + message[2];
                        res.status(400).send({
                            message: message,
                        });
                        return;
                    }

                    const product = await prisma.products.findUnique({ where: { id: Number(id) } });
                    if (!product) return res.status(404).json({ message: 'failed get data!' });

                    const category = await prisma.categories.findUnique({
                        where: { id: Number(category_id) },
                    });
                    if (!category) return res.status(404).json({ message: 'failed get data!' });

                    const brand = await prisma.brands.findUnique({
                        where: { id: Number(brand_id) },
                    });
                    if (!brand) return res.status(404).json({ message: 'failed get data!' });

                    if (req.file) {
                        fileHelper.deleteFile(product.product_image_url);
                    }

                    let updateProduct = await prisma.products.update({
                        where: {
                            id: Number(id)
                        },
                        data: {
                            name, price: Number(price), description, link_shopee, link_tokopedia, category_id: Number(category_id), brand_id: Number(brand_id)
                        }
                    });

                    if (req.file) {
                        updateProduct = await prisma.products.update({
                            where: {
                                id: Number(id)
                            },
                            data: {
                                product_image_url: req.file.path
                            }
                        });
                    }

                    res.status(200).json({ message: 'success update data!', data: updateProduct });
                } catch (error) {
                    res.status(500).send(error.message);
                }
            });

        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    destroy: async (req, res) => {
        try {
            const { id } = req.params;

            const product = await prisma.products.findUnique({ where: { id: Number(id) } });
            if (!product) return res.status(404).json({ message: 'failed get data!' });

            await prisma.products.delete({
                where: {
                    id: Number(id)
                }
            });

            res.status(200).json({ message: 'success delete data!' });
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
}