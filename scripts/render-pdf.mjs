import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

await mkdir("resume",{recursive:true});
const browser=await chromium.launch({headless:true});
try{
  const jobs=[
    ["resume/en/index.html","resume/christian-rafael-cv-en.pdf"],
    ["resume/pt/index.html","resume/christian-rafael-cv-pt.pdf"]
  ];
  for(const [htmlPath,pdfPath] of jobs){
    const page=await browser.newPage();
    await page.goto(pathToFileURL(resolve(htmlPath)).href,{waitUntil:"load"});
    await page.emulateMedia({media:"print"});
    await page.pdf({path:pdfPath,format:"A4",printBackground:true,preferCSSPageSize:true,margin:{top:"0",right:"0",bottom:"0",left:"0"}});
    await page.close();
  }
}finally{
  await browser.close();
}
