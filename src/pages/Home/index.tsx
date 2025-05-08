import React, { useEffect } from "react";
import AppLayout from "@/components/Layout/AppLayout";
import { Outlet, useNavigate } from "react-router-dom";

const Home: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const path = window.location.pathname;
        console.log(path);
        if (path === "/") {
        navigate("/dashboard");
        }
    }, []);
    return (
        <>
            <AppLayout>
                <Outlet/>
            </AppLayout>
        </>
    )
}
export default Home