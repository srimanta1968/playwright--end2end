const { Given, When, Then } = require('@cucumber/cucumber');
const { chromium } = require('playwright');
// import { test, expect } from "@playwright/test";
const { expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

Given('I open the testing page', async function () {
    console.log('inside');
    await page.goto('https://qa-practice.netlify.app/');
    await page.waitForLoadState();

});

// When('I login with username {string} and password {string}', function (userName, userPassword) {

// });

// Then('the default landing page is visible', function () {


// });

