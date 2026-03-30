const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Listen for console messages
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('CONSOLE ERROR:', msg.text());
    }
  });

  // Listen for page errors
  page.on('pageerror', err => {
    console.log('PAGE ERROR:', err.message);
  });

  // Navigate to page
  console.log('Opening page...');
  await page.goto('https://biointeractiva.vercel.app', { waitUntil: 'networkidle' });
  
  // Wait for Clerk to load
  await page.waitForTimeout(3000);
  
  // Check if buttons exist
  const loginBtn = await page.$('button.btn-primary');
  const registerBtn = await page.$('button.btn-secondary');
  
  console.log('Login button found:', !!loginBtn);
  console.log('Register button found:', !!registerBtn);
  
  // Click the login button
  if (loginBtn) {
    console.log('Clicking login button...');
    await loginBtn.click();
    
    // Wait to see what happens
    await page.waitForTimeout(5000);
    
    console.log('Current URL:', page.url());
    console.log('Page title:', await page.title());
    
    // Check if modal opened
    const bodyContent = await page.evaluate(() => document.body.innerHTML.substring(0, 500));
    console.log('Body content preview:', bodyContent);
  }
  
  await browser.close();
})();
