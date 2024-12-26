import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development", // Secure in non-development environments
    });

    return token;
};
