import cssIcon from '../assets/css.png';
import figmaIcon from '../assets/figma.png';
import htmlIcon from '../assets/html.png';
import illustratorIcon from '../assets/illust.png';
import javascriptIcon from '../assets/javascript.png';
import photoshopIcon from '../assets/photoshop.png';
import reactIcon from '../assets/react.png';

export const aboutScrollScenes = [
  {
    id: 'information',
    title: 'INFORMATION',
    type: 'information',
  },
  {
    id: 'education',
    title: 'EDUCATION',
    type: 'timeline',
    items: [
      ['2011.03 - 2014.02', '상동고등학교', '이과 졸업'],
      ['2014.03 - 2019.02', '국제패션디자인전문학교', '패션디자인과 전문 학사 졸업'],
      ['2025.12 - 2026.06', '이젠아카데미 DX교육센터', 'UX/UI 디자인 & 웹기획 프론트엔드 부트캠프'],
    ],
  },
  {
    id: 'experience',
    title: 'EXPERIENCE',
    type: 'timeline',
    items: [
      ['2020.12 - 2021.07', '슬링스톤', '패션디자인'],
      ['2021.09 - 2023.06', '엘 로꼬', '패션 사업 운영'],
      ['2023.07 - 2025.12', '제이앤에스커넥터', '제조 및 납품'],
    ],
  },
  {
    id: 'tools',
    title: 'TOOLS',
    type: 'tools',
    items: [
      ['Figma', 80, figmaIcon],
      ['Photoshop', 70, photoshopIcon],
      ['Illustrator', 65, illustratorIcon],
      ['React', 50, reactIcon],
      ['HTML', 78, htmlIcon],
      ['CSS', 75, cssIcon],
      ['JavaScript', 55, javascriptIcon],
    ],
  },
  {
    id: 'awards',
    title: 'AWARDS',
    type: 'awards',
    items: [
      ['2018.11', '패션디자인전문학교 우수작품상'],
      ['2018.11', '패션디자인전문학교 협력사상'],
      ['2026.04', '이젠아카데미 DX교육센터 프로젝트 우수상'],
      ['2026.06', '이젠아카데미 DX교육센터 개근상'],
    ],
  },
  {
    id: 'exhibition',
    title: 'EXHIBITION',
    type: 'awards',
    items: [
      ['2018.07', '강남페스티벌 패션쇼 신진 디자이너 콘테스트 참가'],
      ['2019.03', 'K패션오디션 참가'],
      ['2019.06', '케이브랜드 NIX 데님 콘테스트 참가'],
    ],
  },
];
