import { useEffect, useState } from "react";
import {
  getList,
  getSearchList,
  getListByCategory,
} from "../../api/productsApi";
import useCustomMove from "../../hooks/useCustomMove";
import FetchingModal from "../common/FetchingModal";
import { API_SERVER_HOST } from "../../api/healthGoalApi";
import PageComponent from "../common/PageComponent";
import useCustomLogin from "../../hooks/useCustomLogin";

const host = API_SERVER_HOST;

const initState = {
  dtoList: [],
  pageNumList: [],
  pageRequestDTO: null,
  prev: false,
  next: false,
  totalCount: 0,
  prevPage: 0,
  nextPage: 0,
  totalPage: 0,
  current: 0,
};

const categories = [
  "전체",
  "비타민",
  "홍삼/인삼",
  "오메가3",
  "프로바이오틱스",
  "콜라겐",
];

const ListComponent = () => {
  const { exceptionHandle } = useCustomLogin();
  const { page, size, refresh, moveToList, moveToRead } = useCustomMove();
  const [serverData, setServerData] = useState(initState);
  const [fetching, setFetching] = useState(false);
  const [activeCategory, setActiveCategory] = useState("전체");
  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    setFetching(true);
    if (keyword) {
      getSearchList(keyword, { page, size })
        .then((data) => {
          setServerData(data || initState);
          setFetching(false);
        })
        .catch((err) => {
          setServerData(initState);
          setFetching(false);
        });
    } else if (activeCategory !== "전체") {
      getListByCategory(activeCategory, { page, size })
        .then((data) => {
          setServerData(data || initState);
          setFetching(false);
        })
        .catch((err) => {
          setServerData(initState);
          setFetching(false);
        });
    } else {
      getList({ page, size })
        .then((data) => {
          setServerData(data || initState);
          setFetching(false);
        })
        .catch((err) => {
          setServerData(initState);
          setFetching(false);
        });
    }
  }, [page, size, refresh, keyword, activeCategory]);

  const handleSearch = () => {
    setKeyword(searchInput);
    setActiveCategory("전체");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleReset = () => {
    setSearchInput("");
    setKeyword("");
    setActiveCategory("전체");
  };

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    setKeyword("");
    setSearchInput("");
  };

  const dtoList = serverData.dtoList || [];

  return (
    <div>
      {fetching ? <FetchingModal /> : <></>}

      {/* 페이지 헤더 */}
      <div className="px-16 py-8" style={{ background: "#1a1a2e" }}>
        <h1 className="text-2xl font-bold text-white mb-1">건강기능식품</h1>
        <p className="text-gray-400 text-sm mb-6">
          내 건강에 맞는 제품을 찾아보세요
        </p>

        {/* 검색창 */}
        <div className="flex gap-3 max-w-lg">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="상품명, 설명으로 검색..."
            className="flex-1 px-5 py-3 rounded-xl text-sm outline-none"
            style={{
              background: "rgba(255,255,255,0.1)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          />
          <button
            onClick={handleSearch}
            className="px-6 py-3 rounded-xl text-sm font-medium"
            style={{ background: "#7ec8a0", color: "#0f3d2a" }}
          >
            검색
          </button>
          {(keyword || activeCategory !== "전체") && (
            <button
              onClick={handleReset}
              className="px-4 py-3 rounded-xl text-sm text-white border border-white/20"
            >
              초기화
            </button>
          )}
        </div>

        {keyword && (
          <p className="text-gray-400 text-sm mt-3">
            "{keyword}" 검색 결과 {dtoList.length}개
          </p>
        )}
      </div>

      {/* 카테고리 필터 */}
      <div className="px-16 py-4 bg-white border-b border-gray-100 flex items-center gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className="px-4 py-2 rounded-full text-sm border transition-all"
            style={
              activeCategory === cat
                ? {
                    background: "#1a1a2e",
                    color: "#7ec8a0",
                    borderColor: "#1a1a2e",
                  }
                : { background: "#fff", color: "#555", borderColor: "#e5e7eb" }
            }
          >
            {cat}
          </button>
        ))}
        <div className="ml-auto text-sm text-gray-400">
          총 {dtoList.length}개 상품
        </div>
      </div>

      {/* 상품 그리드 */}
      <div className="px-16 py-8">
        <div className="grid grid-cols-4 gap-6">
          {dtoList.map((product) => (
            <div
              key={product.pno}
              onClick={() => moveToRead(product.pno)}
              className="rounded-2xl overflow-hidden border border-gray-100 bg-white hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="h-48 bg-gray-50 flex items-center justify-center overflow-hidden">
                {product.uploadFileNames?.length > 0 ? (
                  <img
                    alt={product.pname}
                    className="w-full h-full object-cover"
                    src={`${host}/api/products/view/s_${product.uploadFileNames[0]}`}
                  />
                ) : (
                  <span className="text-5xl">💊</span>
                )}
              </div>
              <div className="p-4">
                <p className="font-medium text-gray-800 mb-1">
                  {product.pname}
                </p>
                <p className="text-gray-400 text-xs mb-2">{product.pdesc}</p>
                {product.category && (
                  <span
                    className="text-xs px-2 py-1 rounded-full mb-2 inline-block"
                    style={{ background: "#e1f5ee", color: "#0f6e56" }}
                  >
                    {product.category}
                  </span>
                )}
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-gray-800">
                    {product.price?.toLocaleString()}원
                  </span>
                  <button
                    className="text-xs px-3 py-1 rounded-lg text-white"
                    style={{ background: "#1a1a2e" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    담기
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {dtoList.length === 0 && !fetching && (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">🔍</div>
            <p>
              {keyword
                ? `"${keyword}" 검색 결과가 없습니다`
                : activeCategory !== "전체"
                  ? `"${activeCategory}" 카테고리 상품이 없습니다`
                  : "등록된 상품이 없습니다"}
            </p>
            {(keyword || activeCategory !== "전체") && (
              <button
                onClick={handleReset}
                className="mt-4 px-6 py-2 rounded-xl text-sm text-white"
                style={{ background: "#1a1a2e" }}
              >
                전체 상품 보기
              </button>
            )}
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      <div className="px-16 pb-10">
        <PageComponent serverData={serverData} movePage={moveToList} />
      </div>
    </div>
  );
};

export default ListComponent;
