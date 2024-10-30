const { BeforeAll, AfterAll, Before, After } = require('@cucumber/cucumber');
const { chromium } = require('playwright');
const { expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Used to get branch and commit
const exec = require('child_process').exec;

/**
 * [this will run before all the tests scripts starts executing]
 */

BeforeAll(async function () {

    console.log('Launching browser...');
    browser = await chromium.launch({

        headless: false,
        timeout: timeout

    });
    const context = await browser.newContext();
    console.log('Opening new page...');
    page = await context.newPage()

});


Before(async function (scenario) {
    // Print feature names while tests are running
    if (featureName != scenario.gherkinDocument.feature.name) {
        featureName = scenario.gherkinDocument.feature.name
        console.log(`\n ${featureName}`);
    }
});

AfterAll(async function () {

    if (typeof page !== 'undefined') {
        await page.close();
    }

    if (typeof context !== 'undefined') {
        await context.close();
    }
    if (typeof browser !== 'undefined') {
        await browser.close();
    }

});

// After each scenario exceuted, it will attach the screenshots
After(async function (scenario) {

    let screenshot;

    if (typeof page !== 'undefined') {
        screenshot = await page.screenshot({ path: `./reports/screenshots/${scenario.pickle.name}.png`, timeout: moderateTimeout });
    } else {
        console.log('No instance of page was defined');
    }

    await this.attach(screenshot, 'image/png');

    let date = new Date().toISOString().replace("T", " ");
    timestamp = date.substr(0, date.lastIndexOf("."));

    await this.attach(`${timestamp} on branch ${branch} with commit ${commit}`);

    //Run below to capture failed scenarios

    // if (scenario.result.status === 'failed') {
    // const img = await page.screenshot({ path: `./reports/screenshots/${scenario.pickle.name}.png`, timeout: moderateTimeout });
    // await this.attach(img, 'image/png')
    // }

});