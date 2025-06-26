// Topbar의 이동량, 충전소 수와 관련된 변경사항을 표시하는 컴포넌트
// Props 설명
// label : 현재 변경중인 슬라이더가 어떤 종류의 슬라이더인지 값을 전달(이동량, 충전소 수)
// min : 슬라이더의 최소 값
// max : 슬라이더의 최대 값
// value : 현재 선택된 슬라이더 값
// onChange : 슬라이더 변경 시, 호출될 함수
export default function RangeSlider({ label, min, max, value, onChange }) {
  return (
    // 어떤 label을 선택하냐에 따라 {label}에 값이 들어가서(이동량/충전소 수) 그 label과 관련된 변경사항이 적용됨.
    <div className="flex items-center gap-2">
      <label className="w-15">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mx-2"
      />
      <span className="w-10 text-right">{value}</span>
    </div>
  );
}
