"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export type LoginState = {
    success : false,
    statusCode : number,
    message : string,
    error : string
} | undefined


export const loginAction = async (prevState : LoginState , formData: FormData) : Promise<LoginState> => {

    const email = formData.get("email");
    const password = formData.get("password");

    const payload = {
        email,
        password
    }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/login`, {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(payload)
    });

    const result = await res.json();

    if(result.success){
        const cookieStore = await cookies()

        cookieStore.set("accessToken", result.data.accessToken , {
            httpOnly : true,
            maxAge : 60 * 60 * 24,
            sameSite : "lax",
        });
        cookieStore.set("refreshToken", result.data.refreshToken , {
            httpOnly : true,
            maxAge : 60 * 60 * 24 * 7,
            sameSite : "lax",
        });

        redirect("/dashboard")
    }

    return result
}