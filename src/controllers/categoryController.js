const { PrismaClient } = require('@prisma/client');
const fileHelper = require('../utils/file');
const { multer, upload } = require('../utils/uploadFile');
const joi = require('joi');

const prisma = new PrismaClient();

const store = upload.single('category_image');

module.exports = {
    index: async (req, res) => {
        try {
            const categories = await prisma.categories.findMany({
                include: {
                    products: {
                        include: {
                            product_images_detail: {},
                            brand: {},
                            product_shades: {},
                        }
                    }
                }
            });

            res.status(200).json({ message: 'success retreived data!', data: categories });
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    show: async (req, res) => {
        try {
            const { id } = req.params;

            const category = await prisma.categories.findUnique({
                where: { id: Number(id) }, include: {
                    products: {
                        include: {
                            product_images_detail: {},
                            brand: {},
                            product_shades: {},
                        }
                    }
                }
            });
            if (!category) return res.status(404).json({ message: 'failed get data!' });

            res.status(200).json({ message: 'success retreived data!', data: category });
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    create: async (req, res) => {
        const validate = async (data) => {
            const schema = joi.object({
                name: joi.string().required(),
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
                    const { name } = req.body;
                    const { error, value } = await validate(req.body);
                    if (error) {
                        let message = error.details[0].message.split('"');
                        message = message[1] + message[2];
                        res.status(400).send({
                            message: message,
                        });
                        return;
                    }

                    if (!req.file) {
                        res.status(400).json({ message: 'please upload category_image!' });
                        return;
                    }

                    const category = await prisma.categories.create({
                        data: {
                            name,
                            category_image_url: req.file.path,
                        }
                    });

                    res.status(201).json({ message: 'success create data!', data: category });
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
                    const { name } = req.body;
                    const { error, value } = await validate(req.body);
                    if (error) {
                        let message = error.details[0].message.split('"');
                        message = message[1] + message[2];
                        res.status(400).send({
                            message: message,
                        });
                        return;
                    }

                    const category = await prisma.categories.findUnique({ where: { id: Number(id) } });
                    if (!category) return res.status(404).json({ message: 'failed get data!' });

                    if (req.file) {
                        fileHelper.deleteFile(category.category_image_url);
                    }

                    let updateCategory = await prisma.categories.update({
                        where: {
                            id: Number(id)
                        },
                        data: {
                            name,
                        }
                    });

                    if (req.file) {
                        updateCategory = await prisma.categories.update({
                            where: {
                                id: Number(id)
                            },
                            data: {
                                name,
                                category_image_url: req.file.path
                            }
                        });
                    }

                    res.status(200).json({ message: 'success update data!', data: updateCategory });
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
            const category = await prisma.categories.findUnique({ where: { id: Number(id) } });
            if (!category) return res.status(404).json({ message: 'failed get data!' });

            fileHelper.deleteFile(category.category_image_url);

            await prisma.categories.delete({
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