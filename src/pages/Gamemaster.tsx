import { useState } from "react";
import useActiveComponent from "../hooks/useActiveComponent";
import NavbarUp from "../components/NavbarUp";
import ActivityForm from "../components/Activity/Form/ActivityForm";
import NavbarDown from "../components/NavbarDown";
import Scenario from "./Scenario";
import GeneralView from "./GeneralView";
import ActivityChoice from "./ActivityChoice";

interface IPageContainerProps {
  role: string;
  handleChangeSelection?: () => void;
  animatorStandSetted: boolean;
}

const Gamemaster: React.FC<IPageContainerProps> = ({
  handleChangeSelection,
}) => {
  const [chosenActivity, setChosenActivity] = useState<number | null>(null);

  const { setActiveComponent, renderActiveComponent } = useActiveComponent({
    defaultComponent: "ActivityForm",
    components: {
      ActivityForm: <ActivityForm chosenActivity={chosenActivity} />,
      Scenario: <Scenario />,
      GeneralView: <GeneralView />,
    },
  });

  return (
    <>
      <NavbarUp
        role={"Maitre du jeu"}
        handleChangeSelection={() => handleChangeSelection?.()}
        animatorStandSetted={false}
      />

      {/* If activity is not yet selected, choice ou create activity */}
      {!chosenActivity ? (
        <ActivityChoice setChosenActivity={setChosenActivity} />
      ) : (
        <>
          {renderActiveComponent()}
          <NavbarDown setActiveComponent={setActiveComponent} isAdmin={true} />
        </>
      )}
    </>
  );
};

export default Gamemaster;
