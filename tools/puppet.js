import puppeteer from 'puppeteer';
import {port} from './get_port.js';

const timeout = async (test, ms) => {
  let result; //, done;
  try {
    // setTimeout(() => {
    //   if (!done) {
    //     throw ('test launcher timeout');
    //   }
    // }, ms);
    result = await test();
  } catch(x) {
    result = false;
    console.error('Page load error');
    console.error(x);
  }
  //done = true;
  return result;
};

const testUrl = async (browser, url) => {
  const page = await browser.newPage();
  console.log(':: opening localhost test page', url);
  await page.goto(url, {waitUntil: 'networkidle2'});
  console.log(':: testing...');
  const result = await page.evaluate(() => {
    const {runTests, specs} = globalThis.strings;
    return runTests(specs);
  });
  //page.close();
  console.log(':: complete.', result);
  return result;
};

const test = async browser => {
  const url = `http://localhost:${port}/public/tests/puppet.html`;
  return timeout(() => testUrl(browser, url), 10e3);
};

const start = async () => {
  console.log(':: launching puppeteer');
  const browser = await puppeteer.launch({headless: false});
  //
  const passed = await test(browser);
  //
  console.log('\n', passed ? '\t\x1B[0;32mPASS' : '\t\x1B[0;31mFAIL', '\x1B[0m\n');
  globalThis.process.exitCode = passed ? 0 : 1;
  console.log(':: done');
  //await browser.close();
};

start();
