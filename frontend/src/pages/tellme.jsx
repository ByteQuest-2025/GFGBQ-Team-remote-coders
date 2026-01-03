import { useState } from "react";
import "../styles/tellme.css";

export default function Tellme() {
  const [age, setAge] = useState("");
  const [hours, setHours] = useState(8);
  const [workMode, setWorkMode] = useState("work_from_home");
  const [role, setRole] = useState("student");
  const [otherRole, setOtherRole] = useState("");
  const [submitted, setSubmitted] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const roleValue = role === "other" ? otherRole : role;
    setSubmitted({ age, hours, workMode, role: roleValue });
  };

  return (
    <div className="tellme-page">
      <div className="tellme-container">
        <center><h2 className="tellme-title">User Work Information</h2></center>

        <form onSubmit={handleSubmit} className="tellme-form">
          <label className="tt-label">
            Age:
            <input
              type="number"
              min={0}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              className="tt-input"
            />
          </label>

          <label>
            Working hours per day:
            <input
              type="number"
              min={0}
              max={24}
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              required
              className="tt-input"
            />
          </label>

          <fieldset className="tt-fieldset">
            <legend>Work mode:</legend>
            <label style={{ marginRight: 12 }}>
              <input
                type="radio"
                name="workMode"
                value="work_from_home"
                checked={workMode === "work_from_home"}
                onChange={() => setWorkMode("work_from_home")}
              />
              Work from home
            </label>
            <label>
              <input
                type="radio"
                name="workMode"
                value="on_site"
                checked={workMode === "on_site"}
                onChange={() => setWorkMode("on_site")}
              />
              On site
            </label>
          </fieldset>

          <fieldset className="tt-fieldset">
            <legend>Role:</legend>
            <label style={{ marginRight: 12 }}>
              <input
                type="radio"
                name="role"
                value="student"
                checked={role === "student"}
                onChange={() => setRole("student")}
              />
              Student
            </label>
            <label style={{ marginRight: 12 }}>
              <input
                type="radio"
                name="role"
                value="working"
                checked={role === "working"}
                onChange={() => setRole("working")}
              />
              Working
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="other"
                checked={role === "other"}
                onChange={() => setRole("other")}
              />
              Other
            </label>

            {role === "other" && (
              <div className="tt-other">
                <label className="tt-label">
                  Please describe:
                  <input
                    type="text"
                    value={otherRole}
                    onChange={(e) => setOtherRole(e.target.value)}
                    required
                    className="tt-input tt-input-wide"
                    placeholder="E.g., freelancer, researcher, etc."
                  />
                </label>
              </div>
            )}
          </fieldset>

          <div className="tt-submit">
            <button type="submit">Submit</button>
          </div>
        </form>

        {submitted && (
          <div className="tt-submitted">
            <h3>Submitted</h3>
            <pre>{JSON.stringify(submitted, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
