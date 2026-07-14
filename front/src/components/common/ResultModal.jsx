const ResultModal = ({ title, content, callbackFn }) => {
  return (
    <div
      className="fixed top-0 left-0 z-[1055] flex h-full w-full items-center justify-center bg-black/30"
      onClick={() => {
        if (callbackFn) callbackFn();
      }}
    >
      <div
        className="bg-white rounded-2xl shadow-lg w-full max-w-sm mx-4 p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-4"
            style={{ background: "#e1f5ee" }}
          >
            ✅
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">{title}</h3>
          <p className="text-sm text-gray-500">{content}</p>
        </div>
        <button
          className="w-full py-3 rounded-xl text-white text-sm font-medium"
          style={{ background: "#1a1a2e" }}
          onClick={() => {
            if (callbackFn) callbackFn();
          }}
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default ResultModal;
