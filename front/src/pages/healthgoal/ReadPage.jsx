import { useParams } from "react-router-dom";
import ReadComponent from "../../components/healthgoal/ReadComponent";

const ReadPage = () => {
  const { tno } = useParams();
  return (
    <div>
      <ReadComponent tno={tno} />
    </div>
  );
};

export default ReadPage;