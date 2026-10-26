# KorEdu 프로젝트 규칙

## 배포 자동화

**필수**: 코드 수정 후 다음 명령어를 **항상** 실행하세요.

```bash
npm run build && firebase deploy && git add . && git commit -m "YYYYMMDD_HHMM" && git push origin main
```

### 언제 실행하는가
- ✅ learnerView.js, main.js 등 src 파일 수정 후
- ✅ CSS, HTML 구조 변경 후
- ❌ 주석만 추가한 경우는 선택사항
- ❌ 임시 파일 작업 후는 불필요

### 확인 체크리스트
1. 코드 수정 완료
2. npm run build → ✓ 빌드 완료
3. firebase deploy → ✓ Firebase 배포 완료
4. git add . && git commit -m "YYYYMMDD_HHMM"
5. git push origin main → ✓ GitHub 푸시 완료

**이 4단계가 모두 완료되어야 작업이 끝난 것입니다.**
