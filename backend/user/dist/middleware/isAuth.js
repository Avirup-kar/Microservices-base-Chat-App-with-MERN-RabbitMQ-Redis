import Jwt, {} from "jsonwebtoken";
export const isAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: "Please Login -No auth header", });
            return;
        }
        const token = authHeader.split(" ")[1];
        const decodeValue = Jwt.verify(token, process.env.JWT_SECRET);
        if (!decodeValue || !decodeValue.user) {
            res.status(401).json({ message: "Invalid token", });
            return;
        }
        req.user = decodeValue.user; // attach user info
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Please Login - JWT error", });
    }
};
//# sourceMappingURL=isAuth.js.map