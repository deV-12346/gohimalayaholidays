import { transporter } from "@/config/Nodemailer"

export const sendOTP = async(email:string,customerName:string,otp:number,otpExpiry:Date)=>{
    await transporter.sendMail({
        from:`"Go Himalaya Holidays" <${process.env.EMAIL_USER}>`,
        to:email,
        subject: "Please Verify your Email",
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
            Verify Your Email
          </p>

        </div>

        <div
          style="
            padding:40px 30px;
          "
        >
          <h2>
            Hello ${customerName} 👋
          </h2>

          <p
            style="
              color:#4b5563;
              line-height:28px;
            "
          >
            Use the OTP below
            to verify your booking.
          </p>
          <div
            style="
              margin:30px 0;
              text-align:center;
            "
          >
            <span
              style="
                display:inline-block;
                background:#eef2ff;
                color:#4f46e5;
                font-size:32px;
                font-weight:bold;
                letter-spacing:8px;
                padding:18px 30px;
                border-radius:14px;
              "
            >
              ${otp}
            </span>
          </div>
          <p
            style="
              color:#ef4444;
              font-size:14px;
            "
          >
            OTP expires in
            5 minutes.
          </p>
        </div>
      </div>
    `,
    })
}