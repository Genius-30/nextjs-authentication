import { EMAIL_TYPE_RESET, EMAIL_TYPE_VERIFY } from "@/constants";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";
import { User } from "@/models/user.model";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);
    const expiryTime = Date.now() + 3600000;

    const emailHTML =
      emailType === EMAIL_TYPE_VERIFY
        ? `<p>Click <a href="${process.env.DOMAIN}/verify-email?token=${hashedToken}">here</a> to verify your email or copy and paste the link below in your browser. <br/>${process.env.DOMAIN}/verify-email?token=${hashedToken}</p>`
        : `<p>Click <a href="${process.env.DOMAIN}/forgotPassword?token=${hashedToken}">here</a> to reset your password or copy and paste the link below in your browser. <br/>${process.env.DOMAIN}/forgotPassword?token=${hashedToken}</p>`;

    if (emailType === EMAIL_TYPE_VERIFY) {
      await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            verifyToken: hashedToken,
            verifyTokenExpiry: expiryTime,
          },
        },
        { new: true }
      );
    } else if (emailType === EMAIL_TYPE_RESET) {
      await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            forgotPasswordToken: hashedToken,
            forgotPasswordTokenExpiry: expiryTime,
          },
        },
        { new: true }
      );
    }

    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT as string, 10),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject:
        emailType === EMAIL_TYPE_VERIFY
          ? "Verify your email"
          : "Reset your password",
      html: emailHTML,
    };

    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
