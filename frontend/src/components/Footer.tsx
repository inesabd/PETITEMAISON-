import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="pm-footer">
      <div className="pm-container">
        <div className="pm-footer-inner">
          <p className="pm-footer-text">
            © 2025 PETITEMAISON. Tous droits réservés.
          </p>
          <nav className="pm-footer-links">
            <Link to="#" className="pm-footer-link">Mentions légales</Link>
            <Link to="#" className="pm-footer-link">CGV</Link>
            <Link to="#" className="pm-footer-link">Contact</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
