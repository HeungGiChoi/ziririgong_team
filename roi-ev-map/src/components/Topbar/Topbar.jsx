// App.jsx에서 Props를 통해 받아온 값들을 다시 자식 컴포넌트에게 보내는 컴포넌트
// App.jsx의 return문에서 Props를 통해 값을 받음
// UI의 필터링 기능이 있는 Bar의 각 기능 컴포넌트들에게 데이터를 보냄
import RegionDropdown from "./RegionDropdown";
import YearDropdown from "./YearDropdown";
import RangeSlider from "./RangeSlider";

export default function Topbar({
  // App.jsx에서 Props를 통해 받아온 값들
  maxTraffic,
  maxStation,
  ui,
  setUI,
  regionOpts,
  yearOpts,
}) {
  // Props를 통해 App.jsx에게 받은 값들을 다시 자식 컴포넌트들에게 Props로 전달
  return (
    <div className="flex items-center gap-14 p-6 bg-blue-100">
      {/* RegionDropdown 컴포넌트에 전달되는 props */}
      <RegionDropdown
        value={ui.region}
        options={regionOpts}
        // "onChange" 는 사용자가 UI에서 새로운 값을 선택했을때, 애플리케이션 전역 UI 상태를 업데이트 하는 기능.
        onChange={(val) => setUI((u) => ({ ...u, region: val }))}
      />

      {/* YearDropdown 컴포넌트에 전달되는 props */}
      <YearDropdown
        value={ui.year}
        options={yearOpts}
        onChange={(val) => setUI((u) => ({ ...u, year: val }))}
      />

      {/* RangeSlider(Traffic) 컴포넌트에 전달되는 props */}
      <RangeSlider
        label="이동량"
        value={ui.minTraffic}
        min={0}
        max={maxTraffic}
        onChange={(val) => setUI((u) => ({ ...u, minTraffic: val }))}
      />

      {/* RangeSlider(Station) 컴포넌트에 전달되는 props */}
      <RangeSlider
        label="충전소수"
        value={ui.minStation}
        min={0}
        max={maxStation}
        onChange={(val) => setUI((u) => ({ ...u, minStation: val }))}
      />
    </div>
  );
}
