export default function Nav() {
    return (
        <header className="site-nav">
            <a className="brand" href="#top" aria-label="GlobeTrotter home">
                <span className="brand-mark" aria-hidden="true">✦</span>
                <span>GlobeTrotter</span>
            </a>
            <nav className="nav-links" aria-label="Main navigation">
                <a className="nav-link active" href="#overview">Overview</a>
                <a className="nav-link" href="#trips">My trips</a>
                <a className="nav-link" href="#explore">Explore</a>
            </nav>
            <button className="profile-button" type="button" aria-label="Open profile">
                <span className="profile-avatar" aria-hidden="true">AM</span>
                <span className="profile-name">Alex Morgan</span>
                <span className="chevron" aria-hidden="true">⌄</span>
            </button>
        </header>
    );
}