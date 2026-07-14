import { Outlet } from "react-router-dom";

const IndexPage = () => {
  return (
    <div className="w-full">
      <Outlet />
    </div>
  );
};

export default IndexPage;