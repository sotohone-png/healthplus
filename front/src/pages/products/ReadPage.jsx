import { useParams } from "react-router-dom";
import ReadComponent from "../../components/products/ReadComponent";

const ReadPage = () => {
  const { pno } = useParams();

  return (
    <div className="w-full bg-white">
      <ReadComponent pno={pno} />
    </div>
  );
};

export default ReadPage;
