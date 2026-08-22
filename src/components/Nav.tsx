import { auth, signOut } from '@/auth';

export default async function Nav() {
    const session = await auth();
    const initials = session?.user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2) || 'U';

    return (
        <header className="site-nav">
            <a className="brand" href="/" aria-label="GlobeTrotter home">
                <span className="brand-mark" aria-hidden="true">✈</span>
                <span>GlobeTrotter</span>
            </a>
            <nav className="nav-links" aria-label="Main navigation">
                <a className="nav-link active" href="/#overview">Overview</a>
                <a className="nav-link" href="/build-itinerary">Build Itinerary</a>
                <a className="nav-link" href="/create-trip">Create Trip</a>
                <a className="nav-link" href="/trips">My trips</a>
                <a className="nav-link" href="/#explore">Explore</a>
            </nav>
            {session?.user ? (
                <form action={async () => {
                    'use server';
                    await signOut();
                }} style={{ marginLeft: 'auto' }}>
                    <button className="profile-button" type="submit" aria-label="Sign out" title="Sign Out">
                        <span className="profile-avatar" aria-hidden="true">{initials}</span>
                        <span className="profile-name">{session.user.name}</span>
                        <span className="chevron" aria-hidden="true">⏏</span>
                    </button>
                </form>
            ) : (
                <a href="/login" className="primary-button" style={{ marginLeft: 'auto' }}>Sign In</a>
            )}
        </header>
    );
}