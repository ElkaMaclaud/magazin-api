import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export default function (req, res, next) {
    if (req.method === "OPTIONS") {
        return next();
    }
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            if (token && token !== "null") {
                try {
                    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
                    req.user = decodedData;
                    req.userEmail = decodedData.email;
                } catch (error) {
                    if (error.name === 'TokenExpiredError') {
                        console.error('Токен истек:', error.message);
                    } else {
                        console.error('Ошибка валидации токена:', error.message);
                    }
                }
            }
        }
        next();
    } catch (e) {
        console.log(e);
    }
}