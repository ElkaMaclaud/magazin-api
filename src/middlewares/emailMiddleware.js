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
            const decodedData = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decodedData;
            req.userEmail = decodedData.email;
        } 
        next();
    } catch (e) {
        console.log(e);
    }
}