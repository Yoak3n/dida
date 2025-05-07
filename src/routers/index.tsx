import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/Home";
import Today from "@/pages/Home/Today";
import Settings from "@/pages/Settings";
import ActionModify from "@/pages/ActionModify";
const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <Home />,
            children: [
                {
                    index: true,
                    element: <Today />
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