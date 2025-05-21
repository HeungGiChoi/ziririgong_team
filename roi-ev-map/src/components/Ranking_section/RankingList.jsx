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
