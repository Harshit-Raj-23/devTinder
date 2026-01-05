const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, email, password } = req.body;
  if (!firstName) {
    throw new Error("First Name is required.");
  } else if (firstName < 1 || firstName > 50) {
    throw new Error("First Name must be between 1-50.");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is not valid.");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is weak.");
  }
};

module.exports = { validateSignupData };
