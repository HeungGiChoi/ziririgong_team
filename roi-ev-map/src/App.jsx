// 전체 앱을 관장하는 컴포넌트
// Props라는 React 컴포넌트 간에 데이터를 전달하는 객체를 활용해
// 각 자식 컴포넌트들에게 값을 전달
// Props는 부모 -> 자식 방향으로 단방향 전달방식이다.
import { useState, useEffect } from "react"; // useState, useEffect는 상태관리, 부수 기능을 수행해주는 특수한 함수인 'Hooks' 이다.
import Topbar from "./components/Topbar/Topbar";
import MapDisplay from "./components/MapDisplay/MapDisplay";
import RankingSection from "./components/Ranking_section/RankingSection";

/* ───── 지역·타입·연도 값은 GeoJSON 값과 ‘완전히 동일’하게 작성 ───── */
const REGION_OPTS = ["전체", "서울특별시", "경기도", "인천광역시"];
const YEAR_OPTS = ["전체", "2021", "2026", "2030"];
const SORT_OPTS = [
  { value: "parking_public_count", label: "공영주차장 많은 순" },
  {
    value: "charger_public_count",
    label: "공영주차장에 있는 충전기 수 적은 순",
  },
  { value: "parking_lot_count", label: "주차장 구획 수 많은 순" },
  {
    value: "charger_private_count",
    label: "민영주차장에 있는 충전기 수 적은 순",
  },
];

// export를 통해 명시적으로 함수를 외부로 내보내어 다른 Javascript 파일에 접근.
// "function ...(){}" 형태로 Javascript에서는 함수를 파일 내부에서 정의함.
export default function App() {
  const [geo, setGeo] = useState(null);

  /* 모든 UI가 공유하는 전역 필터·정렬 state */
  const [ui, setUI] = useState({
    region: "전체",
    year: "전체",
    minTraffic: 0, // ← 이동량 슬라이더 값
    minStation: 0, // ← 충전소 수 슬라이더 값
    sortBy: "pub_parking_cnt_desc",
  });

  // 정렬된 행정동을 클릭하면 지도에서 클릭한 행정동의 중심으로 이동하게 하는 변수.
  const [selectedCenter, setSelectedCenter] = useState(null);

  /* GeoJSON 1회만 로드 */
  useEffect(() => {
    const geojsonUrls = {
      2021: "https://heunggibucket.s3.ap-northeast-2.amazonaws.com/21%EB%85%84%EB%8F%84_final_DB.geojson", // 실제 URL로 교체 필요
      2026: "https://heunggibucket.s3.ap-northeast-2.amazonaws.com/26%EB%85%84%EB%8F%84_final_DB.geojson",
      2030: "https://heunggibucket.s3.ap-northeast-2.amazonaws.com/30%EB%85%84%EB%8F%84_final_DB.geojson",
      전체: "https://heunggibucket.s3.ap-northeast-2.amazonaws.com/21%EB%85%84%EB%8F%84_final_DB.geojson", // 기본값으로 2021년도 사용 (또는 원하는 연도 선택)
    };

    const url = geojsonUrls[ui.year];

    fetch(url)
      .then((res) => res.json())
      .then(setGeo)
      .catch((err) => console.error("GeoJSON load error:", err));
  }, [ui.year]);

  if (!geo) return <p>로딩 중...</p>;

  // console.log("Geo", geo);
  /* 필터링 */
  const filtered = geo
    ? geo.features.filter((f) => {
        const region = ui.region;
        const p = f.properties;
        return (
          (region === "전체" || p.region_group === region) &&
          p.move_count >= ui.minTraffic &&
          p.charger_station_count <= ui.minStation
        );
      })
    : [];
  // console.log("filtered", filtered);

  /* 정렬 */
  const sorted = [...filtered].sort((a, b) => {
    const p = ui.sortBy;
    if (p === "parking_public_count")
      return (
        b.properties.parking_public_count - a.properties.parking_public_count
      );
    if (p === "charger_public_count")
      return (
        a.properties.charger_public_count - b.properties.charger_public_count
      );
    if (p === "parking_lot_count")
      return b.properties.parking_lot_count - a.properties.parking_lot_count;
    if (p === "charger_private_count")
      return (
        a.properties.charger_private_count - b.properties.charger_private_count
      );
    // 혹시나 예외(기본값) 처리
    return 0;
  });

  // 슬라이더(이동량, 충전소 수) 최대값 계산
  const maxTraffic = Math.max(
    ...geo.features.map((f) => f.properties.move_count)
  );
  const maxStation = Math.max(
    ...geo.features.map((f) => f.properties.charger_station_count)
  );

  return (
    // jsx만의 특징, HTML 형식을 표현
    <div className="min-h-screen bg-gray-50 flex-col">
      <div className="ml-16 mt-10">
        {/* Topbar 컴포넌트에 전달되는 props */}
        <Topbar
          ui={ui}
          setUI={setUI}
          regionOpts={REGION_OPTS}
          yearOpts={YEAR_OPTS}
          maxTraffic={maxTraffic}
          maxStation={maxStation}
        />
      </div>
      <div className="flex gap-8">
        {/* 지도는 필터링만 반영 */}
        <div className="rounded-xl w-[900px] h-[400px] ml-32 mb-8">
          {/* MapDisplay 컴포넌트에 전달되는 props */}
          <MapDisplay features={filtered} selectedCenter={selectedCenter} />
        </div>
        {/* 순위는 필터 + 정렬 반영 */}
        <div className="mr-12 mt-4">
          {/* RankingSection 컴포넌트에 전달되는 props */}
          <RankingSection
            features={sorted}
            sortBy={ui.sortBy}
            setSortBy={(sortBy) => setUI((u) => ({ ...u, sortBy }))}
            sortOpts={SORT_OPTS}
            setSelectedCenter={setSelectedCenter}
          />
        </div>
      </div>
    </div>
  );
}
