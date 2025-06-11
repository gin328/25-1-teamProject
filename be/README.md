# BE

## 🌿 Git 브랜치 전략

- `main`: 배포용 (최종 통합 브랜치)
- `dev`: 개발 통합 브랜치
- `feat/기능명`: 각자 기능 단위 작업용 브랜치  
  예: `feat/user-api`, `feat/place-review`

> 작업 후 → PR 보내서 `dev`에 병합하고,  
> `dev`가 안정되면 `main`에 병합합니다.


## ✅ 커밋 예시

git checkout -b feat/user-api

git add .

git commit -m "feat: 사용자 로그인 API 구현"

git push origin feat/user-api
