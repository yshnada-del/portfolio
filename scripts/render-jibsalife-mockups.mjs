import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const sharp = require('../.local-work/mockup-tools/node_modules/sharp');
const root = path.resolve(import.meta.dirname, '..');
const templates = path.join(root, 'src/assets/project-01-templates');
const screens = path.join(root, 'src/assets/project-01-screens');
const originals = path.join(root, '.local-work/mockup-tools/originals');
const output = path.join(root, 'src/assets/project-01-sections');

// Coordinates refer to the original 1920 x 1080 exports. Only these image
// regions are replaced; headings, descriptions and annotations stay untouched.
const boards = [
  { name:'onboarding', erase:[[168,476,234,473],[475,477,234,473],[782,474,234,473],[1100,476,234,473],[1433,294,339,683]], phones:[['welcome',170,478,230,'환영 화면'],['daily',477,479,230,'일상 기록'],['community-intro',784,476,230,'집사 커뮤니티'],['ai-intro',1102,478,230,'AI 건강 체크'],['login',1438,280,328,'로그인']] },
  { name:'login-page', erase:[[358,467,234,471],[665,467,234,471],[972,467,234,471],[1279,467,234,471]], phones:[['login',361,469,230,'로그인'],['signup',668,469,230,'회원가입'],['terms',975,469,230,'서비스 이용약관'],['privacy',1282,469,230,'개인정보 처리방침']] },
  { name:'health-01', erase:[[772,163,376,753],[354,573,221,474],[1300,227,245,265],[1350,674,230,330]], phones:[['health-photo',787,166,340,'건강 체크'],['health-photo',356,575,212,'사진 기록']], details:[['health-pet-sheet',1302,229,240,260],['health-memo-sheet',1352,676,225,325]] },
  { name:'health-02', erase:[[399,493,234,474],[868,493,234,474],[1337,493,234,474]], phones:[['health-result',403,496,226,'건강 리포트'],['health-detail',872,496,226,'상세 건강 정보'],['health-hospitals',1341,496,226,'주변 동물병원']] },
  { name:'calendar', erase:[[794,212,361,750],[1323,580,275,402]], phones:[['calendar',801,214,350,'날짜별 건강 기록']], details:[['calendar-memo-sheet',1325,582,270,396]] },
  { name:'home-01', erase:[[765,249,393,831]], phones:[['home',785,250,350,'오늘의 요약']] },
  { name:'home-02', erase:[[765,249,393,831]], phones:[['home-vote',785,250,350,'베스트 포즈 투표']] },
  { name:'home-03', erase:[[765,249,393,831]], phones:[['home-story',785,250,350,'펫스토리']] },
  { name:'my-page', panels:[
    [[100,80,630,350],100,80],
    [[400,465,240,43],150,455],[[448,509,300,60],198,499],
    [[1270,365,300,43],150,565],[[1320,410,450,60],200,609],
    [[1270,515,300,36],150,675],[[1320,550,480,32],200,709],
    [[280,650,300,36],150,785],[[326,686,350,55],196,825],
    [[1318,845,340,35],150,905],[[1367,878,480,32],199,938]],
    phones:[['mypage',760,180,355,'프로필 · 포인트'],['mypage-lower',1215,180,355,'활동 · 구독 관리']] },
  { name:'petstagram', panels:[[[100,80,630,350],100,80]], features:[
    ['구독 현황','이용 중인 플랜과 구독 기간,\n다음 결제일을 확인할 수 있어요.',500],
    ['전용 혜택','받은 혜택과 제공되는 기능을\n펼쳐서 확인할 수 있어요.',680],
    ['연간 구독 전환','현재 구독 정보를 살펴보고\n연간 구독으로 전환할 수 있어요.',860]],
    phones:[['premium-manage',760,180,355,'구독 관리']],
    details:[['premium-expanded-detail',1215,{bottom:930},355,null,'전용 혜택 · 구독 정보 확대']] },
  { name:'community-01', erase:[[263,539,234,475],[570,539,234,475],[877,539,234,475],[1184,539,234,475],[1491,539,234,475]], phones:[['community',267,542,226,'커뮤니티 홈'],['challenge',574,542,226,'챌린지'],['challenge-reward',881,542,226,'챌린지 보상'],['daily-feed',1188,542,226,'집사들의 일상'],['knowledge',1495,542,226,'반려 상식']] },
  { name:'community-02', erase:[[260,541,234,475],[567,541,234,475],[874,541,234,475],[1181,541,234,475],[1488,541,234,475]], phones:[['vote',264,544,226,'진행 중인 투표'],['vote-detail',571,544,226,'투표 참여'],['vote-selected',878,544,226,'후보 선택'],['vote-result',1185,544,226,'투표 결과'],['vote-reward',1492,544,226,'참여 완료']] },
  { name:'community-03', erase:[[485,528,234,474],[859,528,234,474],[1233,528,234,474]], phones:[['daily-feed',489,531,226,'일상 피드'],['post',863,531,226,'게시글 상세'],['write-post',1237,531,226,'일상 작성']] },
  { name:'ai-chat', panels:[[[100,80,630,350],100,80],
    [[1270,469,320,35],150,470],[[1318,505,500,60],198,510],
    [[224,590,300,35],150,600],[[270,625,340,60],196,640],
    [[335,889,260,35],150,730],[[383,924,310,60],198,770],
    [[1306,914,340,35],150,860],[[1353,951,380,60],197,900]],
    phones:[['ai-chat',760,180,355,'AI 건강 체크 · 첫 안내'],['ai-chat-options',1215,180,355,'대화로 기록 선택']] },
];

