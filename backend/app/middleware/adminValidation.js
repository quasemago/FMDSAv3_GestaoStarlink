export default async (req, res, next) => {
    if (req.userRole !== 'ADMIN') {
        res.status(403)
            .json({message: "Acesso negado!"});
        return;
    }
    return next();
}