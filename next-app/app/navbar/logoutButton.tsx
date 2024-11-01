'use client'
import { useAuth } from "@/context/authContext";

export default function LogoutButton() {
    const { logout } = useAuth();

    return (
    <button onClick={() => logout()}>
        <div className="border-2 border-neutral-400 rounded-lg p-2">
            <span className="text-neutral-400">Выйти</span>
        </div>
    </button>
    );
}