type Props = { name: string; otp: number };

export default function accountSetupTemplate({ name, otp }: Props) {
  return `
    <div>
        <p>Dear, ${name || "User"}</p>
        <p>Please use following OTP code to access your account.</p>
        <div style="background:#00FFFF; font-size:20px;padding:20px;text-align:center;font-weight : 800;">
            ${otp}
        </div>
        <p>This otp is valid for 1 hour only.</p>
        <br/>
        </br>
        <p>Thanks</p>
        <p>FundaMentalEureka</p>
    </div>
        `;
}
