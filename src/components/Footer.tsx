export default function Footer() {
    return (
        <footer className="site-footer">
            <span>&copy; {new Date().getFullYear()} GlobeTrotter</span>
            <div className="footer-links">
                <a href="#help">Help center</a>
                <a href="#privacy">Privacy</a>
                <a href="#terms">Terms</a>
            </div>
        </footer>
    );
}