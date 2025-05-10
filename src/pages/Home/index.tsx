import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AppLayout from "@/components/Layout/AppLayout";

const Home: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => {
        // 手动重定向
        const path = window.location.pathname;
        if (path === "/") {
            navigate("/view/", { replace: true });
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