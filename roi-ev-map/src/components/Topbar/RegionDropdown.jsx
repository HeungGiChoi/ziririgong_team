// Topbar의 지역과 관련된 변경사항을 표시하는 컴포넌트
// Props 설명
// value : 현재 선택된 지역 값
// options : 변경 가능한 지역 목록
// onChange : 지역 변경 시, 호출될 함수
export default function RegionDropdown({ value, options, onChange }) {
  return (
    <label>
      지역:&nbsp;
      <select
        value={value}
        // "e.target.value"는 사용자가 새롭게 선택한 지역 값.
        // "onChange(e.target.value)"를 통해 부모 컴포넌트에게 변경사항을 알림.
        onChange={(e) => onChange(e.target.value)}
        className="ml-1"
      >
        {options.map((opt) => (
          // 선택된 지역 옵션을 UI에 표시
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}
