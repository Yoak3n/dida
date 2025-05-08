import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/Home";

import Settings from "@/pages/Settings";
import ActionModify from "@/pages/ActionModify";
import Dashboard from "@/pages/Home/Dashboard";

import Today from "@/pages/Home/Dashboard/Today";
import Monthly from "@/pages/Home/Dashboard/Monthly";
import Weekly from "@/pages/Home/Dashboard/Weekly";
const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <Home />,
            children: [
                {
                    path: "/dashboard",
                    element: <Dashboard />,
                    children: [
                        {
                            index: true,
                            element: <Today />
                        },{
                            path: "/dashboard/monthly",
                            element: <Monthly />,
                        },{
                            path: "/dashboard/weekly",
                            element: <Weekly />,
                        }
                    ]
                },{
                    path: "/action-modify",
                    element: <ActionModify />,
                },{
                    path: "/settings",
                    element: <Settings/>,
                }
            ],
        },{
            path: "/a",
            element: <Today />
        },{
            path: "*",
            element: <div>404 Not Found</div>,
        }

    ]
)
export default router;