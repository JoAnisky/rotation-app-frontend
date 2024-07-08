import { useState } from "react";
import useActiveComponent from "@/hooks/useActiveComponent";
import NavbarUp from "@/components/NavbarUp";
import ActivityForm from "@/components/Activity/Form/ActivityForm";
import NavbarDown from "@/components/NavbarDown";
import Scenario from "./Scenario";
import GeneralView from "./GeneralView";
import ActivityChoice from "./ActivityChoice";


const Gamemaster: React.FC = () => {
  const [chosenActivityId, setChosenActivityId] = useState<number | string>(0);

  const { setActiveComponent, renderActiveComponent } = useActiveComponent({
    defaultComponent: "ActivityForm",
    components: {
      ActivityForm: <ActivityForm chosenActivityId={chosenActivityId} />,
      Scenario: <Scenario chosenActivityId={chosenActivityId}/>,
      GeneralView: <GeneralView />,
    },
  });

  return (
    <>
      <NavbarUp
        role={"Maitre du jeu"}
        animatorStandSetted={false}
      />

      {/* If activity is not yet selected, choice ou create activity */}
      {!chosenActivityId ? (
        <ActivityChoice setChosenActivityId={setChosenActivityId} />
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
