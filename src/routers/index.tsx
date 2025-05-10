import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/Home";

import Settings from "@/pages/Settings";
import TaskModify from "@/pages/TaskModify";

import View from "@/pages/Home/View";
import Dashboard from "@/pages/Home/Dashboard"
import Today from "@/pages/Home/View/Today";
import Monthly from "@/pages/Home/View/Monthly";
import Weekly from "@/pages/Home/View/Weekly";

const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <Home />,
            children: [
                {
                    path: "/view",
                    element: <View />,
                    children: [
                        {
                            index: true,
                            element: <Today />
                        },{
                            path: "monthly",
                            element: <Monthly />,
                        },{
                            path: "weekly",
                            element: <Weekly />,
                        }
                    ]
                },{
                    path: "/settings",
                    element: <Settings/>,
                },{
                    path: "/dashboard",
                    element: <Dashboard/>,
                }
            ],
        },{
            path: "/task",
            element: <TaskModify />
        },{
            path: "*",
            element: <div>404 Not Found</div>,
        }

    ]
)
export default router;