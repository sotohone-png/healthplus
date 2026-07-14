import { useParams } from "react-router-dom";
import ModifyComponent from "../../components/healthgoal/ModifyComponent";

const ModifyPage = () => {
  const { tno } = useParams();
  return (
    <div>
      <ModifyComponent tno={tno} />
    </div>
  );
};

export default ModifyPage;