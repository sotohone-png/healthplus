import BasicMenu from "../components/menus/BasicMenu";

const BasicLayout = ({ children }) => {
  return (
    <div style={{ background: "#f8fafb", minHeight: "100vh" }}>
      <BasicMenu />
      <main>
        {children}
      </main>
    </div>
  );
};

export default BasicLayout;