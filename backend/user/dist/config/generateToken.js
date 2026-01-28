import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
export const generateToken = (user) => {
    return Jwt.sign({ user }, JWT_SECRET, { expiresIn: '15d' });
};
//# sourceMappingURL=generateToken.js.map