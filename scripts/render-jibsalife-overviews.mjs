import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { deviceCSS } from './render-jibsalife-mockups.mjs';
const require=createRequire(import.meta.url);
const sharp=require('../.local-work/mockup-tools/node_modules/sharp');
const {chromium}=require('../.local-work/mockup-tools/node_modules/playwright');
const root=path.resolve(import.meta.dirname,'..');
const work=path.join(root,'.local-work/mockup-tools');
const originals=path.join(work,'overview-originals');
const coverOnly=process.argv.includes('--cover-only');
await fs.mkdir(originals,{recursive:true});
for(const [name,source] of [['ui-design','sections/ui-design.png'],['cover','figma-cover.png']]){
  try{await fs.access(path.join(originals,name+'.png'));}
  catch{await fs.copyFile(path.resolve(root,'../랜딩페이지/jibsalife/public',source),path.join(originals,name+'.png'));}
}
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try{
  const page=await browser.newPage({viewport:{width:428,height:882},deviceScaleFactor:3});
  const cache=new Map();
  async function device(name){
    if(cache.has(name))return cache.get(name);
    const data=await fs.readFile(path.join(root,'src/assets/project-01-screens',name+'.png'));
    await page.setContent(`<style>${deviceCSS}</style><div class="device"><img src="data:image/png;base64,${data.toString('base64')}"><div class="notch"></div></div>`);
    await page.locator('img').evaluate(i=>i.decode());
    const image=await page.screenshot({omitBackground:true});cache.set(name,image);return image;
  }
  const density=2;
  async function layer(name,x,y,w){
    const scale=w/408;
    let image=sharp(await device(name)).resize(Math.round(428*scale*density),Math.round(882*scale*density));
    let left=Math.round((x-10*scale)*density),top=Math.round((y-10*scale)*density);
    const data=await image.toBuffer(),meta=await sharp(data).metadata();
    const clip={left:Math.max(0,-left),top:Math.max(0,-top),width:Math.min(meta.width-Math.max(0,-left),3840-Math.max(0,left)),height:Math.min(meta.height-Math.max(0,-top),2160-Math.max(0,top))};
    return {input:await sharp(data).extract(clip).toBuffer(),left:Math.max(0,left),top:Math.max(0,top)};
  }
  const uiPhones=[['home',486,490,306],['mypage',826,-70,306],['community',826,610,306],['health-result',1200,65,306],['ai-chat-options',1200,706,306],['vote-result',1546,-65,306],['welcome',1546,610,306]];
  const uiLayers=[];
  if(!coverOnly)for(const p of uiPhones)uiLayers.push(await layer(...p));
  const coverSource=path.join(originals,'cover.png');
  const bg=await sharp(coverSource).extract({left:1140,top:220,width:1,height:1}).raw().toBuffer();
  const coverMask={left:1140,top:215,width:400,height:735};
  const coverLayers=[{input:await sharp({create:{width:coverMask.width*2,height:coverMask.height*2,channels:3,background:{r:bg[0],g:bg[1],b:bg[2]}}}).png().toBuffer(),left:coverMask.left*2,top:coverMask.top*2}];
  // A subtle device shadow is confined to the old phone/shadow area.
  const shadow=Buffer.from(`<svg width="800" height="1470"><defs><filter id="s" x="-40%" y="-20%" width="180%" height="150%"><feGaussianBlur stdDeviation="18"/></filter></defs><rect x="90" y="80" width="620" height="1310" rx="80" fill="#000" opacity=".28" filter="url(#s)"/></svg>`);
  coverLayers.push({input:shadow,left:2280,top:430});
  coverLayers.push(await layer('home',1185,249,310));
  const checks=[];
  for(const [name,layers] of coverOnly?[['cover',coverLayers]]:[['ui-design',uiLayers],['cover',coverLayers]]){
    const source=path.join(originals,name+'.png');
    const target=path.join(root,'src/assets/project-01-'+name+'.png');
    // Figma exports carry RGB artwork even in transparent pixels. Preserve
    // those original background/text colors before resizing/compositing.
    const opaqueSource=await sharp(source).removeAlpha().png().toBuffer();
    const before=await sharp(opaqueSource).resize(3840,2160,{kernel:'nearest'}).raw().toBuffer();
    await sharp(opaqueSource).resize(3840,2160,{kernel:'nearest'}).composite(layers).png().toFile(target);
    const after=await sharp(target).removeAlpha().raw().toBuffer();
    const regions=[];
    for(const l of layers){const m=await sharp(l.input).metadata();regions.push({x:l.left,y:l.top,w:m.width,h:m.height});}
    let changed=0;
    for(let y=0;y<2160;y++)for(let x=0;x<3840;x++){
      const i=(y*3840+x)*3;
      if(before[i]===after[i]&&before[i+1]===after[i+1]&&before[i+2]===after[i+2])continue;
      changed++;
      if(!regions.some(r=>x>=r.x&&x<r.x+r.w&&y>=r.y&&y<r.y+r.h))throw Error(name+': background outside mockups changed');
    }
    checks.push({name,width:3840,height:2160,backgroundOutsideMockupsPreserved:true,changedPixels:changed,screens:name==='cover'?['home']:uiPhones.map(p=>p[0])});
    console.log('Updated mockups; preserved background:',name);
  }
  const checksPath=path.join(root,'src/assets/project-01-screens/overview-checks.json');
  const previousChecks=coverOnly?JSON.parse(await fs.readFile(checksPath,'utf8').catch(()=> '[]')).filter(check=>check.name!=='cover'):[];
  await fs.writeFile(checksPath,JSON.stringify([...previousChecks,...checks],null,2));
}finally{await browser.close();}
