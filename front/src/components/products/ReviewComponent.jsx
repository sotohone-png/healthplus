import { useEffect, useState } from "react";
import { getReviewList, postReview, deleteReview } from "../../api/reviewApi";
import useCustomLogin from "../../hooks/useCustomLogin";

const ReviewComponent = ({ pno }) => {
  const [reviews, setReviews] = useState([]);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const { loginState } = useCustomLogin();

  const loadReviews = () => {
  getReviewList(pno).then((data) => setReviews(Array.isArray(data) ? data : []));
};

  useEffect(() => {
    loadReviews();
  }, [pno]);

  const handleSubmit = () => {
    if (!content.trim()) {
      alert("리뷰 내용을 입력해주세요");
      return;
    }
    postReview({
      pno: parseInt(pno),
      email: loginState.email,
      nickname: loginState.nickname,
      content,
      rating,
    }).then(() => {
      setContent("");
      setRating(5);
      loadReviews();
    });
  };

  const handleDelete = (rno) => {
  if (window.confirm("리뷰를 삭제하시겠습니까?")) {
    deleteReview(rno, loginState.email).then(() => loadReviews());
  }
};

  const stars = (count) => "★".repeat(count) + "☆".repeat(5 - count);

  return (
    <div className="px-16 py-8 border-t border-gray-100">
      <h2 className="text-lg font-bold mb-6 text-gray-800">
        상품 리뷰 <span className="text-gray-400 font-normal text-sm">({reviews.length}개)</span>
      </h2>

      {/* 리뷰 작성 */}
      {loginState.email && (
        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
          <h3 className="text-sm font-medium text-gray-700 mb-4">리뷰 작성</h3>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-600">별점</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="text-2xl"
                  style={{ color: star <= rating ? "#EF9F27" : "#ddd" }}>
                  ★
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="상품 사용 후기를 작성해주세요..."
            className="w-full border border-gray-200 rounded-xl p-4 text-sm resize-none outline-none"
            rows={3}
          />
          <div className="flex justify-end mt-3">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 rounded-xl text-white text-sm font-medium"
              style={{ background: "#1a1a2e" }}>
              리뷰 등록
            </button>
          </div>
        </div>
      )}

      {/* 리뷰 목록 */}
      {reviews.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <p>아직 리뷰가 없어요. 첫 번째 리뷰를 작성해보세요!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.rno}
              className="bg-white border border-gray-100 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                       style={{ background: "#1a1a2e" }}>
                    {review.nickname?.charAt(0) || review.email?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {review.nickname || review.email}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(review.regDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ color: "#EF9F27" }}>{stars(review.rating)}</span>
                  {loginState.email === review.email && (
                    <button
                      onClick={() => handleDelete(review.rno)}
                      className="text-xs text-red-400 hover:text-red-600 ml-2">
                      삭제
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{review.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewComponent;