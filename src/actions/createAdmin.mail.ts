import { transporter } from "@/config/Nodemailer"

export const createAdminAccount = async(
    adminName:string,
    email:string,
    password:string
) =>{
      const res = await transporter.sendMail({
        from:`"Go Himalaya Holidays" <${process.env.EMAIL_USER}>`,
        to:email,
        subject: "Account created successfully",
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
                font-weight:bold;
              "
            >
              Go Himalaya Holidays
            </h1>

            <p
              style="
                margin-top:10px;
                font-size:16px;
                color:#e0e7ff;
              "
            >
              Explore The Beauty Of Himalayas
            </p>

          </div>

          <!-- Body -->
          <div
            style="
              padding:40px 30px;
              color:#111827;
            "
          >

            <h2
              style="
                margin-bottom:20px;
                font-size:24px;
              "
            >
              Hello ${adminName} 👋
            </h2>

            <p
              style="
                font-size:16px;
                line-height:28px;
                color:#4b5563;
              "
            >
              Your admin account has been created successfully.
              Welcome to <b>Go Himalaya Holidays</b>.
            </p>

            <!-- Credentials Box -->
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
                  margin-bottom:20px;
                  color:#111827;
                "
              >
                Login Credentials
              </h3>

              <p
                style="
                  margin:10px 0;
                  font-size:16px;
                  color:#374151;
                "
              >
                <b>Email:</b> ${email}
              </p>

              <p
                style="
                  margin:10px 0;
                  font-size:16px;
                  color:#374151;
                "
              >
                <b>Password:</b> ${password}
              </p>

            </div>

            <p
              style="
                margin-top:25px;
                font-size:15px;
                line-height:26px;
                color:#ef4444;
                font-weight:500;
              "
            >
              ⚠️ Please do not share your password with anyone.
            </p>

            <!-- Button -->
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
              font-size:14px;
              color:#6b7280;
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