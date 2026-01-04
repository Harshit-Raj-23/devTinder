const adminAuth = (req, res, next) => {
  const admin = "xyz";
  const isAdminAuthorized = admin === "xyz";
  if (!isAdminAuthorized) {
    res.status(401).send("Unauthorized access!");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  const user = "abc";
  const isUserAuthorized = user === "abc";
  if (!isUserAuthorized) {
    res.status(401).send("Unauthorized access!");
  } else {
    next();
  }
};

module.exports = { adminAuth, userAuth };