// Shared editorial layout: original heading, ordered explanations on the
// left, and current native screenshots on the right. No floating leaders.
const tidyLayouts={
  'health-01':{
    features:[['카메라','촬영한 이미지를 통해\n건강 상태를 확인할 수 있어요.',500],['반려동물 변경','여러 반려동물 정보를\n쉽고 빠르게 변경할 수 있어요.',680],['메모','기록을 저장하고 AI 분석으로\n건강 상태를 확인할 수 있어요.',860]],
    phones:[['health-photo',760,180,355,'사진으로 건강 기록']],
    details:[['health-pet-sheet',1280,120,270,null,'반려동물 선택'],['health-memo-sheet',1280,{bottom:930},270,null,'건강 기록 메모']]
  },
  'health-02':{
    features:[['AI 분석 진행','건강 기록과 활동량, 식사 변화를\n분석하는 과정을 확인할 수 있어요.',470],['건강 리포트','기록한 건강 데이터와\n분석 결과를 한눈에 확인해요.',610],['상세 건강 정보','AI가 분석한 건강 상태와\n관리 정보를 확인할 수 있어요.',750],['인근 병원 안내','주변 동물병원의 정보와 위치를\n쉽게 확인할 수 있어요.',890]],
    phones:[['health-loading',760,230,240,'AI 분석 중'],['health-result',1035,230,240,'건강 리포트'],['health-detail',1310,230,240,'상세 건강 정보'],['health-hospitals',1585,230,240,'주변 동물병원']]
  },
  calendar:{
    features:[['기록 확인','날짜별 기록 데이터를\n쉽고 간편하게 확인할 수 있어요.',500],['입력 버튼','복잡한 과정 없이\n쉽고 빠르게 기록할 수 있어요.',680]],
    phones:[['calendar',760,180,355,'날짜별 건강 기록']],
    details:[['calendar-memo-sheet',1215,{bottom:930},355,null,'건강 기록 입력']]
  },
  'home-01':{
    features:[['알림 기능','커뮤니티 활동과 AI 건강 알림을\n빠르게 확인할 수 있어요.',500],['오늘의 요약','반려동물 프로필과 식사, 배변, 산책 등\n간단한 기록을 함께 확인할 수 있어요.',680],['이번주 주인공은 나야 나!','가장 많은 사랑을 받은\n반려동물들을 만나보세요.',860]]
  },
  'home-02':{
    startNumber:4,
    features:[['사진찍냥? BEST 포즈 투표하기!','마음에 드는 아이에게\n직접 투표할 수 있어요.',500],['수의사 상담','건강 관련 궁금한 점을\n수의사와 상담해 보세요.',680]]
  },
  'home-03':{
    startNumber:6,
    features:[['펫스토리','건강부터 일상까지\n다양한 반려 정보를 만날 수 있어요.',500]]
  },
  'community-01':{
    features:[['챌린지','다양한 챌린지에 참여하여\n포인트를 받을 수 있어요.',500],['펫스토리','일상, 반려상식 등\n다양한 콘텐츠를 확인할 수 있어요.',680]]
  },
  'community-02':{
    startNumber:3,
    features:[['투표','투표에 참여하고\n포인트를 받을 수 있어요.',500],['투표 참여','마음에 드는 후보를 선택하고\n투표 결과를 확인할 수 있어요.',680],['참여 보상','투표 참여를 완료하고\n보상을 받을 수 있어요.',860]]
  },
  'community-03':{
    startNumber:6,
    headerSource:'community-01',
    features:[['커뮤니티 활성화','다양한 집사들의 일상을\n확인하고 소통할 수 있어요.',500],['게시글 상세','게시글과 사진을 살펴보며\n집사들의 이야기를 만나보세요.',680],['일상 작성','우리 아이의 소중한 순간을\n사진과 글로 기록할 수 있어요.',860]]
  }
};
for(const board of boards){
  const layout=tidyLayouts[board.name];
  if(!layout)continue;
  board.panels=[[[100,80,630,board.name==='health-02'?330:350],100,80]];
  board.tidy=true;
  Object.assign(board,layout);
  if(!layout.phones){
    if(board.phones.length===1)board.phones=board.phones.map(([name,,,,label])=>[name,1060,180,355,label]);
    else if(board.phones.length===3)board.phones=board.phones.map(([name,,,,label],i)=>[name,760+i*360,210,270,label]);
    else board.phones=board.phones.map(([name,,,,label],i)=>[name,i<3?800+i*330:965+(i-3)*330,i<3?55:560,210,label]);
  }
}

