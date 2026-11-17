import { describe, expect, it } from "vitest";
import { isEmailOnList, parseEmailList } from "@/server/emailList";

const allowedEmails = " First@Example.invalid ,second@example.invalid,, ";

describe("parseEmailList", () => {
  it("trims, lower-cases and drops empty entries", () => {
    expect(parseEmailList(allowedEmails)).toEqual(["first@example.invalid", "second@example.invalid"]);
  });

  it("treats a missing list as empty", () => {
    expect(parseEmailList(undefined)).toEqual([]);
  });
});

describe("isEmailOnList", () => {
  it("allows a verified email on the list, whatever its letter case or spacing", () => {
    const user = { email: " FIRST@example.invalid ", emailVerified: true };
    expect(isEmailOnList(user, allowedEmails)).toBe(true);
  });

  it("refuses a verified email that is not on the list", () => {
    const user = { email: "stranger@example.invalid", emailVerified: true };
    expect(isEmailOnList(user, allowedEmails)).toBe(false);
  });

  it("refuses an email on the list that Google has not verified", () => {
    const user = { email: "first@example.invalid", emailVerified: false };
    expect(isEmailOnList(user, allowedEmails)).toBe(false);
  });

  it("refuses when nobody is signed in or the email is missing", () => {
    expect(isEmailOnList(null, allowedEmails)).toBe(false);
    expect(isEmailOnList({ email: "", emailVerified: true }, allowedEmails)).toBe(false);
  });

  it("refuses everyone when the list is empty or not set", () => {
    const user = { email: "first@example.invalid", emailVerified: true };
    expect(isEmailOnList(user, "")).toBe(false);
    expect(isEmailOnList(user, undefined)).toBe(false);
  });

  it("does not match part of an email", () => {
    const user = { email: "first@example.invalid.evil.invalid", emailVerified: true };
    expect(isEmailOnList(user, allowedEmails)).toBe(false);
  });
});
