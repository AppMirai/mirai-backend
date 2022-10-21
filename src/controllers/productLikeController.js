const { PrismaClient } = require('@prisma/client');
const joi = require('joi');

const prisma = new PrismaClient();

module.exports = {
    index: async (req, res) => {
        try {
            const likes = await prisma.product_like.findMany({
                include: {
                    product: {
                        include: {
                            product_images_detail: {},
                            brand: {},
                            category: {},
                            product_shades: {},
                        }
                    }
                },
                where: {
                    user_id: req.user.id
                }
            });

            res.status(200).json({
                message: 'success get data!',
                data: likes
            });
        } catch (error) {
            res.status(500).send(error.message)
        }
    },
    like: async (req, res) => {
        const validate = async (data) => {
            const schema = joi.object({
                product_id: joi.number().required(),
            }).unknown(true);
            return await schema.validate(data);
        }

        try {
            const { product_id } = req.body;
            const { error, value } = await validate(req.body);
            if (error) {
                let message = error.details[0].message.split('"');
                message = message[1] + message[2];
                res.status(400).send({
                    message: message,
                });
                return;
            }

            const product = await prisma.products.findUnique({ where: { id: Number(product_id) } });
            if (!product) return res.status(404).json({ message: 'failed get data!' });

            const like = await prisma.product_like.upsert({
                where: {
                    product_id: product.id
                },
                create: {
                    product_id: product.id,
                    user_id: req.user.id
                },
                update: {
                    product_id: product.id,
                }
            });

            res.status(201).json({
                message: 'success create data!',
                data: like
            });
        } catch (error) {
            res.status(500).send(error.message)
        }
    },
    unlike: async (req, res) => {
        const validate = async (data) => {
            const schema = joi.object({
                product_id: joi.number().required(),
            }).unknown(true);
            return await schema.validate(data);
        }

        try {
            const { product_id } = req.body;
            const { error, value } = await validate(req.body);
            if (error) {
                let message = error.details[0].message.split('"');
                message = message[1] + message[2];
                res.status(400).send({
                    message: message,
                });
                return;
            }

            const checkLike = await prisma.product_like.findFirst({
                where: {
                    product_id: Number(product_id)
                }
            });
            if (!checkLike) {
                res.status(404).json({
                    message: 'failed get data!',
                    data: null
                });

                return;
            }

            await prisma.product_like.delete({
                where: {
                    product_id: checkLike.product_id
                }
            });

            res.status(200).json({
                message: 'success delete data!',
                data: null
            });
        } catch (error) {
            res.status(500).send(error.message)
        }
    },
    check_like: async (req, res) => {
        try {
            const { product_id } = req.body;
            const product = await prisma.products.findUnique({
                where: { id: Number(product_id) }, include: {
                    product_images_detail: {},
                    brand: {},
                    category: {},
                    product_shades: {},
                },
            });
            if (!product) return res.status(404).json({ message: 'failed get data!' });

            const check_like = await prisma.product_like.findFirst({
                where: {
                    AND: {
                        product_id: Number(product_id),
                        user_id: req.user.id
                    }
                }
            });

            res.status(200).json({ message: 'success get data!', data: { is_liked: check_like == null ? false : true } })
        } catch (error) {
            res.status(500).send(error.message)
        }
    }
}