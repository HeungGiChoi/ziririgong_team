// Topbar의 연도와 관련된 변경사항을 표시하는 컴포넌트
// Props 설명
// value : 현재 선택된 연도 값
// onChange : 연도 변경 시, 호출될 함수
// options : 변경 가능한 연도 목록
export default function YearDropdown({ value, onChange, options }) {
  return (
    <label>
      연도:&nbsp;
      <select
        value={value}
        // "e.target.value"는 사용자가 새롭게 선택한 연도 값.
        // "onChange(e.target.value)"를 통해 부모 컴포넌트에게 변경사항을 알림.
        onChange={(e) => onChange(e.target.value)}
        className="ml-1"
      >
        {options.map((opt) => (
          // 선택된 연도 옵션을 UI에 표시
          <option key={opt} value={opt}>
            {opt === "전체" ? "전체" : `${opt}년`}
          </option>
        ))}
      </select>
    </label>
  );
}