export const referencedMockupScreens=()=>[...new Set(boards.flatMap(b=>[...b.phones.map(p=>p[0]),...(b.details||[]).map(p=>p[0])]))];
const CAPTION_GAP=24;
const panelBottoms={onboarding:974,'login-page':972,'health-02':1000,'community-01':1035,'community-02':1035,'community-03':1035};

const templatePath = board => path.join(templates,board.name+(board.panels?'-complete':'')+'.png');

async function makeTemplate(board) {
  const target = templatePath(board);
  if(!process.argv.includes('--rebuild-templates') && !(board.panels && process.argv.includes('--rebuild-panels'))) {
    try { await fs.access(target); return; } catch {}
  }
  if(board.panels) {
    const layers=[];
    for(const [index,[[left,top,width,height],x,y]] of board.panels.entries()) {
      const piece=await sharp(path.join(originals,(index===0&&board.headerSource?board.headerSource:board.name)+'.png')).extract({left,top,width,height}).removeAlpha().raw().toBuffer();
      if(index===0&&board.tidy){
        // Remove the old panel gradient behind the heading without changing
        // any of its visible text, color or weight.
        for(let i=0;i<piece.length;i+=3)if(Math.max(piece[i],piece[i+1],piece[i+2])<80)piece.fill(21,i,i+3);
      }
      if(index>0&&index%2===0) {
        // Body-text crops must not carry fragments of the old purple leaders.
        for(let i=0;i<piece.length;i+=3)if(piece[i+2]>piece[i]+14&&piece[i+2]>piece[i+1]+20)piece.fill(21,i,i+3);
      }
      const input=await sharp(piece,{raw:{width,height,channels:3}}).png().toBuffer();
      layers.push({input,left:x,top:y});
    }
    await sharp({create:{width:1920,height:1080,channels:3,background:'#151515'}}).composite(layers).png().toFile(target);
    return;
  }
  const {data,info} = await sharp(path.join(originals,board.name+'.png')).removeAlpha().raw().toBuffer({resolveWithObject:true});
  const original = Buffer.from(data);
  for (const [baseX,baseY,baseW,baseH] of board.erase) {
    // Include old bezel side buttons, antialiasing and shadows in the mask.
    const x=baseX-14,y=Math.max(0,baseY-4),w=baseW+28,h=baseH+8;
    for(let row=y;row<Math.min(info.height,y+h);row++) {
      // Recover the smooth original background between the two outside edges.
      for(let col=x;col<x+w;col++) {
        const t=(col-x+1)/(w+1);
        for(let c=0;c<3;c++) {
          const sample = col => {
            for(const offset of [0,-4,4,-8,8]) {
              const r=Math.max(0,Math.min(info.height-1,row+offset));
              const at=(r*info.width+col)*3;
              // A dotted purple leader is foreground, not the background.
              if(original[at+2]>original[at]+14&&original[at+2]>original[at+1]+20)continue;
              return original[at+c];
            }
            return 21;
          };
          const left=sample(x-1);
          const right=sample(x+w);
          data[(row*info.width+col)*3+c]=Math.round(left+(right-left)*t);
        }
      }
    }
  }
  await sharp(data,{raw:{width:info.width,height:info.height,channels:3}}).png().toFile(target);
}

