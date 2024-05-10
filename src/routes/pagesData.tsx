import { routerType } from "./router.types";
import {Home, ActivityCode, Participant, Animator, Gamemaster, Login} from "@/pages"

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
  {
    path:"login",
    element: <Login/>,
    title: "login",
  },
  {
    path: "participant",
    element: <Participant />,
    title: "participant",
    roles : ['ROLE_PARTICIPANT'],
    protected: true
  },
  {
    path: "animator",
    element: <Animator />,
    title: "animator",
    roles: ['ROLE_ANIMATOR'],
    protected: true
  },
  {
    path: "gamemaster",
    element: <Gamemaster />,
    title: "gamemaster",
    protected: true,
    roles: ['ROLE_GAMEMASTER']
  },
];

export default pagesData;
