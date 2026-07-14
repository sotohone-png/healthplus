import AddComponent from "../../components/healthgoal/AddComponent";
import BasicLayout from "../../layouts/BasicLayout";

const AddPage = () => {
  return (
    <BasicLayout>
      <div className="min-h-screen" style={{ background: "#f8fafb" }}>
        <div className="px-16 py-8" style={{ background: "#1a1a2e" }}>
          <h1 className="text-2xl font-bold text-white mb-1">건강 목표 추가</h1>
          <p className="text-gray-400 text-sm">나만의 건강 목표를 설정해보세요</p>
        </div>
        <AddComponent />
      </div>
    </BasicLayout>
  );
};

export default AddPage;