"use client"

import { useEffect, useState } from "react";

export default function UserName({ user, position = "left" }) {
    const [userName, setUserName] = useState("");
    const [userInitials, setUserInitials] = useState("");

    useEffect(() => {
        if (user) {
            // Check if it's a demo user
            if (user.email === 'demo@example.com') {
                setUserName('Demo User');
                setUserInitials('D');
            } else {
                const name = user.user_metadata?.name || "User";
                setUserName(name);
                setUserInitials(getInitials(name));
            }
        }
    }, [user]);

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(part => part.charAt(0).toUpperCase())
            .join('');
    };

    if (!user) {
        return (
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse flex items-center justify-center">
                <div className="w-6 h-6"></div>
            </div>
        );
    }

    return (
        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
            <span className="text-white font-medium text-sm">{userInitials}</span>
        </div>
    );
}
