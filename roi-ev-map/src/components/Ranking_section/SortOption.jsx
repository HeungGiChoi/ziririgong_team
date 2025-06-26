// 정렬 기준과 관련된 변경사항을 표시하는 컴포넌트
// Props 설명
// sortBy : 현재 선택된 정렬 기준
// setSortBy : 사용자가 새롭게 선택한, 변경된 정렬 기준
// sortOpts : 선택 가능한 정렬 기준 옵션들
export default function SortOption({ sortBy, setSortBy, sortOpts }) {
  return (
    <label>
      <strong>정렬 기준:&nbsp;</strong>
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        {sortOpts.map((opt) => (
          // 변경된 정렬 기준을 표시
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
