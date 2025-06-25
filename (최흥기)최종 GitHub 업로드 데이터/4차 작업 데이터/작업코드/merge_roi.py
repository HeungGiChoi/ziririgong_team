# merge_roi.py  ───────────────────────────────────────────
import geopandas as gpd
import pandas as pd

# ── 파일 경로 (원하는 대로 수정) ──────────────────────────
GEO_FILE   = "metro_only_new.geojson"   # 폴리곤
PARK_FILE  = "수도권_주차장데이터.csv"          # 주차장  : lon, lat
STAT_FILE  = "수도권_충전소데이터.csv"          # 충전소  : lon, lat
FLOW_FILE  = "30년도_수도권_이동_필터링.csv"      # 이동량  : lon, lat
KEY_COL    = "ADM_CD"               # GeoJSON 기준 열
# ────────────────────────────────────────────────────────

def point_to_adm(file, lon_col="lon", lat_col="lat", new_name="value"):
    """CSV의 점 → 행정동 매핑 후 동별 건수 집계"""
    print(f"  📥 {file} 로딩")
    df = pd.read_csv(file)
    # csv파일을 GeoDataFrame, POINT 객체로 변환.
    g_points = gpd.GeoDataFrame(
        df,
        geometry=gpd.points_from_xy(df[lon_col], df[lat_col]),
        crs="EPSG:4326",
    )
    # 수도권 행정동 geojson 파일 기준으로 join.
    joined = gpd.sjoin(g_poly, g_points, how="left", predicate="contains")
    # ADM_CD가 같은 행끼리 그룹, Series형태, rename을 통해 컬럼이름 변경, reset_index()를 통해 merge가 편하도록 DataFrame형식으로 변경
    cnt = (
        joined.groupby(KEY_COL)
              .size()
              .rename(new_name)
              .reset_index()
    )
    return cnt

print("📥 수도권 GeoJSON 로딩")
g_poly = gpd.read_file(GEO_FILE)[[KEY_COL, "ADM_NM", "geometry"]]

# ── CSV 3개를 ADM_CD 기준 집계 ────────────────────────────
park_cnt = point_to_adm(PARK_FILE,  new_name="parking_cnt")
stat_cnt = point_to_adm(STAT_FILE,  new_name="station_cnt")
flow_cnt = point_to_adm(FLOW_FILE,  new_name="traffic")

# ── 폴리곤에 집계값 머지 후 저장 ─────────────────────────
print("🔗 테이블 병합")
# g_poly에 park_cnt를 merge, 그 값에 차례대로 stat_cnt, flow_cnt를 merge
g_out = (
    g_poly.merge(park_cnt, on=KEY_COL, how="left")
          .merge(stat_cnt, on=KEY_COL, how="left")
          .merge(flow_cnt, on=KEY_COL, how="left")
          .fillna(0)
)

OUT_FILE = "metro_roi_new.geojson"
print(f"💾 {OUT_FILE} 저장")
g_out.to_file(OUT_FILE, driver="GeoJSON")
print("✅ 완료!")
# ────────────────────────────────────────────────────────
