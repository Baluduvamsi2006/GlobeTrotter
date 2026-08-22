"use client";

import { useState } from "react";

type Profile = {
    firstName: string;
    lastName: string;
    email: string;
    city: string | null;
    country: string | null;
    additionalInfo: string | null;
    profilePhotoUrl: string | null;
};

export default function ProfileDetailsForm({ profile }: { profile: Profile }) {
    const [editing, setEditing] = useState(false);

    return (
        <form className="profile-form" action="/api/profile" method="post">
            <div className="profile-photo-row">
                <div className="profile-photo-wrap"><img src={profile.profilePhotoUrl || "/profile-placeholder.svg"} alt={`${profile.firstName} ${profile.lastName}`} /></div>
                <div className="profile-photo-copy"><h3>Profile photo</h3><p>Keep your travel identity recognisable.</p><label className="photo-url-label">Photo URL<input name="profilePhotoUrl" defaultValue={profile.profilePhotoUrl ?? ""} disabled={!editing} /></label></div>
            </div>
            <div className="form-grid">
                <label>First name<input name="firstName" defaultValue={profile.firstName} required disabled={!editing} /></label>
                <label>Last name<input name="lastName" defaultValue={profile.lastName} required disabled={!editing} /></label>
                <label className="full-field">Email address<input name="email" type="email" defaultValue={profile.email} required disabled={!editing} /></label>
                <label>City<input name="city" defaultValue={profile.city ?? ""} disabled={!editing} /></label>
                <label>Country<input name="country" defaultValue={profile.country ?? ""} disabled={!editing} /></label>
                <label className="full-field">About you<textarea name="additionalInfo" rows={4} defaultValue={profile.additionalInfo ?? ""} disabled={!editing} /></label>
            </div>
            <div className="profile-form-footer">
                <span>{editing ? "Update your details, then save when ready." : "Your profile is up to date."}</span>
                {editing ? <div className="profile-edit-actions"><button className="secondary-button" type="button" onClick={() => setEditing(false)}>Cancel</button><button className="primary-button" type="submit">Save changes</button></div> : <button className="primary-button" type="button" onClick={() => setEditing(true)}>Edit profile</button>}
            </div>
        </form>
    );
}