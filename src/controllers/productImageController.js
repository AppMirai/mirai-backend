const { PrismaClient } = require('@prisma/client');
const fileHelper = require('../utils/file');
const { multer, upload } = require('../utils/uploadFile');

const prisma = new PrismaClient();

const store = upload.single('product_image');


module.exports = {
    show: async (req, res) => {
        try {
            const { id, idImage } = req.params;

            const product = await prisma.products.findUnique({ where: { id: Number(id) } });
            if (!product) return res.status(404).json({ message: 'failed get data!' });

            const product_image = await prisma.product_images_detail.findUnique({ where: { id: Number(idImage) } });
            if (!product_image) return res.status(404).json({ message: 'failed get data!' });


            res.status(200).json({ message: 'success get data!', data: product_image });
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    create: async (req, res) => {
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

                    const product = await prisma.products.findUnique({ where: { id: Number(id) } });
                    if (!product) return res.status(404).json({ message: 'failed get data!' });

                    if (!req.file) {
                        res.status(400).json({ message: 'please upload product_image!' });
                        return;
                    }

                    const product_image = await prisma.product_images_detail.create({
                        data: {
                            photo_product_url: req.file.path,
                            product_id: product.id,
                        }
                    })

                    res.status(201).json({ message: 'success create data!', data: product_image });
                } catch (error) {
                    res.status(500).send(error.message);

                }
            });
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    update: async (req, res) => {
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
                    const { id, idImage } = req.params;

                    const product = await prisma.products.findUnique({ where: { id: Number(id) } });
                    if (!product) return res.status(404).json({ message: 'failed get data!' });

                    const product_image = await prisma.product_images_detail.findUnique({ where: { id: Number(idImage) } });
                    if (!product_image) return res.status(404).json({ message: 'failed get data!' });

                    if (!req.file) {
                        res.status(400).json({ message: 'please upload product_image!' });
                        return;
                    }

                    fileHelper.deleteFile(product_image.photo_product_url);

                    const update_product_image = await prisma.product_images_detail.update({
                        where: {
                            id: Number(idImage)
                        },
                        data: {
                            photo_product_url: req.file.path,
                            product_id: product.id,
                        }
                    });

                    res.status(200).json({ message: 'success update data!', data: update_product_image });
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
            const { id, idImage } = req.params;

            const product = await prisma.products.findUnique({ where: { id: Number(id) } });
            if (!product) return res.status(404).json({ message: 'failed get data!' });

            const product_image = await prisma.product_images_detail.findUnique({ where: { id: Number(idImage) } });
            if (!product_image) return res.status(404).json({ message: 'failed get data!' });

            fileHelper.deleteFile(product_image.photo_product_url);

            await prisma.product_images_detail.delete({
                where: {
                    id: Number(idImage)
                },
            });

            res.status(200).json({ message: 'success delete data!', data: null });
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
}