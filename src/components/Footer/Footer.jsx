import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-text">
          Made with ❤️ by <strong>Monika Basnet</strong>
        </p>
        <p className="footer-attribution">
          Data provided by{' '}
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            The Movie Database (TMDb)
          </a>
        </p>
        <p className="footer-disclaimer">
          This product uses the TMDb API but is not endorsed or certified by TMDb.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
