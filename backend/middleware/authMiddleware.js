// middleware/authMiddleware.js

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "hardcoded-admin-token";

exports.protect = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token || token !== `Bearer ${ADMIN_TOKEN}`) {
    return res.status(401).json({ message: "Not authorized as admin" });
  }

  next();
};
