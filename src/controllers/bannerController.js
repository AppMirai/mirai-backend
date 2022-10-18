const { PrismaClient } = require('@prisma/client');
const fileHelper = require('../utils/file');
const { multer, upload } = require('../utils/uploadFile');

const prisma = new PrismaClient();

const store = upload.single('banner_image');


module.exports = {
    index: async (req, res) => {
        try {
            const banner_images = await prisma.banner_images.findMany();

            res.status(200).json({ message: 'success retreived data!', data: banner_images });
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    show: async (req, res) => {
        try {
            const { id } = req.params;

            const banner_image = await prisma.banner_images.findUnique({ where: { id: Number(id) } });
            if (!banner_image) return res.status(404).json({ message: 'failed get data!' });

            res.status(200).json({ message: 'success retreived data!', data: banner_image });
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
                    if (!req.file) {
                        res.status(400).json({ message: 'please upload banner_image!' });
                        return;
                    }

                    const banner_image = await prisma.banner_images.create({
                        data: {
                            image_url: req.file.path,
                        }
                    });

                    res.status(201).json({ message: 'success create data!', data: banner_image });
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
                    const { id } = req.params;

                    const banner_image = await prisma.banner_images.findUnique({ where: { id: Number(id) } });
                    if (!banner_image) return res.status(404).json({ message: 'failed get data!' });

                    if (!req.file) {
                        res.status(400).json({ message: 'please upload banner_image!' });
                        return;
                    }

                    fileHelper.deleteFile(banner_image.image_url);

                    const updateBannerImage = await prisma.banner_images.update({
                        where: {
                            id: Number(id)
                        },
                        data: {
                            image_url: req.file.path
                        }
                    });

                    res.status(200).json({ message: 'success update data!', data: updateBannerImage });
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
            const banner_image = await prisma.banner_images.findUnique({ where: { id: Number(id) } });
            if (!banner_image) return res.status(404).json({ message: 'failed get data!' });

            fileHelper.deleteFile(banner_image.image_url);

            await prisma.banner_images.delete({
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