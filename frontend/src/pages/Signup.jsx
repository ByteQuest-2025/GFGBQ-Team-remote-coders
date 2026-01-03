import { useState } from "react";
import { signupApi } from "../api/auth";
import "../styles/auth.css";

export default function Signup() {
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState("");

  const signup = async () => {
    const res = await signupApi(form);
    setMsg(res.message);

    if (res.message?.includes("success")) {
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    }
  };

  return (
    <div className="auth-wrapper">
      

      <div className="card">
        <h2>Signup</h2>

        <input
          placeholder="Name"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />
        <input
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="Confirm Password"
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
        />

        <button onClick={signup}>Signup</button>
        <p>{msg}</p>
      </div>
    </div>
  );
}
