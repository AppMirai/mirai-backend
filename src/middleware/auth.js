const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

module.exports = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(token, process.env.JWT_TOKEN_SECRET, async (err, user) => {
        try {
            if (err) return res.status(401).json({ message: "Unauthorized" });
            const auth = await prisma.users.findUnique({
                where: {
                    id: user.id
                }
            });

            if (!auth) return res.status(401).json({ message: "Unauthorized" });
            req.user = auth;
            next();
        } catch (error) {
            throw new Error(error.message);
        }
    });
}
