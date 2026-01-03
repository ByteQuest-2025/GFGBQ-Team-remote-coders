import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">

        {/* BRAND */}
        <div className="footer-brand">
          <h3>SilentSense<span>AI</span></h3>
          <p>
            AI-powered preventive healthcare platform designed
            to detect silent diseases before symptoms appear.
          </p>
        </div>

        {/* LINKS */}
        <div className="footer-links">
          <div>
            <h4>Product</h4>
            <ul>
              <li>Platform</li>
              <li>How It Works</li>
              <li>Research</li>
            </ul>
          </div>

          <div>
            <h4>Company</h4>
            <ul>
              <li>About</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>

          <div>
            <h4>Legal</h4>
            <ul>
              <li>Privacy Policy</li>
              <li>Terms of Use</li>
            </ul>
          </div>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="footer-bottom">
        © {new Date().getFullYear()} SilentSenseAI. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
