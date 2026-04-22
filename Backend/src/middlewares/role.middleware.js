const verifyRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Token requerido" });
    }
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ error: `Acceso denegado. Solo para: ${roles.join(", ")}` });
    }
    next();
  };
};

module.exports = { verifyRole };
