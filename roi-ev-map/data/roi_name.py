import geopandas as gpd
import os

print(os.getcwd())  # 현재 작업 경로 출력
print(os.listdir()) # 폴더 내 파일 목록 출력

# 1. 파일 읽기
gdf = gpd.read_file("metro_roi.geojson")

# 2. region 컬럼 생성 함수
def get_region(adm_cd):
    code = str(adm_cd)[:2]
    if code == "11":
        return "서울"
    elif code == "31":
        return "경기"
    elif code == "23":
        return "인천"
    else:
        return "기타"

# 3. region 컬럼 추가
gdf["region"] = gdf["ADM_CD"].apply(get_region)

# 4. 새로운 geojson으로 저장
gdf.to_file("metro_roi_region.geojson", driver="GeoJSON")
print("region 컬럼 추가 및 저장 완료!")
