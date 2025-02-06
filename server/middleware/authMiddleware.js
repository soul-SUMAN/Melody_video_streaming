

const verifyAdmin = (req, res, next) => {
    const user = req.headers.authorization ? JSON.parse(req.headers.authorization) : null;
    console.log('User Authorization Header:', user); 
    if (!user || !user.isAdmin) {
        return res.status(403).json({ message: 'You are not an admin. Only admins can upload videos.' });
    }
    next();
};

module.exports = { verifyAdmin };
