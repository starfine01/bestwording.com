# Supabase 설정 가이드 (BestWording)

이 문서는 `supabase/schema.sql` 기준으로 BestWording 프로젝트의 Supabase DB/RLS를 구성하는 방법을 정리합니다.

## 1) Supabase 프로젝트 생성
1. https://supabase.com 에서 새 프로젝트를 생성합니다.
2. 프로젝트 설정에서 **Project URL**과 **anon key**를 확인합니다.

## 2) SQL 스키마 적용
Supabase SQL Editor에서 아래 파일 내용을 그대로 실행합니다.

- `supabase/schema.sql`

이 스키마는 다음 테이블과 RLS 정책을 포함합니다.
- `profiles`
- `writings`
- `diaries`
- `goals`
- `transcriptions`
- `admin_messages`

> 기본 정책은 모두 **본인 데이터만 접근 가능**하도록 되어 있습니다.

## 3) 환경 변수 설정
### 클라이언트(Vite)
`.env.local` 또는 Vercel Project Settings에 아래 값을 설정합니다.

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

### 서버리스(API)
관리자 API에서 서비스 롤 키가 필요합니다.

```
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## 4) 관리자 메시지 API
관리자 전용 메시지 조회/수정/삭제는 서버리스 엔드포인트를 사용합니다.

- `POST /api/admin-messages`
- actions: `list | update | reply | delete`

### 예시
```
POST /api/admin-messages
{
  "action": "list"
}
```

```
POST /api/admin-messages
{
  "action": "reply",
  "payload": {
    "id": "uuid",
    "adminReply": "답변 내용"
  }
}
```

## 5) 알림(Resend)
운영진 답변 메일 발송을 위해 아래 환경 변수를 추가합니다.

```
RESEND_API_KEY=...
USER_REPLY_FROM=BestWording <no-reply@bestwording.com>
```

## 6) 체크리스트
- [ ] `schema.sql` 적용 완료
- [ ] `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` 세팅
- [ ] `SUPABASE_SERVICE_ROLE_KEY` 세팅
- [ ] `RESEND_API_KEY`/`USER_REPLY_FROM` 세팅
- [ ] 관리자 계정 이메일이 `src/lib/auth.ts`의 `adminEmails`에 포함됨
