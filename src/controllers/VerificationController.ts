import express from "express";
import nodemailer from "nodemailer";
import { storeOtp, verifyOtp } from "../services/VerificationServices";
import UserService from "../services/UserServices";

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail", // Replace with your email service
  auth: {
    user: process.env.EMAIL,         // Your email address
    pass: process.env.EMAIL_PASSWORD // Your email password
  }
});

class VerificationController {
  /**
   * Sends an OTP to the provided email
   */
  static async sendOtp(request: express.Request, response: express.Response) {
    const { email } = request.body;

    if (!email) {
      return response.status(400).send("Email is required");
    }

    try {
      // Generate and store OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await storeOtp(email, otp);

      // Send the OTP via email
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is ${otp}. It will expire in 10 minutes.`
      });

      response.status(200).send("OTP has been sent to your email");
    } catch (error) {
      console.error("Error sending OTP:", error);
      response.status(500).send("Failed to send OTP");
    }
  }

  /**
   * Verifies the OTP provided by the user
   */
  static async verifyOtp(request: express.Request, response: express.Response) {
    const { email, otp } = request.body;
    if (!email || !otp) {
      return response.status(400).send("Email and OTP are required");
    }

    try {
      // Verify the OTP
      const otpVerified = await verifyOtp(email, otp);
      if (otpVerified) { 
        UserService.updateUserby(email, "is_verified", true)
      }
      response.status(200).send("Email verification successful");
    } catch (error: any) {
      console.error("OTP verification error:", error);
      response.status(400).send(error.message);
    }
  }
}

export default VerificationController;


