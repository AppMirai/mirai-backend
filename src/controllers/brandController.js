const { PrismaClient } = require('@prisma/client');
const fileHelper = require('../utils/file');
const joi = require('joi');
const { multer, upload } = require('../utils/uploadFile');

const prisma = new PrismaClient();

const store = upload.single('brand_image');


module.exports = {
    index: async (req, res) => {
        try {
            const brands = await prisma.brands.findMany({
                include: {
                    products: {}
                }
            });

            res.status(200).json({ message: 'success retreived data!', data: brands });
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    show: async (req, res) => {
        try {
            const { id } = req.params;

            const brand = await prisma.brands.findUnique({
                where: { id: Number(id) }, include: {
                    products: {}
                }
            });
            if (!brand) return res.status(404).json({ message: 'failed get data!' });

            res.status(200).json({ message: 'success retreived data!', data: brand });
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
                        res.status(400).json({ message: 'please upload brand_image!' });
                        return;
                    }

                    const brand = await prisma.brands.create({
                        data: {
                            name,
                            brand_image_url: req.file.path,
                        }
                    });

                    res.status(201).json({ message: 'success create data!', data: brand });
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

                    const brand = await prisma.brands.findUnique({ where: { id: Number(id) } });
                    if (!brand) return res.status(404).json({ message: 'failed get data!' });

                    if (!req.file) {
                        res.status(400).json({ message: 'please upload brand_image!' });
                        return;
                    }

                    if (req.file) {
                        fileHelper.deleteFile(brand.brand_image_url);
                    }

                    let updateBrand = await prisma.brands.update({
                        where: {
                            id: Number(id)
                        },
                        data: {
                            name,
                        }
                    });

                    if (req.file) {
                        updateBrand = await prisma.brands.update({
                            where: {
                                id: Number(id)
                            },
                            data: {
                                name,
                                brand_image_url: req.file.path
                            }
                        });
                    }

                    res.status(200).json({ message: 'success update data!', data: updateBrand });
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
            const brand = await prisma.brands.findUnique({ where: { id: Number(id) } });
            if (!brand) return res.status(404).json({ message: 'failed get data!' });

            fileHelper.deleteFile(brand.brand_image_url);

            await prisma.brands.delete({
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