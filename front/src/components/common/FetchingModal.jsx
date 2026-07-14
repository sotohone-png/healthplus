const FetchingModal = () => {
  return (
    <div className="fixed top-0 left-0 z-[1055] flex h-full w-full items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl px-10 py-8 flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 border-4 rounded-full animate-spin"
          style={{ borderColor: "#e5e7eb", borderTopColor: "#1a1a2e" }}
        ></div>
        <p className="text-sm text-gray-500">처리중입니다...</p>
      </div>
    </div>
  );
};

export default FetchingModal;
