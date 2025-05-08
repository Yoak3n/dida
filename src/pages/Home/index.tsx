import React, { useEffect,useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import AppLayout from "@/components/Layout/AppLayout";
import Msg from "@/components/Context/Msg";
const Home: React.FC = () => {
    const navigate = useNavigate();
    const MsgContext = useContext(Msg);
    useEffect(() => {
        // 手动重定向
        const path = window.location.pathname;
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