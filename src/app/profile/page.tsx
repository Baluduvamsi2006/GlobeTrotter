import Link from "next/link";
import { redirect } from "next/navigation";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
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
                            <form className="profile-form" action="/api/profile" method="post">
                                <div className="profile-photo-row"><div className="profile-photo-wrap"><img src={profile.profilePhotoUrl || "/profile-placeholder.svg"} alt={`${profile.firstName} ${profile.lastName}`} /></div><div><h3>Profile photo</h3><p>Use a photo that helps your travel companions recognise you.</p><label className="photo-url-label">Photo URL<input name="profilePhotoUrl" defaultValue={profile.profilePhotoUrl ?? ""} /></label></div></div>
                                <div className="form-grid"><label>First name<input name="firstName" defaultValue={profile.firstName} required /></label><label>Last name<input name="lastName" defaultValue={profile.lastName} required /></label><label className="full-field">Email address<input name="email" type="email" defaultValue={profile.email} required /></label><label>City<input name="city" defaultValue={profile.city ?? ""} /></label><label>Country<input name="country" defaultValue={profile.country ?? ""} /></label><label className="full-field">About you<textarea name="additionalInfo" rows={4} defaultValue={profile.additionalInfo ?? ""} /></label></div>
                                <div className="profile-form-footer"><span>Changes are saved to your account.</span><button className="primary-button" type="submit">Save changes</button></div>
                            </form>
                        </section>
                        <aside className="profile-side">
                            <section className="profile-card preference-card"><p className="eyebrow">PREFERENCES</p><h2>Travel preferences</h2><label>Language<select defaultValue="English"><option>English</option><option>Spanish</option><option>French</option></select></label><label className="toggle-row"><span><strong>Email updates</strong><small>Get inspiration and trip reminders</small></span><input type="checkbox" defaultChecked /></label></section>
                            <section className="profile-card saved-card"><div className="profile-card-heading"><div><p className="eyebrow">YOUR COLLECTION</p><h2>Saved destinations</h2></div><span className="saved-count">{destinations.length}</span></div>{destinations.length ? <div className="saved-list">{destinations.map((destination) => <div className="saved-item" key={destination.id}><img src={destination.photoUrl || "/profile-placeholder.svg"} alt="" /><div><strong>{destination.name}</strong><small>{destination.city}, {destination.country}</small></div></div>)}</div> : <p className="empty-saved">No saved destinations yet.</p>}</section>
                            <button className="delete-account" type="button">Delete account</button>
                        </aside>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
