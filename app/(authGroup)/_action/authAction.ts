"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

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
            TENANT : "/dashboard/tenant?welcome=1",
            LANDLORD : "/dashboard/landlord/requests?welcome=1",
            ADMIN : "/dashboard/admin?welcome=1",
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
        redirect("/login?registered=1")
    }

    return result
}

export type UpdateProfileState = {
    success? : boolean,
    error? : string
} | undefined

export const updateProfileAction = async (prevState : UpdateProfileState , formData: FormData) : Promise<UpdateProfileState> => {

    const name = formData.get("name") as string
    const currentPassword = formData.get("currentPassword") as string
    const newPassword = formData.get("newPassword") as string

    if(newPassword && !currentPassword){
        return { error : "Enter your current password to set a new one." }
    }

    const payload: Record<string, string> = {}
    if(name) payload.name = name
    if(newPassword){
        payload.currentPassword = currentPassword
        payload.newPassword = newPassword
    }

    const cookieStore = await cookies()
    const accessToken = cookieStore.get("accessToken")?.value

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/me`, {
        method : "PATCH",
        headers : {
            "Content-Type" : "application/json",
            Authorization : `Bearer ${accessToken}`
        },
        body : JSON.stringify(payload)
    });

    const result = await res.json();

    if(!result.success){
        return { error : result.error ?? "Could not update your profile. Please try again." }
    }

    revalidatePath("/dashboard/profile")
    return { success : true }
}

export const logoutAction = async () => {
    const cookieStore = await cookies()

    cookieStore.delete("accessToken")
    cookieStore.delete("refreshToken")

    redirect("/?loggedOut=1")
}