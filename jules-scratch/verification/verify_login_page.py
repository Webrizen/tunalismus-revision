import re
from playwright.sync_api import sync_playwright, Page, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        page.goto("http://localhost:3000/login")
        expect(page).to_have_title(re.compile(".*")) # Just check for any title
        page.screenshot(path="jules-scratch/verification/login_page.png")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
