# 수도권 EV 이동/인프라 (수요) 데이터 분석

이 저장소는 수도권(서울/경기/인천) EV 이동 데이터와 관련 인프라(충전소, 주차장) 데이터를 활용한  
**이동 경로 분석**, **히트맵 시각화**, **최종 산출 DB 생성**, **GeoJSON 변환** 등의 파이프라인을 제공합니다.

---

## 📂 주요 Jupyter Notebook 파일 설명

### 1. 수도권_이동동선 반영_heatmap.ipynb
- **역할/목적:**  
  - 수도권 EV 이동 데이터를 활용해 출발지 기준 **이동량 히트맵 시각화**
- **주요 함수/처리:**
  - **HeatMap 데이터 생성:**  
    - 출발지 위도/경도와 이동량을 묶어 히트맵에 사용할 리스트 생성  
    - `heat_data = [[lat, lon, count] for lat, lon, count in ...]`
  - **folium 지도 및 히트맵:**  
    - folium 지도 생성, HeatMap 레이어 추가  
    - 서울시 행정동 경계(GeoJSON) 레이어 추가  
  - **결과 저장:**  
    - 지도 객체를 html로 저장 (`m.save()`)

---

### 2. 수도권_중심 좌표_geopy.ipynb
- **역할/목적:**  
  - OD(출발-도착) 데이터에서 **주소 → 위경도** 변환 및 **중심 좌표** 산출
- **주요 함수/처리:**
  - **get_lat_lon_cached(address)**  
    - 입력: 행정동 주소 문자열  
    - 처리:  
      - geopy로 주소 → 위경도 변환, 결과를 캐시 딕셔너리에 저장  
      - 예외/오류시 None 반환  
    - 출력: pd.Series([위도, 경도])
  - **중심좌표 산출:**  
    - 출발/도착지 위경도의 산술평균으로 중심 위경도 계산  
      - `df['중심_lat'] = (df['출발_lat'] + df['도착_lat']) / 2`

---

### 3. 최종산출물_DB_제작.ipynb
- **역할/목적:**  
  - 이동량/충전소/주차장 등 다양한 raw 데이터를 행정동별로 **집계 및 병합하여 최종 분석 DB** 생성
- **주요 함수/처리:**
  - **get_adm_info_kakao(lat, lon, api_key)**  
    - 입력: 위도(lat), 경도(lon), Kakao REST API 키  
    - 처리: Kakao API 호출로 해당 좌표의 행정동 코드/이름/시군구 반환  
    - 출력: dict (`{"adm_code": ..., "adm_name": ..., "region_group": ...}`)
  - **batch_geocode_with_cache(df, api_key, sleep_sec)**  
    - 입력: 위경도 컬럼이 있는 DataFrame, API 키, 대기시간  
    - 처리: DataFrame의 모든 고유 좌표에 대해 행정동 정보 반복 호출 및 캐시  
    - 출력: (lat, lon) → 행정동 정보 dict 매핑 딕셔너리
  - **assign_adm_info(df, coord_to_adm)**  
    - 입력: DataFrame, 좌표→행정동 dict  
    - 처리: 각 row의 lat/lon에 맞는 행정동 정보를 새로운 컬럼으로 부여  
    - 출력: 행정동 컬럼 추가된 DataFrame
  - **enrich_with_adm_info(df, geojson)**  
    - 입력: 좌표 포함 DataFrame, 행정동 geojson  
    - 처리: 공간 join으로 각 row에 행정동 코드/이름 등 추가  
    - 출력: DataFrame(geometry, adm_code 등 추가)
  - **최종 집계:**  
    - 이동량: groupby("adm_code")로 합계  
    - 충전소: groupby 후 충전소/충전기 개수, 공영/민영 분리  
    - 주차장: groupby 후 주차장/주차면/공영/민영  
    - 데이터 결합/병합 후 분석 지표 파생 및 CSV 저장

---

### 4. final_DB_to_geojson.ipynb
- **역할/목적:**  
  - 최종 분석 DB(CSV)를 **행정동 GeoJSON 파일**과 병합  
  - 공간정보 포함 **GeoJSON(최종 분석결과 포함) 생성**
- **주요 함수/처리:**
  - **merge_and_save(df, name):**
    - 입력: 최종 DB(DataFrame), 병합결과명  
    - 처리: adm_code 기준으로 행정동 geometry(GeoJSON) 병합  
    - 출력: GeoDataFrame(geometry 컬럼 포함), 필요시 파일 저장
  - **불필요한 컬럼(drop):**
    - 분석용 파생 컬럼 등 최종 결과에 불필요한 컬럼 제외 후 저장  
    - `to_file()`로 geojson 파일 생성

---

### 5. metropoli_center_lat_lon_extract.ipynb
- **역할/목적:**  
  - 수도권 OD 데이터의 **출발/도착 주소 → 위경도 변환**  
  - 대량 주소를 **병렬로 Kakao API 호출** 후 매핑하여 최종 DB 저장
- **주요 함수/처리:**
  - **get_lat_lng(address, api_key):**  
    - 입력: 주소, Kakao REST API 키  
    - 처리: Kakao API로 해당 주소의 위경도 반환  
    - 출력: (위도, 경도) 튜플
  - **ThreadPoolExecutor 활용:**  
    - 출발/도착 주소 리스트 각각에 대해 get_lat_lng를 병렬 호출  
    - 변환된 위경도를 원본 데이터의 각 row에 재매핑  
  - **최종 CSV 저장:**  
    - 위경도 컬럼이 추가된 데이터프레임을 새로운 CSV로 저장

---

## 💡 전체 파이프라인 흐름

1. **데이터 수집 및 전처리**  
   - EV 이동, 충전소, 주차장 데이터 csv
2. **주소 → 위경도 변환 및 OD 중심 좌표 산출**
3. **히트맵/시각화**
4. **최종 행정동 DB 생성(분석/집계)**
5. **GeoJSON 변환(공간정보 결합)**

---

