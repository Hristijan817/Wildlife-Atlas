// backend/middleware/adminKey.js
module.exports = function adminKey(req, res, next) {
  const provided = req.header("x-admin-key");
  const expected = process.env.ADMIN_KEY;
  if (!expected || provided !== expected) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};
