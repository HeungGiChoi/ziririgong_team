import SortOption from "./SortOption";
import RankingList from "./RankingList";

export default function RankingSection({
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
        <SortOption sortBy={sortBy} setSortBy={setSortBy} sortOpts={sortOpts} />
      </div>
      {/* 순위 리스트 */}
      <ol>
        {features.slice(0, 10).map((f, i) => {
          const lat = f.properties["lat"];
          const lon = f.properties["lon"];

          return (
            <li
              key={f.properties.adm_code}
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
