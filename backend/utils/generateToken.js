import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15d", })
    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
        httpOnly: true, // prevent client-side JavaScript from accessing the cookie, xss protection
        secure: process.env.NODE_ENV === "production", // Set secure flag in production
        sameSite: "strict", // Prevent CSRF
    })
}
export default generateTokenAndSetCookie;