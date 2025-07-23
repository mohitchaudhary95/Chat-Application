const bcrypt = require("bcrypt");
const { User, validateRegister } = require("../models/userModel.js");
const { Token } = require("../models/tokenModel.js");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto");

const registerController = async (req, res) => {
  try {
    const { error } = validateRegister(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    let user = await User.findOne({ email: req.body.email });

    if (user && user.verified) {
      return res
        .status(409)
        .send({ message: "User with this email already exists and is verified." });
    }

    if (!user) {
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(req.body.password, salt);
      user = await new User({ ...req.body, password: hashPassword }).save();
    }

    const existingToken = await Token.findOne({ userId: user._id });
    if (existingToken) {
      await existingToken.deleteOne();
    }

    const verificationToken = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();

    const url = `${process.env.CLIENT_URL}/users/${user._id}/verify/${verificationToken.token}`;
    
    await sendEmail(user.email, "Verify Your Email", `Click this link to verify your email: ${url}`);
    
    user.verificationLinkSent = true;
    await user.save();

    res.status(201).send({ message: `A new verification email has been sent to ${user.email}. Please check your inbox.` });

  } catch (error) {
    console.error("Error in registerController:", error);
    if (error.command === 'CONN') {
        return res.status(500).send({ message: "Failed to connect to email server. Please check your configuration." });
    }
    res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = registerController;