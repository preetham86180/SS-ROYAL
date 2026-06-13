import nodemailer from "nodemailer";

export async function sendReceiptEmail(
  to: string,
  name: string,
  amount: number,
  propertyTitle: string,
  transactionId: string
) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-w-md; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #111827; text-align: center;">Payment Receipt</h2>
        <p style="color: #374151;">Dear ${name},</p>
        <p style="color: #374151;">Thank you for your payment. We have successfully received your transaction.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 20px;">
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px 0; color: #6b7280;">Property:</td>
            <td style="padding: 10px 0; text-align: right; color: #111827; font-weight: bold;">${propertyTitle}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px 0; color: #6b7280;">Amount Paid:</td>
            <td style="padding: 10px 0; text-align: right; color: #111827; font-weight: bold;">₹${amount.toLocaleString()}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px 0; color: #6b7280;">Transaction ID:</td>
            <td style="padding: 10px 0; text-align: right; color: #111827; font-weight: bold;">${transactionId}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px 0; color: #6b7280;">Date:</td>
            <td style="padding: 10px 0; text-align: right; color: #111827; font-weight: bold;">${new Date().toLocaleDateString()}</td>
          </tr>
        </table>
        
        <p style="color: #374151; font-size: 14px; text-align: center;">If you have any questions, please contact our support team.</p>
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">Lumina Estates</p>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"Lumina Estates" <${process.env.SMTP_USER}>`,
      to,
      subject: `Payment Receipt - ${propertyTitle}`,
      html: htmlContent,
    });

    console.log("Message sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
