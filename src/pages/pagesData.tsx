import { routerType } from "../types/router.types";
import Home from "./Home";
import Participant from "./Participant";
import Animator from "./Animator";
import Gamemaster from "./Gamemaster";

const pagesData: routerType[] = [
    {
        path: "",
        element: <Home />,
        title: "home"
    },
    {
        path: "participant",
        element: <Participant />,
        title: "participant"
    },
    {
        path: "animateur",
        element: <Animator />,
        title: "animator"
    },
    {
        path: "gamemaster",
        element: <Gamemaster />,
        title: "gamemaster"
    }
]

export default pagesData;