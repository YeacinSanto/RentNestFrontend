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

        const meRes = await fetch(`${process.env.BACKEND_API_URL}/api/auth/me`, {
            headers : {
                Authorization : `Bearer ${result.data.accessToken}`
            }
        });
        const me = await meRes.json();

        const dashboardByRole : Record<string, string> = {
            TENANT : "/dashboard/tenant",
            LANDLORD : "/dashboard/landlord",
            ADMIN : "/dashboard/admin",
        }

        redirect(me.success ? dashboardByRole[me.data.role] : "/")
    }

    return result
}

export type RegisterState = {
    success : false,
    statusCode : number,
    message : string,
    error : string
} | undefined

export const registerAction = async (prevState : RegisterState , formData: FormData) : Promise<RegisterState> => {

    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const role = formData.get("role");

    const payload = {
        name,
        email,
        password,
        role
    }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/register`, {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(payload)
    });

    const result = await res.json();

    if(result.success){
        redirect("/login")
    }

    return result
}

export const logoutAction = async () => {
    const cookieStore = await cookies()

    cookieStore.delete("accessToken")
    cookieStore.delete("refreshToken")

    redirect("/")
}