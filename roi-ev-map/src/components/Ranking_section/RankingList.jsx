// 정렬된 행정동 리스트와 관련된 변경사항을 표시하는 컴포넌트
// Props 설명
// features : 현재 선택된 정렬 기준
// 부모 컴포넌트(RankingSection.jsx)에서 이미 정렬된 10개의 features들을 표시만 하는 컴포넌트
export default function RankingList({ features }) {
  return (
    <ol>
      {features.map((f, i) => (
        <li key={f.properties.adm_code}>
          {i + 1}. {f.properties.adm_name}
        </li>
      ))}
    </ol>
  );
}
