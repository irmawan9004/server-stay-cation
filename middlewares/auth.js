const isLogin = (req, res, next) => {
  if (req.session.user == null || req.session.user == undefined) {
    req.flash("alertMessage", `Sesi Login Habis`);
    req.flash("statusMessage", "danger");
    res.redirect("/admin/signin");
  } else {
    next();
  }
};

module.exports = isLogin;
