// App.jsx와 RankingSection.jsx에서 Props로 값을 받아 UI의 지도에 표시하는 컴포넌트
// 지도는 Mapbox에서 token을 발급받아 Mapbox 지도 서비스를 사용
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Plot from "react-plotly.js";

window.mapboxgl = mapboxgl;
window.mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

// features는 필터링을 통해 특정 조건에 필터링 된 행정동 객체들
// selectedCenter는 초기 설정과 RankingSection을 통해 선택된 행정동의 위도/경도 값
export default function MapDisplay({ features, selectedCenter }) {
  console.log("지도 features", features);
  if (!features.length) return <p className="text-center">로딩 중...</p>;
  // 2) trace 준비
  // const features = geo.features;
  // console.log("feature 수 =", features.length);
  // console.log("첫 번째 좌표 샘플 =", features[0].geometry.coordinates[0][0]);
  //console.log("log count check");
  //console.log("token ▶", import.meta.env.VITE_MAPBOX_TOKEN);
  const regionColor = {
    서울특별시: 0,
    경기도: 1,
    인천광역시: 2,
  };
  // const colorscale = [
  //   [0, "#2E86AB"], // 서울
  //   [0.33, "#2E86AB"],
  //   [0.34, "#F6C85F"], // 경기
  //   [0.66, "#F6C85F"],
  //   [0.67, "#C70039"], // 인천
  //   [1, "#C70039"],
  // ];

  const data = [
    {
      type: "choroplethmapbox",
      geojson: { type: "FeatureCollection", features },
      locations: features.map((f) => f.properties.adm_code),
      featureidkey: "properties.adm_code",
      z: features.map((f) => regionColor[f.properties.region_group] ?? 99), // region값 없으면 99로 fallback
      colorscale: [
        [0, "rgba(46,134,171,0.2)"], // #2E86AB → 알파 0.3
        [0.34, "rgba(246,200,95,0.2)"], // #F6C85F → 알파 0.3
        [0.67, "rgba(199,0,57,0.2)"], // #C70039 → 알파 0.3
        [1, "rgba(199,0,57,0.2)"],
      ],
      text: features.map(
        (f) => `
          충전소: ${f.properties.charger_station_count}<br>
          주차장: ${f.properties.parking_space_total}<br>
          법정동명: ${f.properties.adm_name}
        `
      ),
      hoverinfo: "text",
      showscale: false,
      marker: { line: { width: 1, color: "#333" } }, // 두껍고 검정
      //opacity: 0.2,
    },
  ];

  // RankingSection에서 변경된 값을 App.jsx로 보내면
  // App.jsx에서 변경된 setSelectedCenter를 selectedCenter로 업데이트
  // App.jsx에서 Mapdisplay.jsx로 업데이트된 selectedCenter 값을 보냄
  const defaultCenter = { lon: 127.5, lat: 36.5 }; // 대한민국 중심
  const hasSelected = !!selectedCenter;
  const mapboxCenter = hasSelected
    ? { lon: selectedCenter[0], lat: selectedCenter[1] }
    : defaultCenter;
  const mapboxZoom = hasSelected ? 11 : 7;

  return (
    <div className="rounded-xl overflow-hidden w-[400px] h-[600px]">
      <Plot
        data={data}
        layout={{
          mapbox: {
            style: "carto-positron",
            zoom: mapboxZoom,
            center: mapboxCenter,
            fitbounds: hasSelected ? undefined : "locations", // 📌 폴리곤 범위로 자동 줌
            accesstoken: import.meta.env.VITE_MAPBOX_TOKEN,
          },
          margin: { t: 0, b: 0, l: 0, r: 0 },
        }}
        //useResizeHandler
        style={{ width: "100%", height: "600px" }}
        config={{ responsive: true }}
      />
    </div>
  );
}
