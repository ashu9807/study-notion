const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate") ;
const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 60 * 5,
  },
});

async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email from Study Notion",
      emailTemplate(otp)
    );
    console.log("Email sent Successfully", mailResponse);
  } catch (error) {
    console.log("error Occured while sending Mails", error);
    throw error;
  }
}
OTPSchema.pre("save", async function (next) {

  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }
  next();
});

const OTP = mongoose.model("OTP", OTPSchema);


module.exports = OTP;
