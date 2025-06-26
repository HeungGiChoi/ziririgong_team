// App.jsx에서 Props로 받은 값들을 자식 컴포넌트에 전달
import SortOption from "./SortOption";
import RankingList from "./RankingList";

export default function RankingSection({
  // App.jsx에서 Props로 받은 값들
  features,
  sortBy,
  setSortBy,
  sortOpts,
  setSelectedCenter,
}) {
  return (
    <div className="w-76 p-4 bg-white rounded-2xl shadow">
      {/* 정렬 기준 드롭다운 */}
      <div className="mb-6">
        {/* SortOption 컴포넌트에 전달되는 props */}
        <SortOption sortBy={sortBy} setSortBy={setSortBy} sortOpts={sortOpts} />
      </div>
      {/* 순위 리스트 */}
      <ol>
        {/* RankingList 컴포넌트에 전달되는 props */}
        {features.slice(0, 10).map((f, i) => {
          // App.jsx에서 필터링되고 정렬된 feature들을 10개 추출
          // feature 객체의 properties에 위도와 경도 값을 추출해서 저장
          const lat = f.properties["lat"];
          const lon = f.properties["lon"];

          return (
            <li
              key={f.properties.adm_code}
              // feature에 클릭 이벤트가 발생하면 setSelectedCenter 상태변수 함수로 객체의 위도, 경도 값을 포함해서 보냄
              onClick={() => setSelectedCenter([lon, lat])}
              style={{ cursor: "pointer" }}
              className="hover:bg-gray-100 transition"
            >
              {i + 1}. {f.properties.adm_name}{" "}
            </li>
          );
        })}
      </ol>
      {/* <RankingList features={features.slice(0, 10)} /> 상위 10개 표시 */}
    </div>
  );
}
