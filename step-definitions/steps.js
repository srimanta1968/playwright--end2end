const { Given, When, Then, And } = require("@cucumber/cucumber");
const { chromium } = require("playwright");
// import { test, expect } from "@playwright/test";
const { expect } = require("@playwright/test");
const fs = require("fs");
const path = require("path");
const { Base } = require("../models/Base");

Given("I open the testing page", { timeout: 20000 }, async function () {
  await page.goto("https://qa-practice.netlify.app/");
  await page.waitForLoadState();
});

Then("I nagivate to the ecommerce login page", async function () {
  await tRansaction.navigateFromMenu();
});

When("I login with user credentials", async function () {
  await tRansaction.login();
});

Then("the shopping cart page is visible", async function () {
  await expect(page.getByText("SHOPPING CART")).toBeVisible();
});

When("I add {string} to the shopping cart", async function (iphoneType) {
  await expect(page.getByText(iphoneType)).toBeVisible();
  await page.getByRole("button", { name: "ADD TO CART" }).nth(4).click();
});

Then("I proceed to checkout", async function () {
  await tRansaction.proceedToCheckout();
});

Then("the shipping details form is visible", async function () {
  await expect(page.locator("#shipping-address")).toBeVisible();
});

When(
  "I fill out the shipping form in {string} {string}",
  async function (detailFormName, dataInput) {
    await tRansaction.shippingDetails(detailFormName, dataInput);
  }
);

When("I select {string} in the country box", async function (countryName) {
  await tRansaction.dropDownSelection(countryName);
});

Then("I click the {string} button", async function (submitButton) {
  await page.getByRole("button", { name: submitButton }).click();
});

Then("I receive a successful order placed message", async function () {
  await expect(page.locator("#message")).toBeVisible();
});

And("I made this step to fail", async function () {
  await expect(2).toBeGreaterThan(3); // This assertion will fail
});
