import puppeteer from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(stealthPlugin());

export default puppeteer;
