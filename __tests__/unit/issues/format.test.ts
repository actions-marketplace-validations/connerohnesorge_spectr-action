import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  bodiesMatch,
  extractChangeId,
  formatIssueBody,
  formatIssueTitle,
} from "../../../src/issues/format";
import type {
  ChangeProposal,
  IssueSyncConfig,
} from "../../../src/issues/types";

describe("format.ts", () => {
  const mockConfig: IssueSyncConfig = {
    closeOnArchive: true,
    enabled: true,
    githubToken: "test-token",
    labels: ["spectr", "change-proposal"],
    spectrLabel: "spectr-managed",
    titlePrefix: "[Spectr Change]",
    updateExisting: true,
  };

  describe("formatIssueTitle", () => {
    it("should format title with prefix and change ID", () => {
      const title = formatIssueTitle("add-feature", mockConfig);
      assert.equal(title, "[Spectr Change] add-feature");
    });

    it("should use custom prefix from config", () => {
      const customConfig = { ...mockConfig, titlePrefix: "[RFC]" };
      const title = formatIssueTitle("new-api", customConfig);
      assert.equal(title, "[RFC] new-api");
    });
  });

  describe("formatIssueBody", () => {
    it("should include hidden marker at the start", () => {
      const proposal: ChangeProposal = {
        affectedSpecs: [],
        id: "test-change",
        isArchived: false,
        path: "/path/to/change",
        proposalContent: "Test proposal content",
        tasksContent: undefined,
      };

      const body = formatIssueBody(proposal);
      assert.ok(body.startsWith("<!-- spectr-change-id:test-change -->"));
    });

    it("should include proposal content", () => {
      const proposal: ChangeProposal = {
        affectedSpecs: [],
        id: "test",
        isArchived: false,
        path: "/path",
        proposalContent: "# My Proposal\n\nThis is the proposal content.",
        tasksContent: undefined,
      };

      const body = formatIssueBody(proposal);
      assert.ok(body.includes("## Proposal"));
      assert.ok(body.includes("This is the proposal content."));
    });

    it("should include affected specs when present", () => {
      const proposal: ChangeProposal = {
        affectedSpecs: ["auth", "api"],
        id: "test",
        isArchived: false,
        path: "/path",
        proposalContent: "Content",
        tasksContent: undefined,
      };

      const body = formatIssueBody(proposal);
      assert.ok(body.includes("## Affected Specs"));
      assert.ok(body.includes("`auth`"));
      assert.ok(body.includes("`api`"));
    });

    it("should not include affected specs section when empty", () => {
      const proposal: ChangeProposal = {
        affectedSpecs: [],
        id: "test",
        isArchived: false,
        path: "/path",
        proposalContent: "Content",
        tasksContent: undefined,
      };

      const body = formatIssueBody(proposal);
      assert.ok(!body.includes("## Affected Specs"));
    });

    it("should include tasks when present", () => {
      const proposal: ChangeProposal = {
        affectedSpecs: [],
        id: "test",
        isArchived: false,
        path: "/path",
        proposalContent: "Content",
        tasksContent: "- [ ] Task 1\n- [x] Task 2",
      };

      const body = formatIssueBody(proposal);
      assert.ok(body.includes("## Tasks"));
      assert.ok(body.includes("Task 1"));
      assert.ok(body.includes("Task 2"));
    });

    it("should include Spectr footer", () => {
      const proposal: ChangeProposal = {
        affectedSpecs: [],
        id: "test",
        isArchived: false,
        path: "/path",
        proposalContent: "Content",
        tasksContent: undefined,
      };

      const body = formatIssueBody(proposal);
      assert.ok(body.includes("managed by"));
      assert.ok(body.includes("Spectr"));
    });

    it("should truncate very long bodies", () => {
      const longContent = "A".repeat(70000);
      const proposal: ChangeProposal = {
        affectedSpecs: [],
        id: "test",
        isArchived: false,
        path: "/path",
        proposalContent: longContent,
        tasksContent: undefined,
      };

      const body = formatIssueBody(proposal);
      assert.ok(body.length <= 65536);
      assert.ok(body.includes("truncated"));
    });
  });

  describe("extractChangeId", () => {
    it("should extract change ID from formatted body", () => {
      const proposal: ChangeProposal = {
        affectedSpecs: [],
        id: "my-change-123",
        isArchived: false,
        path: "/path",
        proposalContent: "Content",
        tasksContent: undefined,
      };

      const body = formatIssueBody(proposal);
      const extracted = extractChangeId(body);
      assert.equal(extracted, "my-change-123");
    });

    it("should return null for body without marker", () => {
      const body = "Some random issue body without marker";
      const extracted = extractChangeId(body);
      assert.equal(extracted, null);
    });
  });

  describe("bodiesMatch", () => {
    it("should return true for identical bodies", () => {
      const body = "Some content\nwith multiple lines";
      assert.ok(bodiesMatch(body, body));
    });

    it("should return true when only whitespace differs", () => {
      const body1 = "Content with trailing space   ";
      const body2 = "Content with trailing space";
      assert.ok(bodiesMatch(body1, body2));
    });

    it("should return true when CRLF vs LF differs", () => {
      const body1 = "Line1\r\nLine2";
      const body2 = "Line1\nLine2";
      assert.ok(bodiesMatch(body1, body2));
    });

    it("should return false for different content", () => {
      const body1 = "Content A";
      const body2 = "Content B";
      assert.ok(!bodiesMatch(body1, body2));
    });
  });
});
