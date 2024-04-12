import NavbarUp from "../components/NavbarUp";
import ActivityForm from "../components/ActivityForm/ActivityForm";

interface IPageContainerProps {
  role: string;
  handleChangeSelection?: () => void;
  animatorStandSetted: boolean;
}

const Gamemaster: React.FC<IPageContainerProps> = ({
  handleChangeSelection,
}) => {


  // Get ActivityData
  // const activityDataProvider = useContext(ActivityContext);

  // // Retrieve current activity data
  // useEffect(() => {
  //   if (activityDataProvider) {
  //     setActivityData(activityDataProvider);
  //   } else {
  //     // still loading or null ??
  //   }
  // }, [activityDataProvider]);

  return (
    <>
      <NavbarUp
        role={"Maitre du jeu"}
        handleChangeSelection={() => handleChangeSelection?.()}
        animatorStandSetted={false}
      />
      <ActivityForm/>
    </>
  );
};

export default Gamemaster;
