import jwt from 'jsonwebtoken';
import Account from "../database/models/Account.js";

export const loginValidation = async (req, res, next) => {
    const {authorization} = req.headers;
    if (!authorization || !authorization.startsWith('Bearer')) {
        return res.status(401).json({
            message: 'Token JWT não encontrado.'
        });
    }

    const token = authorization.replace('Bearer', '').trim();
    try {
        const decoded = jwt.verify(token, app_config.JWT_TOKEN_SECRET);
        const {id, email, role} = decoded;

        const account = await Account.findOne({
            where: {id, email, role},
        });

        if (!account) {
            return res.status(400).json({
                message: 'Conta inválida ou inexistente.'
            });
        }

        req.userId = id;
        req.userEmail = email;
        req.userRole = role;

        return next();
    } catch (err) {
        return res.status(403).json({
            message: 'Token JWT expirado ou inválido.: ' + err.message,
        });
    }
};

export const adminValidation = async (req, res, next) => {
    if (req.userRole !== 'ADMIN') {
        res.status(403)
            .json({message: "Acesso negado!"});
        return;
    }
    return next();
}