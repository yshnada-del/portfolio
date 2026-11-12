집사인생 앱 소스: ../jibsalife (또는 JIBSALIFE_SOURCE 환경 변수로 지정)

집사인생 소스를 수정한 뒤 `npm run prepare:jibsalife`를 실행하면 빌드 결과가
public/jibsalife에 복사됩니다. 포트폴리오의 앱 바로가기는 이 경로를 엽니다.
`npm run build`도 앱을 먼저 준비하므로 포트폴리오 배포에 함께 포함됩니다.

집사인생만 개발할 때는 해당 폴더에서 `npm run dev`를 실행합니다.
PC에서는 체험 랜딩 화면, 모바일 또는 ?mobile=1에서는 기존 앱이 표시됩니다.
QR은 공개 앱 주소 https://new-jibsalife.vercel.app 으로 연결됩니다.

이 작업은 로컬 소스와 빌드만 변경하며 GitHub push 또는 배포는 수행하지 않습니다.
