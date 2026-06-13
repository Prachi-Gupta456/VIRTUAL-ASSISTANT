"use client"
import { useEffect } from "react";
import { getCurrentUser } from "../services/api";
import { setLoadingFalse, setUserData } from "../redux/slices/userSlice";
import { useDispatch } from "react-redux";

export default function useGetCurrentUser(skip) {

    const dispatch = useDispatch()

    useEffect(() => {

        if (skip) return;

        const handler = async () => {
            const result = await getCurrentUser()

            if (result.success) {
                dispatch(setUserData(result.user))
            }
            else {
                dispatch(setLoadingFalse())
            }
        }
        handler();
    }, [skip])
}