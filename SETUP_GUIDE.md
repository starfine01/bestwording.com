# Best Wording 프로젝트 실행 가이드

## 문제 해결: localhost 연결 오류

### 1. Node.js 설치 확인

Node.js가 설치되어 있지 않다면 다음 단계를 따라주세요:

1. [Node.js 공식 웹사이트](https://nodejs.org/)에서 LTS 버전 다운로드
2. 설치 후 터미널을 재시작
3. 다음 명령어로 설치 확인:
   ```bash
   node --version
   npm --version
   ```

### 2. 프로젝트 실행 방법

프로젝트 디렉토리에서 다음 명령어를 실행하세요:

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 실행
npm run dev
```

### 3. 접속 주소

서버가 시작되면 다음 주소로 접속하세요:
- **http://localhost:8080** (vite.config.ts에서 포트 8080으로 설정됨)

### 4. 대안: 다른 터미널 사용

PowerShell 대신 다음을 사용해보세요:
- **Command Prompt (cmd)**
- **Git Bash**
- **Windows Terminal**

### 5. 포트 변경 (선택사항)

다른 포트를 사용하고 싶다면 `vite.config.ts` 파일을 수정하세요:

```typescript
server: {
  host: "::",
  port: 5173, // 원하는 포트 번호로 변경
},
```

### 6. 문제가 계속되면

1. 방화벽 설정 확인
2. 다른 프로그램이 8080 포트를 사용 중인지 확인
3. 관리자 권한으로 터미널 실행


