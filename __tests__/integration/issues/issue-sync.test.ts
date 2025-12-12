import assert from "node:assert/strict";
import * as path from "node:path";
import { describe, it } from "node:test";
import {
  discoverActiveChanges,
  discoverArchivedChanges,
} from "../../../src/issues/discover";
import {
  bodiesMatch,
  extractChangeId,
  formatIssueBody,
  formatIssueTitle,
} from "../../../src/issues/format";
import type { IssueSyncConfig } from "../../../src/issues/types";

const FIXTURES_PATH = path.join(__dirname, "../../fixtures/spectr-repo");

describe("Issue Sync Integration Tests", () => {
  const mockConfig: IssueSyncConfig = {
    closeOnArchive: true,
    enabled: true,
    githubToken: "test-token",
    labels: ["spectr", "change-proposal"],
    spectrLabel: "spectr-managed",
    titlePrefix: "[Spectr Change]",
    updateExisting: true,
  };

  describe("Full discovery and formatting flow", () => {
    it("should discover active changes from fixture", async () => {
      const changes = await discoverActiveChanges(FIXTURES_PATH);

      assert.equal(changes.length, 1);
      assert.equal(changes[0].id, "active-change");
      assert.equal(changes[0].isArchived, false);
    });

    it("should discover archived changes from fixture", async () => {
      const changes = await discoverArchivedChanges(FIXTURES_PATH);

      assert.equal(changes.length, 1);
      assert.equal(changes[0].id, "archived-change");
      assert.equal(changes[0].isArchived, true);
    });

    it("should read proposal content correctly", async () => {
      const changes = await discoverActiveChanges(FIXTURES_PATH);
      const change = changes[0];

      assert.ok(change.proposalContent.includes("Add User Authentication"));
      assert.ok(change.proposalContent.includes("login and logout endpoints"));
    });

    it("should read tasks content correctly", async () => {
      const changes = await discoverActiveChanges(FIXTURES_PATH);
      const change = changes[0];

      assert.ok(change.tasksContent);
      assert.ok(change.tasksContent.includes("Create user model"));
      assert.ok(change.tasksContent.includes("Add login endpoint"));
    });

    it("should find affected specs", async () => {
      const changes = await discoverActiveChanges(FIXTURES_PATH);
      const change = changes[0];

      assert.deepEqual(change.affectedSpecs, ["auth"]);
    });

    it("should format issue title correctly", async () => {
      const changes = await discoverActiveChanges(FIXTURES_PATH);
      const change = changes[0];

      const title = formatIssueTitle(change.id, mockConfig);
      assert.equal(title, "[Spectr Change] active-change");
    });

    it("should format issue body with all sections", async () => {
      const changes = await discoverActiveChanges(FIXTURES_PATH);
      const change = changes[0];

      const body = formatIssueBody(change);

      // Should have marker
      assert.ok(body.includes("<!-- spectr-change-id:active-change -->"));

      // Should have proposal section
      assert.ok(body.includes("## Proposal"));
      assert.ok(body.includes("Add User Authentication"));

      // Should have affected specs
      assert.ok(body.includes("## Affected Specs"));
      assert.ok(body.includes("`auth`"));

      // Should have tasks
      assert.ok(body.includes("## Tasks"));
      assert.ok(body.includes("Create user model"));

      // Should have footer
      assert.ok(body.includes("managed by"));
    });

    it("should allow extracting change ID from formatted body", async () => {
      const changes = await discoverActiveChanges(FIXTURES_PATH);
      const change = changes[0];

      const body = formatIssueBody(change);
      const extractedId = extractChangeId(body);

      assert.equal(extractedId, "active-change");
    });

    it("should correctly compare bodies for update detection", async () => {
      const changes = await discoverActiveChanges(FIXTURES_PATH);
      const change = changes[0];

      const body1 = formatIssueBody(change);
      const body2 = formatIssueBody(change);

      // Same content should match
      assert.ok(bodiesMatch(body1, body2));

      // Different content should not match
      const modifiedBody = body1.replace("Authentication", "Authorization");
      assert.ok(!bodiesMatch(body1, modifiedBody));
    });
  });

  describe("Edge cases", () => {
    it("should handle archived changes without tasks", async () => {
      const changes = await discoverArchivedChanges(FIXTURES_PATH);
      const change = changes[0];

      // Archived change doesn't have tasks.md
      assert.equal(change.tasksContent, undefined);

      // Should still format body without tasks section
      const body = formatIssueBody(change);
      assert.ok(!body.includes("## Tasks"));
    });

    it("should handle changes without affected specs", async () => {
      const changes = await discoverArchivedChanges(FIXTURES_PATH);
      const change = changes[0];

      // Archived change doesn't have specs directory
      assert.deepEqual(change.affectedSpecs, []);

      // Should format body without affected specs section
      const body = formatIssueBody(change);
      assert.ok(!body.includes("## Affected Specs"));
    });
  });

  describe("End-to-end sync simulation", () => {
    it("should prepare correct data for creating a new issue", async () => {
      const changes = await discoverActiveChanges(FIXTURES_PATH);
      const change = changes[0];

      const title = formatIssueTitle(change.id, mockConfig);
      const body = formatIssueBody(change);
      const labels = [...mockConfig.labels, mockConfig.spectrLabel];

      // Verify all data is ready for API call
      assert.equal(title, "[Spectr Change] active-change");
      assert.ok(body.length > 0);
      assert.ok(body.length <= 65536); // GitHub limit
      assert.deepEqual(labels, ["spectr", "change-proposal", "spectr-managed"]);
    });

    it("should prepare correct data for closing an archived issue", async () => {
      const archivedChanges = await discoverArchivedChanges(FIXTURES_PATH);
      const archivedChange = archivedChanges[0];

      // Simulate existing issue for this change
      const existingIssue = {
        body: "<!-- spectr-change-id:archived-change -->\n...",
        changeId: "archived-change",
        number: 42,
        state: "open" as const,
        title: "[Spectr Change] archived-change",
      };

      // Verify we can identify the issue to close
      const changeId = extractChangeId(existingIssue.body);
      assert.equal(changeId, archivedChange.id);
      assert.equal(archivedChange.isArchived, true);
    });
  });
});
