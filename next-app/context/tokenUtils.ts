import { jwtDecode } from "jwt-decode";

export const getCurrentUser = (token: string | null | undefined) => {

    if (!token) {
        return null;
    }

    const userName = jwtDecode(token).sub;
    if (!userName) {
        return null;
    }

    return userName;
};