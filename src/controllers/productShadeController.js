const { PrismaClient } = require('@prisma/client');
const joi = require('joi');

const prisma = new PrismaClient();

module.exports = {
    show: async (req, res) => {
        try {
            const { id } = req.params;

            const product = await prisma.products.findUnique({ where: { id: Number(id) } });
            if (!product) return res.status(404).json({ message: 'failed get data!' });

            const product_shade = await prisma.product_shades.findUnique({ where: { id: Number(idImage) } });
            if (!product_shade) return res.status(404).json({ message: 'failed get data!' });

            res.status(200).json({ message: 'success get data!', data: product_shade });
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    create: async (req, res) => {
        const validate = async (data) => {
            const schema = joi.object({
                name_shade: joi.string().required(),
            }).unknown(true);
            return await schema.validate(data);
        }

        try {
            const { id } = req.params;
            const { name_shade } = req.body;
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

            const product_image = await prisma.product_shades.create({
                data: {
                    name_shade,
                    product_id: product.id,
                }
            })

            res.status(201).json({ message: 'success create data!', data: product_image });
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    update: async (req, res) => {
        const validate = async (data) => {
            const schema = joi.object({
                name_shade: joi.string().required(),
            }).unknown(true);
            return await schema.validate(data);
        }

        try {
            const { id, idShade } = req.params;
            const { name_shade } = req.body;
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

            const product_shade = await prisma.product_shades.findUnique({ where: { id: Number(idShade) } });
            if (!product_shade) return res.status(404).json({ message: 'failed get data!' });

            const update_product_shade = await prisma.product_shades.update({
                where: {
                    id: Number(idShade)
                },
                data: {
                    name_shade,
                    product_id: product.id,
                }
            });

            res.status(200).json({ message: 'success update data!', data: update_product_shade });
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    destroy: async (req, res) => {
        try {
            const { id, idShade } = req.params;

            const product = await prisma.products.findUnique({ where: { id: Number(id) } });
            if (!product) return res.status(404).json({ message: 'failed get data!' });

            const product_shade = await prisma.product_shades.findUnique({ where: { id: Number(idImage) } });
            if (!product_shade) return res.status(404).json({ message: 'failed get data!' });

            await prisma.product_shades.delete({
                where: {
                    id: Number(idShade)
                },
            });

            res.status(200).json({ message: 'success delete data!', data: null });
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
}