import { useState } from "react";
import { postConsult } from "../api/aiApi";
import BasicLayout from "../layouts/BasicLayout";
import useCustomLogin from "../hooks/useCustomLogin";

const AIPage = () => {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      content:
        "안녕하세요! 건강기능식품 전문 AI 상담사입니다. 건강 고민이 있으시면 말씀해주세요 😊",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginState } = useCustomLogin();

  const handleSubmit = async () => {
    if (!input.trim()) return;
    if (!loginState.email) {
      alert("로그인이 필요합니다");
      return;
    }

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const data = await postConsult(userMessage);
      setMessages((prev) => [...prev, { role: "ai", content: data.message }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <BasicLayout>
      {/* 헤더 */}
      <div className="px-16 py-8" style={{ background: "#1a1a2e" }}>
        <h1 className="text-2xl font-bold text-white mb-1">AI 건강 상담</h1>
        <p className="text-gray-400 text-sm">건강 고민을 AI에게 물어보세요</p>
      </div>

      {/* 채팅 영역 */}
      <div className="flex flex-col" style={{ height: "calc(100vh - 280px)" }}>
        <div className="flex-1 overflow-y-auto px-16 py-6 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "ai" && (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3 flex-shrink-0"
                  style={{ background: "#7ec8a0", color: "#0f3d2a" }}
                >
                  🤖
                </div>
              )}
              <div
                className={`max-w-lg px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "text-white"
                    : "bg-white border border-gray-100 text-gray-700"
                }`}
                style={msg.role === "user" ? { background: "#1a1a2e" } : {}}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* 로딩 */}
          {loading && (
            <div className="flex justify-start">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3"
                style={{ background: "#7ec8a0", color: "#0f3d2a" }}
              >
                🤖
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 text-sm text-gray-400">
                답변을 생성중입니다...
              </div>
            </div>
          )}
        </div>

        {/* 입력 영역 */}
        <div className="px-16 py-4 border-t border-gray-100 bg-white">
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="건강 고민을 입력해주세요... (Enter로 전송)"
              rows={2}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none resize-none"
            />
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-3 rounded-xl text-white text-sm font-medium self-end"
              style={{ background: loading ? "#ccc" : "#1a1a2e" }}
            >
              전송
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            💡 예시: "눈이 피로해요", "면역력을 높이고 싶어요", "관절이 아파요"
          </p>
        </div>
      </div>
    </BasicLayout>
  );
};

export default AIPage;