const deviceCSS = `*{box-sizing:border-box}html,body{margin:0;background:transparent}.device{position:absolute;left:10px;top:10px;width:408px;height:862px;padding:7px;border:2px solid #535551;border-radius:49px;background:#222522;box-shadow:inset 0 0 0 2px #777b72}.device:before{content:'';position:absolute;width:3px;height:55px;background:#595e56;top:145px;left:-4px;border-radius:2px;box-shadow:0 65px #595e56}.device:after{content:'';position:absolute;width:3px;height:75px;background:#595e56;top:190px;right:-4px;border-radius:2px}.device>img{display:block;width:390px;height:844px;max-width:none;border-radius:39px;background:#fff}.notch{position:absolute;top:8px;left:50%;width:210px;height:31px;border-radius:0 0 22px 22px;background:#121412;transform:translateX(-50%)}.notch:after{content:'';position:absolute;top:10px;left:50%;width:48px;height:4px;border-radius:4px;background:#343734;transform:translateX(-50%)}`;

export { deviceCSS };

export async function renderMockups(browser,fontData) {
  await fs.mkdir(templates,{recursive:true});
  const devicePage = await browser.newPage({viewport:{width:428,height:882},deviceScaleFactor:3});
  const deviceCache = new Map();
  async function device(name) {
    if(deviceCache.has(name)) return deviceCache.get(name);
    const screen = await fs.readFile(path.join(screens,name+'.png'));
    await devicePage.setContent(`<style>${deviceCSS}</style><div class="device"><img src="data:image/png;base64,${screen.toString('base64')}"><div class="notch"></div></div>`);
    await devicePage.locator('img').evaluate(i=>i.decode());
    const result=await devicePage.screenshot({omitBackground:true});
    deviceCache.set(name,result);return result;
  }
  const captionPage = await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:2});
  const selectedBoards=process.argv.includes('--home-only')?boards.filter(b=>['home-02','home-03'].includes(b.name)):process.argv.includes('--health-only')?boards.filter(b=>b.name==='health-02'):process.argv.includes('--update-cropped')||process.argv.includes('--only-cropped')?boards.filter(b=>b.panels):boards;
  let textChecks=[];
  if(selectedBoards.length<boards.length) {
    try {
      textChecks=JSON.parse(await fs.readFile(path.join(screens,'typography-checks.json'),'utf8')).filter(r=>!selectedBoards.some(b=>b.name===r.name));
    } catch {}
  }
  for(const board of selectedBoards) {
    await makeTemplate(board);
    const layers=[];
    const labelPositions=board.phones.map(([,x,y,w])=>({x,w,phoneBottom:y+862*w/408,top:y+862*w/408+CAPTION_GAP}));
    const graphicRects=board.phones.map(([,x,y,w])=>({x,y,w,h:862*w/408}));
    const detailLabels=[];
    if(panelBottoms[board.name]&&!board.panels) {
      const end=Math.round(Math.min(Math.max(...labelPositions.map(p=>p.phoneBottom))+12,Math.min(...labelPositions.map(p=>p.top))-8));
      const curve=await sharp(templatePath(board)).extract({left:0,top:panelBottoms[board.name]-48,width:1920,height:48}).resize(3840,96,{kernel:'nearest'}).toBuffer();
      layers.push({input:curve,left:0,top:(end-48)*2});
      layers.push({input:await sharp({create:{width:3840,height:(1080-end)*2,channels:3,background:'#151515'}}).png().toBuffer(),left:0,top:end*2});
    }
    for(const [name,x,y,w] of board.phones) {
      const scale=w/408;
      const input=await sharp(await device(name)).resize(Math.round(428*scale*2),Math.round(882*scale*2),{kernel:'lanczos3'}).toBuffer();
      layers.push({input,left:Math.round((x-10*scale)*2),top:Math.round((y-10*scale)*2)});
    }
    for(const [name,x,position,w,height,label] of board.details||[]) {
      const source=sharp(path.join(screens,name+'.png'));
      const meta=await source.metadata();
      const h=height||Math.round(meta.height/meta.width*w);
      const y=typeof position==='number'?position:position.bottom-h;
      const input=await source.resize(w*2,h*2,{fit:'contain',background:'#ffffff',kernel:'lanczos3'}).toBuffer();
      layers.push({input,left:x*2,top:y*2});
      graphicRects.push({x,y,w,h});
      if(label){
        labelPositions.push({x,w,phoneBottom:y+h,top:y+h+CAPTION_GAP});
        detailLabels.push(`<span class="caption" style="left:${x-30}px;top:${y+h+CAPTION_GAP}px;width:${w+60}px">${label}</span>`);
      }
    }
    const labels=board.phones.map(([,x,y,w,label])=>`<span class="caption" style="left:${x-30}px;top:${y+862*w/408+CAPTION_GAP}px;width:${w+60}px">${label}</span>`).join('')+detailLabels.join('');
    const features=(board.features||[]).map(([title,body,y],i)=>`<div class="feature" style="top:${y}px"><span class="number">${i+(board.startNumber||1)}</span><b>${title}</b><p>${body.replaceAll('\n','<br>')}</p></div>`).join('');
    await captionPage.setContent(`<meta charset="utf-8"><style>@font-face{font-family:Pretendard;font-weight:100 900;src:url(data:font/woff2;base64,${fontData}) format('woff2')}html,body{margin:0;background:transparent;font-family:Pretendard,sans-serif;-webkit-font-smoothing:antialiased}.caption{position:absolute;white-space:nowrap;text-align:center;font-size:22px;font-weight:600;line-height:30px;color:#e1dce9}.feature{position:absolute;left:150px;padding-left:49px;width:530px;color:#eee}.feature b{font-size:24px;font-weight:600;line-height:34px}.feature p{font-size:20px;font-weight:400;line-height:28px;margin:10px 0 0;color:#b9b9b9}.number{position:absolute;left:0;top:2px;width:28px;height:28px;border:1px solid #9675c4;border-radius:50%;display:grid;place-items:center;font-size:20px}</style>${labels}${features}`);
    await captionPage.evaluate(()=>document.fonts.ready);
    await captionPage.locator('.caption').evaluateAll(els=>{for(const e of els){const r=e.getBoundingClientRect();if(r.bottom>1080||r.top<0)throw new Error('Caption clipped');}});
    const captionRects=await captionPage.locator('.caption').evaluateAll(els=>els.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height};}));
    const intersects=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
    if(board.tidy&&captionRects.some(c=>graphicRects.some(g=>intersects(c,g))))throw new Error(board.name+': caption overlaps screenshot');
    await captionPage.locator('.feature').evaluateAll(els=>{for(let i=0;i<els.length;i++){const r=els[i].getBoundingClientRect();if(r.bottom>1040||r.right>730||(i&&els[i-1].getBoundingClientRect().bottom>r.top))throw new Error('Explanation overflow or overlap');}});
    layers.push({input:await captionPage.screenshot({omitBackground:true}),left:0,top:0});
    const target=path.join(output,board.name+'.png');
    // Keep original text pixels exact. Only the mockups and new labels are
    // rasterized at higher density; existing typography is never re-typeset.
    await sharp(templatePath(board)).resize(3840,2160,{kernel:'nearest'}).composite(layers).png().toFile(target);
    if(board.name==='health-02'){
      // This band previously contained the clipped top edge of an old
      // callout. It must be plain background, including at export density.
      const band=await sharp(target).extract({left:200,top:800,width:1260,height:100}).removeAlpha().raw().toBuffer();
      if(band.some(value=>value!==21))throw new Error('Health heading still has callout fragments');
    }
    const crop={left:100,top:80,width:600,height:board.name==='health-02'?330:350};
    let reference=path.join(originals,(board.headerSource||board.name)+'.png');
    try { await fs.access(reference); } catch { reference=templatePath(board); }
    const before=await sharp(reference).extract(crop).removeAlpha().raw().toBuffer();
    const after=await sharp(target).resize(1920,1080,{kernel:'nearest'}).extract(crop).removeAlpha().raw().toBuffer();
    const headingPreserved=board.tidy?before.every((value,i)=>Math.max(before[i-i%3],before[i-i%3+1],before[i-i%3+2])<80||value===after[i]):before.equals(after);
    if(!headingPreserved) throw new Error(board.name+': original heading pixels changed');
    textChecks.push({name:board.name,originalTypographyPreserved:true,width:3840,height:2160,captionGap:CAPTION_GAP,labelPositions});
    console.log('Restored original typography and updated mockups:',board.name);
  }
  await fs.writeFile(path.join(screens,'typography-checks.json'),JSON.stringify(textChecks,null,2));
  await captionPage.close();await devicePage.close();
}
