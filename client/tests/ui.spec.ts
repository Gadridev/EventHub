import { test, expect } from "@playwright/test";

test("all screens render without runtime errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const [route, title] of [
    ["/", "Overview"],
    ["/events", "Events"],
    ["/events/e1", "React Workshop"],
    ["/participants", "Participants"],
    ["/registrations", "Registrations"],
    ["/login", "Sign in"],
  ]) {
    await page.goto(route);
    await expect(
      page.getByRole("heading", { name: title, exact: true }),
    ).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: `artifacts/${route === "/" ? "dashboard" : route.slice(1).replaceAll("/", "-")}.png`,
      fullPage: true,
    });
  }
  expect(errors).toEqual([]);
});

test("event search and modal are presentation only and keyboard accessible", async ({
  page,
}) => {
  await page.goto("/events");
  await page
    .getByRole("textbox", { name: "Search events or city" })
    .fill("Rabat");
  await expect(
    page.getByRole("link", { name: "Node.js Conference" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "React Workshop" })).toHaveCount(
    0,
  );
  await page.getByRole("textbox", { name: "Search events or city" }).fill("");
  await page.getByRole("button", { name: "New event", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByLabel("Title", { exact: true }).fill("Unpersisted event");
  await expect(
    dialog.getByRole("button", { name: "Create draft" }),
  ).toBeDisabled();
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    expect(
      await page.evaluate(() =>
        document.querySelector("dialog")?.contains(document.activeElement),
      ),
    ).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "New event", exact: true }),
  ).toBeFocused();
  await expect(page.getByRole("row")).toHaveCount(6);
  await page
    .getByRole("button", { name: "Cancel event", exact: true })
    .first()
    .click();
  await expect(
    page
      .getByRole("dialog")
      .getByRole("button", { name: "Cancel event", exact: true }),
  ).toBeDisabled();
});

test("registration filters and display states do not mutate data", async ({
  page,
}) => {
  await page.goto("/registrations");
  await page.getByRole("button", { name: /^pending$/i }).click();
  await expect(page.getByRole("row")).toHaveCount(5);
  await page.getByLabel("Filter registrations by event").selectOption("e1");
  await expect(page.getByRole("row")).toHaveCount(2);
  await page.getByRole("button", { name: "Confirm", exact: true }).click();
  await expect(
    page
      .getByRole("dialog")
      .getByRole("button", { name: "Confirm registration" }),
  ).toBeDisabled();
  await page.keyboard.press("Escape");
  await page.getByText("Preview display states", { exact: true }).click();
  await page.getByLabel("Display state").selectOption("error");
  await expect(page.getByRole("alert")).toContainText("Unable to load");
  await page.getByLabel("Display state").selectOption("empty");
  await expect(page.getByRole("status")).toContainText("No registrations");
  await page.getByLabel("Display state").selectOption("ready");
  await expect(page.getByRole("row")).toHaveCount(2);
});

test("login never authenticates and password visibility toggles", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByLabel("Email", { exact: true }).fill("test@example.com");
  await page.getByLabel("Password", { exact: true }).fill("preview-password");
  await page.getByRole("button", { name: "Show password" }).click();
  await expect(page.getByLabel("Password", { exact: true })).toHaveAttribute(
    "type",
    "text",
  );
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("not connected");
  await expect(page).toHaveURL(/\/login$/);
  expect(
    await page.evaluate(() => ({
      local: localStorage.length,
      session: sessionStorage.length,
    })),
  ).toEqual({ local: 0, session: 0 });
});

test("mobile screens do not overflow and navigation closes after selection", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of [
    "/",
    "/events",
    "/events/e1",
    "/participants",
    "/registrations",
    "/login",
  ]) {
    await page.goto(route);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `artifacts/mobile-${route === "/" ? "dashboard" : route.slice(1).replaceAll("/", "-")}.png`,
      fullPage: true,
    });
  }
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("dialog")
    .getByRole("link", { name: "Participants", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Participants", exact: true }),
  ).toBeVisible();
});
