import { getCurrentUser } from "@/context/tokenUtils";
import Link from "next/link";
import { cookies } from "next/headers";
import LogoutButton from "./logoutButton";

export default async function AuthButtons() {
    const cookieStore = await cookies();
    const userName = getCurrentUser(cookieStore.get('refresh_token')?.value);

    return (
        <div>
            {userName ? (
                <div className="flex gap-5">
                    <Link href={`/user/${userName}`}>
                        <div className="border-2 border-neutral-400 rounded-lg p-2">
                            <span className="text-neutral-400">{userName}</span>
                        </div>
                    </Link>
                    <LogoutButton/>
                </div>
            ) : (
                <div className="flex gap-5">
                    <Link href={`/login`}>
                        <div className="border-2 border-neutral-400 rounded-lg p-2">
                            <span className="text-neutral-400">Войти</span>
                        </div>
                    </Link>
                    <Link href={`/register`}>
                        <div className="border-2 border-neutral-400 rounded-lg p-2">
                            <span className="text-neutral-400">Регистрация</span>
                        </div>
                    </Link>
                </div>
            )}
        </div>
    );
};