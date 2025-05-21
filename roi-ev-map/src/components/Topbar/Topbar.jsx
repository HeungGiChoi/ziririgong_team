import RegionDropdown from "./RegionDropdown";
import YearDropdown from "./YearDropdown";
import RangeSlider from "./RangeSlider";

export default function Topbar({
  maxTraffic,
  maxStation,
  ui,
  setUI,
  regionOpts,
  yearOpts,
}) {
  return (
    <div className="flex items-center gap-14 p-6 bg-blue-100">
      <RegionDropdown
        value={ui.region}
        options={regionOpts}
        onChange={(val) => setUI((u) => ({ ...u, region: val }))}
      />

      <YearDropdown
        value={ui.year}
        options={yearOpts}
        onChange={(val) => setUI((u) => ({ ...u, year: val }))}
      />

      <RangeSlider
        label="이동량"
        value={ui.minTraffic}
        min={0}
        max={maxTraffic}
        onChange={(val) => setUI((u) => ({ ...u, minTraffic: val }))}
      />

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
