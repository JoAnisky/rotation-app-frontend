import NavbarUp from "../components/NavbarUp";
import ActivityForm from "../components/ActivityForm/ActivityForm";
import NavbarDown from "../components/NavbarDown";
import Scenario from "./Scenario";
import GeneralView from "./GeneralView";
import useActiveComponent from "../hooks/useActiveComponent";

interface IPageContainerProps {
  role: string;
  handleChangeSelection?: () => void;
  animatorStandSetted: boolean;
}

const Gamemaster: React.FC<IPageContainerProps> = ({
  handleChangeSelection,
}) => {
  const { setActiveComponent, renderActiveComponent } = useActiveComponent({
    defaultComponent: "ActivityForm",
    components: {
      ActivityForm: <ActivityForm />,
      Scenario: <Scenario />,
      GeneralView: <GeneralView />,
    },
  });

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
      {renderActiveComponent()}
      <NavbarDown setActiveComponent={setActiveComponent} isAdmin={true} />
    </>
  );
};

export default Gamemaster;
