import React from "react";
import AppLayout from "@/components/Layout/AppLayout";
import { Outlet } from "react-router-dom";

const Home: React.FC = () => {
    return (
        <>
            <AppLayout>
                <Outlet/>
            </AppLayout>
        </>
    )
}
export default Home