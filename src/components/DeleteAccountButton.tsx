"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export default function DeleteAccountButton() {
    const [confirming, setConfirming] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    async function deleteAccount() {
        setDeleting(true);
        setError("");
        const response = await fetch("/api/profile", { method: "DELETE" });
        if (!response.ok) {
            setError("We could not delete your account. Please try again.");
            setDeleting(false);
            return;
        }
        await signOut({ callbackUrl: "/login" });
    }

    if (!confirming) {
        return <button className="delete-account" type="button" onClick={() => setConfirming(true)}>Delete account</button>;
    }

    return <div className="delete-account-panel" role="alert">
        <strong>Delete your account?</strong>
        <p>This permanently removes your profile, trips, and saved places.</p>
        {error && <span className="delete-account-error">{error}</span>}
        <div className="profile-edit-actions"><button className="secondary-button" type="button" onClick={() => setConfirming(false)} disabled={deleting}>Cancel</button><button className="delete-account-confirm" type="button" onClick={deleteAccount} disabled={deleting}>{deleting ? "Deleting..." : "Yes, delete it"}</button></div>
    </div>;
}