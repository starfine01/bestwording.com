# Build Troubleshooting (Windows)

## 증상
`npm run build`가 오류 메시지 없이 종료 코드 `-1073740791`로 종료됨 (STATUS_STACK_BUFFER_OVERRUN).

## 원인 후보
- Node v24.x에서 Vite/rollup 실행 중 프로세스 크래시
- 오래된 caniuse-lite 데이터 경고 처리 실패

## 해결 방법
1. **Node LTS로 변경** (권장)
   - 20.x 또는 22.x 사용

2. **Browserslist 업데이트**
   - `npx update-browserslist-db@latest`
   - Bun이 필요하면 PATH에 bun을 추가

3. **환경 변수로 경고 무시**
   - Windows
     ```cmd
     set BROWSERSLIST_IGNORE_OLD_DATA=1
     npm run build
     ```

## 로그 위치
- npm 로그: `C:\Users\김혜경\AppData\Local\npm-cache\_logs\*.log`
- build 로그(수동 저장): `build-final.log`
