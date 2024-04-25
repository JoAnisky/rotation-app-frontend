import { Container } from "@mui/material";
import Stand from "./Stand";
import useActiveComponent from "@/hooks/useActiveComponent";
import GeneralView from "./GeneralView";
import NavbarDown from "@/components/NavbarDown";
import NavbarUp from "@/components/NavbarUp";

const Participant: React.FC = () => {
  const { setActiveComponent, renderActiveComponent } = useActiveComponent({
    defaultComponent: "Stand",
    components: {
      Stand: <Stand />,
      GeneralVieuw: <GeneralView />
    }
  });
  return (
    <Container sx={{ display: "flex", flexDirection: "column", height: "100vh", padding: "0" }}>
      <NavbarUp
        role={"Participant"}
        animatorStandSetted={true}
      />
      {renderActiveComponent()}
      <NavbarDown setActiveComponent={setActiveComponent} isAdmin={false} />
    </Container>
  );
};

export default Participant;
