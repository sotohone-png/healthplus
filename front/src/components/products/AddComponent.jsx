import { useRef, useState, useEffect } from "react";
import { postAdd } from "../../api/productsApi";
import FetchingModal from "../common/FetchingModal";
import ResultModal from "../common/ResultModal";
import useCustomMove from "../../hooks/useCustomMove";
import useCustomLogin from "../../hooks/useCustomLogin";
import { useNavigate } from "react-router-dom";

const initState = {
  pname: "",
  pdesc: "",
  price: 0,
  category: "",
  files: [],
};

const categoryOptions = [
  "비타민",
  "홍삼/인삼",
  "오메가3",
  "프로바이오틱스",
  "콜라겐",
  "기타",
];

const AddComponent = () => {
  const [product, setProduct] = useState({ ...initState });
  const uploadRef = useRef();
  const [fetching, setFetching] = useState(false);
  const [result, setResult] = useState(null);
  const { moveToList } = useCustomMove();
  const { loginState } = useCustomLogin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loginState.roleNames?.includes("MANAGER")) {
      alert("관리자만 접근할 수 있습니다");
      navigate("/products/list");
    }
  }, [loginState]);

  const handleChangeProduct = (e) => {
    product[e.target.name] = e.target.value;
    setProduct({ ...product });
  };

  const handleClickAdd = (e) => {
    if (!product.pname.trim()) {
      alert("상품명을 입력해주세요");
      return;
    }
    if (!product.pdesc.trim()) {
      alert("상품 설명을 입력해주세요");
      return;
    }
    if (!product.price || product.price <= 0) {
      alert("올바른 가격을 입력해주세요");
      return;
    }
    if (!product.category) {
      alert("카테고리를 선택해주세요");
      return;
    }

    const files = uploadRef.current.files;
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    formData.append("pname", product.pname);
    formData.append("pdesc", product.pdesc);
    formData.append("price", product.price);
    formData.append("category", product.category);

    setFetching(true);

    postAdd(formData).then((data) => {
      setFetching(false);
      setResult(data.result);
    });
  };

  const closeModal = () => {
    setResult(null);
    moveToList({ page: 1 });
  };

  if (!loginState.roleNames?.includes("MANAGER")) {
    return null;
  }

  return (
    <div className="flex justify-center py-8">
      <div className="w-full max-w-lg">
        {fetching ? <FetchingModal /> : <></>}
        {result ? (
          <ResultModal
            title={"상품 등록 완료"}
            content={`${result}번 상품이 등록되었습니다`}
            callbackFn={closeModal}
          />
        ) : (
          <></>
        )}

        <div className="bg-white border border-gray-100 rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-6 text-gray-800">상품 등록</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-2">상품명</label>
              <input
                name="pname"
                type="text"
                value={product.pname}
                onChange={handleChangeProduct}
                placeholder="예: 루테인 지아잔틴"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-2">
                상품 설명
              </label>
              <textarea
                name="pdesc"
                rows="4"
                value={product.pdesc}
                onChange={handleChangeProduct}
                placeholder="예: 눈 건강을 위한 루테인 복합 영양제"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-2">가격</label>
              <input
                name="price"
                type="number"
                value={product.price}
                onChange={handleChangeProduct}
                placeholder="예: 24000"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-2">
                카테고리
              </label>
              <select
                name="category"
                value={product.category}
                onChange={handleChangeProduct}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none"
              >
                <option value="">카테고리 선택</option>
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-2">
                상품 이미지
              </label>
              <input
                ref={uploadRef}
                type="file"
                multiple={true}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleClickAdd}
            className="w-full mt-6 py-3 rounded-xl text-white font-medium text-sm"
            style={{ background: "#1a1a2e" }}
          >
            상품 등록
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddComponent;
