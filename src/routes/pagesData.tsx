import { routerType } from "./router.types";
import Home from "@/pages/Home";
import Participant from "@/pages/Participant";
import Animator from "@/pages/Animator";
import Gamemaster from "@/pages/Gamemaster";
import ActivityCode from "@/pages/ActivityCode";

const pagesData: routerType[] = [
  {
    path: "",
    element: <Home />,
    title: "home",
  },
  {
    path: "activity_code/:role",
    element: <ActivityCode/>,
    title: "activity_code"
  },
  // {
  //   path:"login",
  //   element: <Login/>
  //   title: "login"
  // },
  {
    path: "participant",
    element: <Participant />,
    title: "participant",
    roles : ['ROLE_PARTICIPANT'],
  },
  {
    path: "animator",
    element: <Animator />,
    title: "animator",
    roles: ['ROLE_ANIMATOR']
  },
  {
    path: "gamemaster",
    element: <Gamemaster />,
    title: "gamemaster",
    roles: ['ROLE_GAMEMASTER']
  },
];

export default pagesData;
