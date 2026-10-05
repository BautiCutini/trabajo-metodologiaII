function autorizar(...rolesPermitidos) {
  return function (req, res, next) {
    if (!req.usuario) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ error: 'No tenés permiso para esta acción' });
    }

    next();
  };
}

module.exports = autorizar;
