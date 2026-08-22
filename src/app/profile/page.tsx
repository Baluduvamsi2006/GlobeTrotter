import Link from "next/link";
import { redirect } from "next/navigation";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import ProfileDetailsForm from "@/components/ProfileDetailsForm";
import DeleteAccountButton from "@/components/DeleteAccountButton";
import { auth, signOut } from "@/auth";
import { getProfileData } from "@/lib/profile-data";

export default async function ProfilePage() {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) redirect("/login?callbackUrl=/profile");

    let profileData;
    let databaseError = false;
    try {
        profileData = await getProfileData(userId);
    } catch (error) {
        console.error("Unable to load profile", error);
        databaseError = true;
    }

    const profile = profileData?.user;
    const destinations = profileData?.savedDestinations ?? [];
    const preplannedTrips = profileData?.preplannedTrips ?? [];
    const completedTrips = profileData?.completedTrips ?? [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const formatDate = (date: Date) => date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const renderTrip = (trip: typeof preplannedTrips[number]) => {
        const place = trip.tripPlaces[0]?.place;
        return <article className="profile-trip-card" key={trip.id}>
            <div className="profile-trip-image" style={{ backgroundImage: `url(${trip.coverPhotoUrl || place?.photoUrl || "/profile-placeholder.svg"})` }} />
            <div className="profile-trip-content"><div><span className="profile-trip-status">{trip.endDate >= today ? "UPCOMING" : "COMPLETED"}</span><h3>{trip.title}</h3><p>{place ? `${place.city}, ${place.country}` : "Destination to be confirmed"}</p></div><div className="profile-trip-meta"><span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>{trip.totalBudget && <span>${Number(trip.totalBudget).toLocaleString()} budget</span>}</div><Link className="trip-view-link" href="/trips">View trip <span aria-hidden="true">→</span></Link></div>
        </article>;
    };

    return (
        <div className="app-shell">
            <Nav />
            <main className="profile-page">
                <div className="profile-page-heading">
                    <div>
                        <p className="eyebrow">YOUR ACCOUNT</p>
                        <h1>Profile & settings</h1>
                        <p>Manage your personal details, preferences, and saved places.</p>
                    </div>
                    <div className="profile-page-actions">
                        <Link className="back-link" href="/">← Back to overview</Link>
                        <form action={async () => {
                            "use server";
                            await signOut({ redirectTo: "/login" });
                        }}>
                            <button className="sign-out-button" type="submit">Sign out</button>
                        </form>
                    </div>
                </div>
                {databaseError && <div className="profile-alert" role="alert"><span>!</span>We could not reach the profile database.</div>}
                {!databaseError && !profile && <div className="profile-alert" role="alert"><span>!</span>Your profile could not be found.</div>}
                {profile && (
                    <div className="profile-layout">
                        <section className="profile-card profile-details-card">
                            <div className="profile-card-heading"><div><p className="eyebrow">PERSONAL DETAILS</p><h2>Your information</h2></div><span className="edit-label">Editable</span></div>
                            <ProfileDetailsForm profile={profile} />
                        </section>
                        <aside className="profile-side">
                            <section className="profile-card preference-card"><p className="eyebrow">PREFERENCES</p><h2>Travel preferences</h2><label>Language<select defaultValue="English"><option>English</option><option>Spanish</option><option>French</option></select></label><label className="toggle-row"><span><strong>Email updates</strong><small>Get inspiration and trip reminders</small></span><input type="checkbox" defaultChecked /></label></section>
                            <section className="profile-card saved-card"><div className="profile-card-heading"><div><p className="eyebrow">YOUR COLLECTION</p><h2>Saved destinations</h2></div><span className="saved-count">{destinations.length}</span></div>{destinations.length ? <div className="saved-list">{destinations.map((destination) => <div className="saved-item" key={destination.id}><img src={destination.photoUrl || "/profile-placeholder.svg"} alt="" /><div><strong>{destination.name}</strong><small>{destination.city}, {destination.country}</small></div></div>)}</div> : <p className="empty-saved">No saved destinations yet.</p>}</section>
                            <DeleteAccountButton />
                        </aside>
                    </div>
                )}
                {profile && <section className="profile-trips-section">
                    <div className="profile-section-heading"><div><p className="eyebrow">YOUR TRAVEL HISTORY</p><h2>Trips at a glance</h2></div><Link className="back-link" href="/trips">All trips →</Link></div>
                    <div className="profile-trip-group"><div className="profile-trip-group-heading"><div><h3>Preplanned trips</h3><p>Trips still ahead on your calendar</p></div><span>{preplannedTrips.length}</span></div>{preplannedTrips.length ? <div className="profile-trip-grid">{preplannedTrips.map(renderTrip)}</div> : <div className="profile-empty-trips"><strong>Your next adventure is waiting.</strong><span>Start planning a trip and it will appear here.</span><Link className="primary-button" href="/create-trip">Plan a trip</Link></div>}</div>
                    <div className="profile-trip-group completed-trip-group"><div className="profile-trip-group-heading"><div><h3>Completed trips</h3><p>Places you have already explored</p></div><span>{completedTrips.length}</span></div>{completedTrips.length ? <div className="profile-trip-grid">{completedTrips.map(renderTrip)}</div> : <div className="profile-empty-trips"><strong>No completed trips yet.</strong><span>Your finished journeys will be kept here.</span></div>}</div>
                </section>}
            </main>
            <Footer />
        </div>
    );
}
