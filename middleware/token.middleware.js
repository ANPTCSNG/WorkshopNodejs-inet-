const jwt = require('jsonwebtoken')

module.exports = (req, res, next)  => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ status: 401, message: 'Token required', data: null });
        }
        const token = authHeader.split(' ')[1];
        
        const decoded = jwt.verify(token,process.env.JWT_Secret
        );
        
        req.user = decoded; 
        
        next(); // Remove 'Bearer ' prefix
    } catch (error) {
        console.error('JWT Verification Error:', error.name, error.message);
        return res.status(401).json({ status: 401, message: 'Invalid token', data: null });
    }
}