import { routerType } from "./router.types";
import Home from "../pages/Home";
import Participant from "../pages/Participant";
import Animator from "../pages/Animator";
import Gamemaster from "../pages/Gamemaster";

const pagesData: routerType[] = [
  {
    path: "",
    element: <Home />,
    title: "home",
  },
  {
    path: "participant",
    element: <Participant />,
    title: "participant",
  },
  {
    path: "animateur",
    element: <Animator />,
    title: "animator",
  },
  {
    path: "gamemaster",
    element: <Gamemaster />,
    title: "gamemaster",
  },
];

export default pagesData;
