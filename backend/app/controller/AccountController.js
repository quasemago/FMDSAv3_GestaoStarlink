import jwt from 'jsonwebtoken';
import Account from "../database/models/Account.js";

class AccountController {
    async login(req, res) {
        const {email, password} = req.body;

        if (!email || !password) {
            res.status(400)
                .json({message: "Campos não preenchidos!"});
            return;
        }

        const account = await Account.findOne({where: {email}});
        if (!account) {
            res.status(401)
                .json({message: "Credenciais inválidas!"});
            return;
        }

        const isValid = await account.passwordIsCorrect(password);
        if (!isValid) {
            res.status(401)
                .json({message: "Credenciais inválidas!"});
            return;
        }

        const {id, role} = account;
        const token = jwt.sign({id, email, role}, app_config.JWT_TOKEN_SECRET, {
            expiresIn: app_config.JWT_TOKEN_EXPIRATION
        });

        return res.json({
            email: account.email,
            role: account.role,
            accessToken: token,
        });
    }
}

export default new AccountController();