import { transporter } from "@/config/Nodemailer";
export const sendEnquiryConfirmation = async (
  name: string,
  email: string,
  phoneNumber: string,
  message: string
) => {
  const res = await transporter.sendMail({
    from: `"Go Himalaya Holidays" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "We've Received Your Enquiry – Go Himalaya Holidays",
    html: `
      <div
        style="
          max-width:600px;
          margin:auto;
          font-family:Arial,sans-serif;
          background:#ffffff;
          border-radius:20px;
          overflow:hidden;
          border:1px solid #e5e7eb;
        "
      >
        <div
          style="
            background:#4f46e5;
            padding:40px 20px;
            text-align:center;
            color:white;
          "
        >
          <h1 style="margin:0;font-size:32px;">Go Himalaya Holidays</h1>
          <p style="margin-top:10px;color:#e0e7ff;">Enquiry Confirmation</p>
        </div>

        <div style="padding:40px 30px;">
          <h2>Hello ${name} 👋</h2>
          <p style="color:#4b5563;line-height:28px;">
            Thank you for reaching out to us! We have received your enquiry
            and our team will get back to you within <strong>24–48 hours</strong>.
          </p>

          <div
            style="
              background:#f9fafb;
              border-radius:12px;
              padding:24px;
              margin:24px 0;
              border:1px solid #e5e7eb;
            "
          >
            <h3 style="margin:0 0 16px;color:#111827;">Your Enquiry Details</h3>
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:8px 0;color:#6b7280;width:40%;">Name</td>
                <td style="padding:8px 0;color:#111827;font-weight:600;">${name}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#6b7280;">Email</td>
                <td style="padding:8px 0;color:#111827;font-weight:600;">${email}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#6b7280;">Phone</td>
                <td style="padding:8px 0;color:#111827;font-weight:600;">${phoneNumber}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#6b7280;vertical-align:top;">Message</td>
                <td style="padding:8px 0;color:#111827;">${message}</td>
              </tr>
            </table>
          </div>

          <p style="color:#4b5563;line-height:28px;">
            In the meantime, feel free to explore our packages or reach us at
            <a href="mailto:${process.env.EMAIL_USER}" style="color:#4f46e5;">${process.env.EMAIL_USER}</a>.
          </p>
        </div>

        <div
          style="
            background:#f9fafb;
            padding:20px;
            text-align:center;
            color:#9ca3af;
            font-size:13px;
            border-top:1px solid #e5e7eb;
          "
        >
          © ${new Date().getFullYear()} Go Himalaya Holidays. All rights reserved.
        </div>
      </div>
    `,
  });
  console.log("res ",res)
};


export const sendEnquiryAdminAlert = async (
  name: string,
  email: string,
  adminemail:string,
  phoneNumber: string,
  message: string
) => {
  const res = await transporter.sendMail({
    from: `"Go Himalaya Holidays" <${process.env.EMAIL_USER}>`,
    to: adminemail,
    subject: `📩 New Enquiry from ${name}`,
    html: `
      <div
        style="
          max-width:600px;
          margin:auto;
          font-family:Arial,sans-serif;
          background:#ffffff;
          border-radius:20px;
          overflow:hidden;
          border:1px solid #e5e7eb;
        "
      >
        <div
          style="
            background:#111827;
            padding:40px 20px;
            text-align:center;
            color:white;
          "
        >
          <h1 style="margin:0;font-size:28px;">New Enquiry Received</h1>
          <p style="margin-top:10px;color:#9ca3af;">Go Himalaya Holidays — Admin Alert</p>
        </div>

        <div style="padding:40px 30px;">
          <p style="color:#4b5563;line-height:28px;">
            A new enquiry has been submitted. Here are the details:
          </p>

          <div
            style="
              background:#f9fafb;
              border-radius:12px;
              padding:24px;
              margin:24px 0;
              border:1px solid #e5e7eb;
            "
          >
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:10px 0;color:#6b7280;width:40%;border-bottom:1px solid #e5e7eb;">Name</td>
                <td style="padding:10px 0;color:#111827;font-weight:600;border-bottom:1px solid #e5e7eb;">${name}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#6b7280;border-bottom:1px solid #e5e7eb;">Email</td>
                <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;">
                  <a href="mailto:${email}" style="color:#4f46e5;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#6b7280;border-bottom:1px solid #e5e7eb;">Phone</td>
                <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;">
                  <a href="tel:${phoneNumber}" style="color:#4f46e5;">${phoneNumber}</a>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#6b7280;vertical-align:top;">Message</td>
                <td style="padding:10px 0;color:#374151;">${message}</td>
              </tr>
            </table>
          </div>

          <p style="color:#6b7280;font-size:13px;">
            Received on ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
          </p>
        </div>

        <div
          style="
            background:#f9fafb;
            padding:20px;
            text-align:center;
            color:#9ca3af;
            font-size:13px;
            border-top:1px solid #e5e7eb;
          "
        >
          © ${new Date().getFullYear()} Go Himalaya Holidays. All rights reserved.
        </div>
      </div>
    `,
  });
  console.log("res",res)
};