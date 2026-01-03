import { useEffect, useState } from "react";
// import "../styles/dashboard.css";

export default function Dashboard() {
  const [section, setSection] = useState("home");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "/";
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo">MyApp</div>
        <ul className="nav-links">
          <li onClick={() => setSection("home")}>Home</li>
          <li onClick={() => setSection("about")}>About</li>
          <li onClick={() => setSection("contact")}>Contact</li>
        </ul>
        <button onClick={logout}>Logout</button>
      </nav>

      <div className="content">
        {section === "home" && <h2>Welcome to Dashboard</h2>}
        {section === "about" && <h2>About Us</h2>}
        {section === "contact" && <h2>Contact Us</h2>}
      </div>
    </>
  );
}
