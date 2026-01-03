import { useState } from "react";
import { loginApi, verifyOtpApi } from "../api/auth";
import "../styles/auth.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function Login() {
  const [step, setStep] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login: setLoginState } = useAuth();


  const login = async () => {
    const res = await loginApi({ email, password });
    setMessage(res.message);
    if (res.message && !res.token) setStep("otp");
  };

  const verifyOtp = async () => {
    const res = await verifyOtpApi({ email, otp });
    if (res.token) {
      localStorage.setItem("token", res.token);
      window.location.href = "/";
    } else {
      setMessage(res.message);
    }
  };

  return (
    <div className="auth-wrapper">
      

      <div className="card">
        <h2>Login</h2>

        {step === "login" && (
          <>
            <input
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={login}>Login</button>
          </>
        )}

        {step === "otp" && (
          <>
            <input
              placeholder="OTP"
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={verifyOtp}>Verify OTP</button>
          </>
        )}

        <p>{message}</p>
      </div>
    </div>
  );
}
