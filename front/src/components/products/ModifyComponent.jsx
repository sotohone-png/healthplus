import { useEffect, useRef, useState } from "react";
import { deleteOne, getOne, putOne } from "../../api/productsApi";
import FetchingModal from "../common/FetchingModal";
import { API_SERVER_HOST } from "../../api/healthGoalApi";
import useCustomMove from "../../hooks/useCustomMove";
import ResultModal from "../common/ResultModal";

const initState = {
  pno: 0,
  pname: "",
  pdesc: "",
  price: 0,
  delFlag: false,
  uploadFileNames: [],
};

const host = API_SERVER_HOST;

const ModifyComponent = ({ pno }) => {
  const [product, setProduct] = useState(initState);
  const [result, setResult] = useState(null);
  const { moveToRead, moveToList } = useCustomMove();
  const [fetching, setFetching] = useState(false);
  const uploadRef = useRef();

  useEffect(() => {
    setFetching(true);
    getOne(pno).then((data) => {
      setProduct(data);
      setFetching(false);
    });
  }, [pno]);

  const handleChangeProduct = (e) => {
    product[e.target.name] = e.target.value;
    setProduct({ ...product });
  };

  const deleteOldImages = (imageName) => {
    const resultFileNames = product.uploadFileNames.filter(
      (fileName) => fileName !== imageName,
    );
    product.uploadFileNames = resultFileNames;
    setProduct({ ...product });
  };

  const handleClickModify = () => {
    if (!product.pname.trim()) {
      alert("상품명을 입력해주세요");
      return;
    }
    if (!product.pdesc.trim()) {
      alert("상품 설명을 입력해주세요");
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
    formData.append("delFlag", product.delFlag);

    for (let i = 0; i < product.uploadFileNames.length; i++) {
      formData.append("uploadFileNames", product.uploadFileNames[i]);
    }

    setFetching(true);
    putOne(pno, formData)
      .then((data) => {
        setResult("수정 완료");
        setFetching(false);
      })
      .catch((err) => {
        console.log("수정 오류: ", err);
        setFetching(false);
        alert(
          "수정 중 오류가 발생했습니다: " + JSON.stringify(err.response?.data),
        );
      });
  };

  const handleClickDelete = () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    setFetching(true);
    deleteOne(pno)
      .then((data) => {
        setResult("삭제 완료");
        setFetching(false);
      })
      .catch((err) => {
        console.log("삭제 오류: ", err);
        setFetching(false);
        alert(
          "삭제 중 오류가 발생했습니다: " + JSON.stringify(err.response?.data),
        );
      });
  };

  const closeModal = () => {
    if (result === "수정 완료") {
      moveToRead(pno);
    } else if (result === "삭제 완료") {
      moveToList({ page: 1 });
    }
    setResult(null);
  };

  return (
    <div className="flex justify-center py-8">
      <div className="w-full max-w-lg">
        {fetching ? <FetchingModal /> : <></>}
        {result ? (
          <ResultModal
            title={result}
            content={"상품 정보가 정상적으로 처리되었습니다."}
            callbackFn={closeModal}
          />
        ) : (
          <></>
        )}

        <div className="bg-white border border-gray-100 rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-6 text-gray-800">상품 수정</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-2">상품명</label>
              <input
                name="pname"
                type="text"
                value={product.pname}
                onChange={handleChangeProduct}
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
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-2">
                판매 상태
              </label>
              <select
                name="delFlag"
                value={product.delFlag}
                onChange={handleChangeProduct}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none"
              >
                <option value={false}>사용</option>
                <option value={true}>판매중지</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-2">
                이미지 추가
              </label>
              <input
                ref={uploadRef}
                type="file"
                multiple={true}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none"
              />
            </div>

            {product.uploadFileNames.length > 0 && (
              <div>
                <label className="block text-xs text-gray-500 mb-2">
                  기존 이미지
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {product.uploadFileNames.map((imgFile, i) => (
                    <div key={i} className="relative">
                      <img
                        alt="상품 이미지"
                        className="w-full h-24 object-cover rounded-xl"
                        src={`${host}/api/products/view/s_${imgFile}`}
                      />
                      <button
                        onClick={() => deleteOldImages(imgFile)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={handleClickModify}
              className="flex-1 py-3 rounded-xl text-white font-medium text-sm"
              style={{ background: "#1a1a2e" }}
            >
              수정
            </button>
            <button
              type="button"
              onClick={handleClickDelete}
              className="flex-1 py-3 rounded-xl text-white text-sm bg-red-500"
            >
              삭제
            </button>
            <button
              type="button"
              onClick={() => moveToList({ page: 1 })}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm"
            >
              목록
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifyComponent;
