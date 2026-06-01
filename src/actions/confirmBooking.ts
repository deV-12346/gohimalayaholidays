import { transporter }
from "@/config/Nodemailer"

export const confirmBooking = async (customerName: string,packageName: string,email: string) => {
    await transporter.sendMail({
    from: `"Go Himalaya Holidays" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Booking Confirmed 🎉",
    html: `
      <div
        style="
          max-width:600px;
          margin:auto;
          background:#ffffff;
          border-radius:20px;
          overflow:hidden;
          border:1px solid #e5e7eb;
          font-family:Arial,sans-serif;
        "
      >

        <!-- Header -->

        <div
          style="
            background:#4f46e5;
            padding:40px 20px;
            text-align:center;
            color:white;
          "
        >

          <h1
            style="
              margin:0;
              font-size:32px;
            "
          >
            Go Himalaya Holidays
          </h1>

          <p
            style="
              margin-top:10px;
              color:#e0e7ff;
            "
          >
            Your Trip Is Confirmed 🎉
          </p>

        </div>

        <!-- Body -->

        <div
          style="
            padding:40px 30px;
            color:#111827;
          "
        >

          <h2>
            Hello ${customerName} 👋
          </h2>

          <p
            style="
              line-height:28px;
              color:#4b5563;
              font-size:16px;
            "
          >
            Your booking has been
            successfully confirmed.
          </p>

          <div
            style="
              margin-top:30px;
              background:#f9fafb;
              border:1px solid #e5e7eb;
              border-radius:16px;
              padding:25px;
            "
          >

            <h3
              style="
                margin-top:0;
              "
            >
              Booking Details
            </h3>

            <p
              style="
                font-size:16px;
                color:#374151;
              "
            >
              <b>Package:</b>
              ${packageName}
            </p>

            <p
              style="
                font-size:16px;
                color:#10b981;
                font-weight:bold;
              "
            >
              Booking Status:
              Confirmed
            </p>
          </div>
          <div
            style="
              margin-top:35px;
              text-align:center;
            "
          >
            <a
              href="https://gohimalayaholidays.com"
              style="
                display:inline-block;
                background:#4f46e5;
                color:white;
                text-decoration:none;
                padding:14px 30px;
                border-radius:999px;
                font-size:16px;
                font-weight:600;
              "
            >
              Visit Website
            </a>
          </div>
        </div>
        <!-- Footer -->
        <div
          style="
            background:#f9fafb;
            padding:25px;
            text-align:center;
            color:#6b7280;
            font-size:14px;
          "
        >
          <p style="margin:0;">
            © 2026 Go Himalaya Holidays
          </p>
          <p style="margin-top:8px;">
            Himachal Pradesh, India
          </p>
        </div>
      </div>
    `,
  })
}