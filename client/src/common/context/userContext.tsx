import React, { createContext, useContext } from "react";

import { UseMutateFunction, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import cookieManager from 'js-cookie';

import { useCreateSocketConnection } from "./socketContext";

export type UserData = {
    _id: string;
    name: string;
    phoneNumber: string;
}

interface UserContextValue {
    user: UserData | null;
    login: UseMutateFunction<AxiosResponse<any, any>, Error, Record<"password" | "phoneNumber", string>, unknown>
    logout: () => void;
    fetchStatus: "pending" | "error" | "success";
    isLoggedIn: () => boolean;
}

const UserContext = createContext<UserContextValue | null>(null);

export const useUser = () => {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("A context provider is missing, can't use context");
    return ctx;
}

const UserProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {

    const client = useQueryClient();
    const { createSocketConnection } = useCreateSocketConnection();

    const { data, refetch: getUserData, status } = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            try {
                const { data: { user } } = await axios.get<Record<"user", UserData>>("/api/auth/login-with-cookie", {
                    withCredentials: true
                });
                return user;
            } catch (e) {
                if (e instanceof AxiosError && e.response?.status === 401) {
                    cookieManager.remove("token");
                    if (location.pathname !== '/login') {
                        location.href = '/login'
                    }
                    return null;
                } else throw e;
            }
        },
        retry: true
    });

    const { mutate: login } = useMutation({
        mutationFn: (newUser: Record<"password" | "phoneNumber", string>) =>
            axios.post<{ id: string }>('/api/auth/login', newUser, {
                withCredentials: true,
            }),
        onSuccess: ({ data }) => {
            getUserData();
            createSocketConnection(data.id);
        }
    });

    function logout() {
        if (location.pathname !== '/login') {
            location.href = '/login'
        }
        cookieManager.remove("token");
        client.setQueryData(["user"], null);
    }

    function isLoggedIn() {
        return !!data
    }

    return <UserContext.Provider value={{ user: data ?? null, login, logout, fetchStatus: status, isLoggedIn }}>{children}</UserContext.Provider>
}
export default UserProvider;