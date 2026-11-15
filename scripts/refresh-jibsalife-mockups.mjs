import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { renderMockups } from './render-jibsalife-mockups.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('../.local-work/mockup-tools/node_modules/playwright');
const root = path.resolve(import.meta.dirname, '..');
const work = path.join(root, '.local-work/mockup-tools');
const screens = path.join(root, 'src/assets/project-01-screens');
const output = path.join(root, 'src/assets/project-01-sections');
const base = process.env.JIBSALIFE_CAPTURE_URL || 'http://127.0.0.1:5173/portfolio/jibsalife/index.html?embedded=1';
await fs.mkdir(screens, { recursive: true });
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, locale: 'ko-KR', timezoneId: 'Asia/Seoul' });
// The app's exact font is supplied locally below. Avoid waiting on the CDN's
// subset-font stylesheet, which can otherwise keep FontFaceSet pending.
await context.route(/https:\/\/(cdn\.jsdelivr\.net|unpkg\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)\//, route => route.fulfill({contentType:'text/css',body:''}));
// Supply the app's own demo pet photo as a camera fixture. No physical camera
// is accessed while making the portfolio screenshots.
const petPhoto = await fs.readFile(path.resolve(root, '../jibsalife/src/img/pungpungi.png'));
await context.addInitScript(({ image }) => {
  if (!navigator.mediaDevices) return;
  navigator.mediaDevices.getUserMedia = async () => {
    const photo = new Image();
    photo.src = image;
    await photo.decode();
    const canvas = document.createElement('canvas');
    canvas.width = 1080; canvas.height = 1440;
    const ctx = canvas.getContext('2d');
    const scale = Math.max(canvas.width / photo.width, canvas.height / photo.height);
    const w = photo.width * scale, h = photo.height * scale;
    ctx.drawImage(photo, (canvas.width-w)/2, (canvas.height-h)/2, w, h);
    return canvas.captureStream(1);
  };
}, { image: 'data:image/png;base64,' + petPhoto.toString('base64') });
await context.addInitScript(() => {
  localStorage.setItem('jibsalife.splash.seen', 'true');
  sessionStorage.setItem('jibsalife.splash.seen', 'true');
  localStorage.setItem('jibsalife.health.camera-tutorial.seen', 'true');
  localStorage.setItem('jibsalife.health.camera-tutorial.seen.hello@jipsa.app', 'true');
});
const fontData = (await fs.readFile(path.join(work,'PretendardVariable.woff2'))).toString('base64');
let boxStyle='';
try {
  const font=(await fs.readFile(path.join(work,'boxicons.woff2'))).toString('base64');
  const css=(await fs.readFile(path.join(work,'boxicons.min.css'),'utf8')).replace(/@font-face\s*\{[^}]*\}/g,'');
  boxStyle=`@font-face{font-family:boxicons;font-style:normal;font-weight:normal;src:url(data:font/woff2;base64,${font}) format('woff2')}${css}`;
} catch {}
const page = await context.newPage();
const log = [];
async function settle() {
  await page.waitForTimeout(1000);
  await page.evaluate(async () => {
    await Promise.race([document.fonts.ready,new Promise(resolve=>setTimeout(resolve,5000))]);
    await Promise.race([Promise.all([...document.images].map(i => i.decode().catch(() => {}))),new Promise(resolve=>setTimeout(resolve,5000))]);
  });
}
async function alignVisibleText() {
  return page.evaluate(()=>{
    const roots=[document.querySelector('.chat_room_messages'),document.querySelector('.layout_content')].filter(Boolean);
    const root=roots.find(e=>e.scrollHeight>e.clientHeight+1);
    if(!root)return {partialLines:0,scroll:0};
    const clip=root.getBoundingClientRect(),rects=[];
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    for(let node;node=walker.nextNode();) {
      if(!node.textContent.trim()||node.parentElement.closest('script,style,.material-icons,.bx'))continue;
      let hidden=false;
      for(let e=node.parentElement;e&&e!==root;e=e.parentElement) {
        const s=getComputedStyle(e);
        if(s.display==='none'||s.visibility==='hidden'||s.position==='fixed'||s.position==='sticky'||Number(s.webkitLineClamp)>0||s.textOverflow==='ellipsis'){hidden=true;break;}
      }
      if(hidden)continue;
      const range=document.createRange();range.selectNodeContents(node);
      for(const r of range.getClientRects())if(r.width>1&&r.height>3)rects.push({top:r.top,bottom:r.bottom,height:r.height,text:node.textContent.trim().slice(0,60)});
    }
    const initial=root.scrollTop,max=root.scrollHeight-root.clientHeight;
    const partial=delta=>rects.filter(r=>{const visible=Math.min(r.bottom-delta,clip.bottom)-Math.max(r.top-delta,clip.top);return visible>1&&visible<r.height-2;});
    let best=initial,errors=partial(0);
    for(let distance=2;distance<=120&&errors.length;distance+=2)for(const direction of [1,-1]) {
      const candidate=Math.max(0,Math.min(max,initial+direction*distance));
      const next=partial(candidate-initial);
      if(next.length<errors.length){best=candidate;errors=next;}
      if(!errors.length)break;
    }
    root.scrollTo({top:best,behavior:'instant'});
    return {partialLines:errors.length,scroll:best,clipped:errors.map(r=>r.text)};
  });
}
async function save(name) {
  await settle();
  const icons = await fs.readFile(path.join(work, 'node_modules/material-icons/iconfont/material-icons.woff2'));
  await page.addStyleTag({ content: `@font-face{font-family:'Material Icons';src:url(data:font/woff2;base64,${icons.toString('base64')}) format('woff2')}.material-icons{font-family:'Material Icons';font-weight:normal;font-style:normal;line-height:1;letter-spacing:normal;text-transform:none;display:inline-block;white-space:nowrap;word-wrap:normal;direction:ltr;font-feature-settings:'liga';-webkit-font-smoothing:antialiased}` });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => {
    document.querySelectorAll('.state_bar_time').forEach(e => { e.textContent = '9:41'; });
  });
  if(name === 'login') {
    const lines = await page.locator('.login_hero_text h2').evaluate(e => {
      const range=document.createRange();range.selectNodeContents(e.firstChild);
      return [...range.getClientRects()].filter(r=>r.width>0).length;
    });
    if(lines !== 1) throw new Error('Login heading first line wraps differently from the live app');
  }
  const alignment=await alignVisibleText();
  await page.screenshot({ path: path.join(screens, name + '.png'), animations: 'disabled' });
  const broken = await page.evaluate(() => [...document.images].filter(i => i.offsetWidth > 0 && !i.naturalWidth).map(i => i.getAttribute('src')));
  log.push({ name, url: page.url(), broken,alignment });
  console.log('Captured', name,alignment.partialLines?JSON.stringify(alignment):'');
}
let captureSequence = 0;
async function go(route) {
  const url = new URL(base);
  url.searchParams.set('mockup', String(++captureSequence));
  url.hash = route;
  await page.goto(url.href);
  await page.addStyleTag({content:`@font-face{font-family:Pretendard;font-style:normal;font-weight:100 900;font-display:block;src:url(data:font/woff2;base64,${fontData}) format('woff2')}`});
  if(boxStyle)await page.addStyleTag({content:boxStyle});
  await page.evaluate(()=>document.fonts.load('600 20px Pretendard','\uC9D1\uC0AC\uC778\uC0DD\uC5D0 \uC624\uC2E0 \uAC83\uC744'));
  await settle();
}
async function login(enabled) {
  await page.evaluate(enabled => {
    if (enabled) {
      localStorage.setItem('jibsalife.auth.loggedIn', 'true');
      localStorage.setItem('jibsalife.auth.currentUser', 'hello@jipsa.app');
      localStorage.setItem('jibsalife.onboarding.profile.done', 'true');
    } else {
      localStorage.removeItem('jibsalife.auth.loggedIn');
      localStorage.removeItem('jibsalife.auth.currentUser');
    }
  }, enabled);
}
try {
  if (!process.argv.includes('--render-only') && !process.argv.includes('--repair') && !process.argv.includes('--update-cropped') && !process.argv.includes('--health-only')) {
    await go('/onboarding');
    await login(false);
    await go('/onboarding');
    for (const name of ['welcome', 'daily', 'community-intro', 'ai-intro']) {
      await save(name);
      if (name !== 'ai-intro') await page.getByRole('button', { name: '다음', exact: true }).click();
    }
    await go('/login'); await save('login');
    await go('/signup'); await save('signup');
    await go('/signup/terms/service'); await save('terms');
    await go('/signup/terms/privacy'); await save('privacy');
    await login(true);
    for (const [name, route] of [
      ['home', '/home'], ['health', '/health/cam'], ['health-loading', '/health/check'], ['health-result', '/health/result'],
      ['health-detail', '/health/result/detail'], ['health-hospitals', '/health/hospital'],
      ['calendar', '/mission'], ['mypage', '/mypage'], ['premium', '/mypage/subscription'],
      ['community', '/community/overview'], ['challenge', '/community/challenge'],
      ['challenge-reward', '/community/challenge/reward'], ['daily-feed', '/community/petstory/daily'],
      ['knowledge', '/community/petstory/knowledge'], ['vote', '/community/vote'],
      ['vote-detail', '/community/vote/detail'], ['vote-result', '/community/vote/result'],
      ['post', '/community/petstory/detail/2'], ['write-post', '/community/petstory/write'],
      ['ai-chat', '/health/qna'],
    ]) { await go(route); await save(name); }
    await go('/community/vote/detail');
    await page.locator('.cvd_candidate').first().click();
    await save('vote-selected');
    await page.getByRole('button',{name:'투표하기',exact:true}).click();
    await save('vote-reward');
    await go('/mission');
    await page.getByRole('button', { name:'기록 추가', exact:true }).click();
    await save('calendar-memo');
    await page.locator('.add_sheet').screenshot({path:path.join(screens,'calendar-memo-sheet.png'),animations:'disabled'});
    await go('/home');
    for (const [name, selector] of [['home-vote', '.best_pose_vote_strip'], ['home-story', '.home_content_section .content_grid']]) {
      const target = page.locator(selector).first();
      if (await target.count()) await target.scrollIntoViewIfNeeded();
      else await page.locator('main').evaluate(e => e.scrollTo(0, e.scrollHeight * (name === 'home-vote' ? .45 : .85)));
      await save(name);
    }
    await go('/health/cam');
    const upload = page.locator('input[type=file]').first();
    if (await upload.count()) {
      await upload.setInputFiles(path.resolve(root, '../jibsalife/src/img/pungpungi.png'));
      await save('health-photo');
      await go('/health/cam');
      await page.locator('.health_cam_pet_link').click();
      await save('health-pet');
      await page.locator('.add_sheet').screenshot({path:path.join(screens,'health-pet-sheet.png'),animations:'disabled'});
    }
    await go('/health/cam');
    const memo = page.getByRole('button', { name: '기록', exact: true });
    if (await memo.count()) {
      await memo.click(); await save('health-memo');
      await page.locator('.add_sheet').screenshot({path:path.join(screens,'health-memo-sheet.png'),animations:'disabled'});
    }
    await go('/health/qna');
    await page.getByRole('button', { name:'식사량', exact:true }).click();
    await settle();
    await page.getByRole('button', { name:'사료 60g', exact:true }).click();
    await save('ai-chat-record');
    await fs.writeFile(path.join(screens, 'captures.json'), JSON.stringify(log, null, 2));
  }

  if (process.argv.includes('--repair')) {
    await go('/home'); await login(true); await go('/home');
    for (const [name, selector] of [['home-vote', '.best_pose_vote_strip'], ['home-story', '.home_content_section .content_grid']]) {
      await page.locator(selector).first().scrollIntoViewIfNeeded();
      await save(name);
    }
    await go('/health/cam');
    await page.getByRole('button', {name:'기록',exact:true}).click();
    await save('health-memo');
    await go('/mission');
    await page.getByRole('button', {name:'기록 추가',exact:true}).click();
    await save('calendar-memo');
    await go('/community/petstory/detail/2'); await save('post');
    await go('/health/cam');
    await page.locator('input[type=file]').first().setInputFiles(path.resolve(root,'../jibsalife/src/img/pungpungi.png'));
    await save('health-photo');
    await go('/health/cam');
    await page.locator('.health_cam_pet_link').click();
    await save('health-pet');
    await go('/health/qna'); await save('ai-chat');
    await page.getByRole('button',{name:'식사량',exact:true}).click();
    await settle();
    console.log('Chat options:',await page.locator('main').innerText());
    const normal = page.getByRole('button',{name:'사료 60g',exact:true});
    if(await normal.count()) await normal.click();
    await settle(); await save('ai-chat-record');
    await fs.writeFile(path.join(screens,'repairs.json'),JSON.stringify(log,null,2));
  }

  if(process.argv.includes('--audit-all') || process.argv.includes('--update-cropped')) {
    await go('/onboarding');
    await login(true);
    await go('/mypage');await save('mypage');
    await page.getByRole('button',{name:'구독 관리',exact:true}).evaluate(e=>e.closest('section').scrollIntoView({block:'start'}));
    await save('mypage-lower');
    await go('/mypage/subscription');
    await save('premium-manage');
    await page.getByRole('button',{name:/전용 혜택 더 보기/}).click();
    await page.locator('.sub_manage_more_btn').evaluate(e=>e.scrollIntoView({block:'start'}));
    await save('premium-expanded');
    const benefitClip=await page.evaluate(()=>{
      const top=document.querySelector('.sub_manage_benefits_list').getBoundingClientRect().top-8;
      const bottom=document.querySelector('.sub_manage_upgrade').getBoundingClientRect().bottom+4;
      if(top<44||bottom>810)throw new Error('Premium details outside usable viewport');
      return {x:0,y:Math.floor(top),width:390,height:Math.ceil(bottom)-Math.floor(top)};
    });
    await page.screenshot({path:path.join(screens,'premium-expanded-detail.png'),clip:benefitClip});
    log.push({name:'premium-expanded-detail',clip:benefitClip,partialLines:0});
    await page.evaluate(()=>localStorage.removeItem('jibsalife.health.qna.history'));
    await go('/health/qna');await save('ai-chat');
    await page.getByRole('button',{name:'식사량',exact:true}).click();
    await settle();
    await page.locator('.chat_room_messages').evaluate(e=>e.scrollTo({top:0,behavior:'instant'}));
    await save('ai-chat-options');
    await fs.writeFile(path.join(screens,process.argv.includes('--audit-all')?'full-audit.json':'cropping-checks.json'),JSON.stringify(log,null,2));
  }

  if(process.argv.includes('--health-only')&&!process.argv.includes('--render-only')){
    await go('/onboarding');await login(true);
    await go('/health/check');
    await page.locator('.health_check_loading_intro').waitFor({state:'visible'});
    await save('health-loading');
    if(!page.url().includes('/health/check'))throw new Error('Loading capture finished too late');
    await fs.writeFile(path.join(screens,'health-loading-checks.json'),JSON.stringify(log,null,2));
  }
  await renderMockups(browser,fontData);
} finally { await browser.close(); }
