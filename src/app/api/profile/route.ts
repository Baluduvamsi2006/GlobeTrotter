import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getProfileData, profileSelect } from "@/lib/profile-data";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
        return NextResponse.json(await getProfileData(session.user.id));
    } catch (error) {
        console.error("Unable to load profile", error);
        return NextResponse.json({ error: "Unable to connect to the database." }, { status: 503 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
        const body = await request.formData();
        const user = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                firstName: String(body.get("firstName") || ""),
                lastName: String(body.get("lastName") || ""),
                email: String(body.get("email") || ""),
                city: String(body.get("city") || "") || null,
                country: String(body.get("country") || "") || null,
                additionalInfo: String(body.get("additionalInfo") || "") || null,
                profilePhotoUrl: String(body.get("profilePhotoUrl") || "") || null,
            }, select: profileSelect,
        });
        return NextResponse.redirect(new URL("/profile", request.url), 303);
    } catch (error) {
        console.error("Unable to create profile", error);
        return NextResponse.json({ error: "Unable to save profile." }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
        const body = await request.json();
        const user = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                firstName: body.firstName, lastName: body.lastName, email: body.email,
                phoneNumber: body.phoneNumber || null, city: body.city || null,
                country: body.country || null, additionalInfo: body.additionalInfo || null,
                profilePhotoUrl: body.profilePhotoUrl || null,
            }, select: profileSelect,
        });
        return NextResponse.json({ user });
    } catch (error) {
        console.error("Unable to update profile", error);
        return NextResponse.json({ error: "Unable to update profile." }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
        const body = await request.json();
        await prisma.user.delete({ where: { id: session.user.id } });
        return NextResponse.json({ deleted: true });
    } catch (error) {
        console.error("Unable to delete profile", error);
        return NextResponse.json({ error: "Unable to delete profile." }, { status: 500 });
    }
}
