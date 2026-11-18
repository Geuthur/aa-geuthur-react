// Third Party
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

// AA Geuthur React
import { BaseOwnerCard } from "@/Components/Base/OwnerSettings/BaseOwnerCard";
import type { BaseOwner } from "@/Components/Base/OwnerSettings/types";

const makeOwner = (overrides: Partial<BaseOwner> = {}): BaseOwner => ({
  id: 1,
  name: "Alice",
  owner_type: "character",
  status: "ok",
  ...overrides,
});

describe("BaseOwnerCard", () => {
  it.each([
    ["ok", "OK", "aa-owner-status-ok"],
    ["error", "Error", "aa-owner-status-error"],
    ["token_error", "Token Error", "aa-owner-status-token-error"],
    ["disabled", "Disabled", "aa-owner-status-disabled"],
    ["something-else", "Incomplete", "aa-owner-status-incomplete"],
    ["", "Incomplete", "aa-owner-status-incomplete"],
  ])("should show the status %s as %s", (status, label, cls) => {
    // Test Action
    const { container } = render(<BaseOwnerCard owner={makeOwner({ status })} />);

    // Expected Result
    const badge = container.querySelector(".aa-owner-status-badge");
    expect(badge).toHaveClass(cls);
    expect(badge).toHaveTextContent(label);
  });

  it("should treat the status case-insensitively", () => {
    // Test Action
    const { container } = render(<BaseOwnerCard owner={makeOwner({ status: "OK" })} />);

    // Expected Result
    expect(container.querySelector(".aa-owner-status-badge")).toHaveClass("aa-owner-status-ok");
  });

  it("should set the card class only for error and token error", () => {
    // Test Action
    const { container, rerender } = render(<BaseOwnerCard owner={makeOwner({ status: "error" })} />);

    // Expected Result
    expect(container.querySelector("article")).toHaveClass("aa-owner-card-error");

    rerender(<BaseOwnerCard owner={makeOwner({ status: "token_error" })} />);
    expect(container.querySelector("article")).toHaveClass("aa-owner-card-token-error");
    expect(container.querySelector("article")).not.toHaveClass("aa-owner-card-error");

    rerender(<BaseOwnerCard owner={makeOwner({ status: "ok" })} />);
    expect(container.querySelector("article")).not.toHaveClass("aa-owner-card-error");
    expect(container.querySelector("article")).not.toHaveClass("aa-owner-card-token-error");
  });

  it("should show the pulsing dot only for error states", () => {
    // Test Action
    const { container, rerender } = render(<BaseOwnerCard owner={makeOwner({ status: "error" })} />);

    // Expected Result
    expect(container.querySelector(".aa-pending-dot-ping")).not.toBeNull();

    rerender(<BaseOwnerCard owner={makeOwner({ status: "token_error" })} />);
    expect(container.querySelector(".aa-danger-dot-ping")).not.toBeNull();

    rerender(<BaseOwnerCard owner={makeOwner({ status: "ok" })} />);
    expect(container.querySelector(".aa-pending-dot-container")).toBeNull();
  });

  it("should show name, subtitle and portrait", () => {
    // Test Action
    render(<BaseOwnerCard owner={makeOwner({ subtitle: "Some Corp", avatar_url: "/a.png" })} />);

    // Expected Result
    expect(screen.getByRole("heading", { name: "Alice" })).toBeInTheDocument();
    expect(screen.getByText("Some Corp")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Alice" })).toHaveAttribute("src", "/a.png");
  });

  it.each([
    ["character", "Character", "bg-info"],
    ["corporation", "Corporation", "bg-primary"],
    ["alliance", "Alliance", "bg-success"],
  ])("should show the type badge for %s", (type, label, cls) => {
    // Test Action
    render(<BaseOwnerCard owner={makeOwner({ owner_type: type })} />);

    // Expected Result
    expect(screen.getByText(label).closest(".badge")).toHaveClass(cls);
  });

  it("should default to the character badge without an owner type", () => {
    // Test Action
    render(<BaseOwnerCard owner={makeOwner({ owner_type: undefined })} />);

    // Expected Result
    expect(screen.getByText("Character")).toBeInTheDocument();
  });

  it("should render sections with the matching dot class and label", () => {
    // Test Data
    const owner = makeOwner({
      sections: [
        { section: "a", section_name: "Alpha", is_success: true },
        { section: "b", section_name: "Beta", is_success: false },
        { section: "c", section_name: "Gamma", is_success: null },
        { section: "d", section_name: "Delta", has_token_error: true },
      ],
    });

    // Test Action
    const { container } = render(<BaseOwnerCard owner={owner} />);

    // Expected Result
    const dots = container.querySelectorAll(".aa-owner-section-dot");
    expect(dots[0]).toHaveClass("aa-owner-dot-ok");
    expect(dots[1]).toHaveClass("aa-owner-dot-warning");
    expect(dots[2]).toHaveClass("aa-owner-dot-muted");
    expect(dots[3]).toHaveClass("aa-owner-dot-error");
    const items = container.querySelectorAll(".aa-owner-section-item");
    expect(items[0]).toHaveTextContent("OK");
    expect(items[1]).toHaveTextContent("Failed");
    expect(items[2]).toHaveTextContent("Pending");
    expect(items[3]).toHaveTextContent("Token Error");
  });

  it("should let has_token_error win over is_success", () => {
    // Test Data
    const owner = makeOwner({
      sections: [{ section: "a", section_name: "Alpha", is_success: true, has_token_error: true }],
    });

    // Test Action
    const { container } = render(<BaseOwnerCard owner={owner} />);

    // Expected Result
    expect(container.querySelector(".aa-owner-section-dot")).toHaveClass("aa-owner-dot-error");
    expect(container.querySelector(".aa-owner-section-item")).toHaveTextContent("Token Error");
  });

  it("should not render the sections block without sections", () => {
    // Test Action
    const { container } = render(<BaseOwnerCard owner={makeOwner({ sections: [] })} />);

    // Expected Result
    expect(container.querySelector(".aa-owner-sections")).toBeNull();
  });

  it("should show the error message as alert", () => {
    // Test Action
    render(<BaseOwnerCard owner={makeOwner({ error_message: "Boom" })} />);

    // Expected Result
    expect(screen.getByRole("alert")).toHaveTextContent("Boom");
  });

  it("should not show an alert without error message", () => {
    // Test Action
    render(<BaseOwnerCard owner={makeOwner()} />);

    // Expected Result
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("should shorten last_sync and show the full value as title", () => {
    // Test Action
    const { container } = render(<BaseOwnerCard owner={makeOwner({ last_sync: "2026-05-20 10:11" })} />);

    // Expected Result
    expect(screen.getByText("05-20 10:11")).toBeInTheDocument();
    expect(container.querySelector(".aa-owner-last-sync")).toHaveAttribute(
      "title",
      "Last sync: 2026-05-20 10:11",
    );
  });

  it("should show Never without last_sync", () => {
    // Test Action
    const { container } = render(<BaseOwnerCard owner={makeOwner({ last_sync: null })} />);

    // Expected Result
    expect(screen.getByText("Never")).toBeInTheDocument();
    expect(container.querySelector(".aa-owner-last-sync")).not.toHaveAttribute("title");
  });

  it("should call onTriggerUpdate with the owner id", async () => {
    // Test Data
    const user = userEvent.setup();
    const onTriggerUpdate = vi.fn();
    render(<BaseOwnerCard owner={makeOwner({ id: 7 })} onTriggerUpdate={onTriggerUpdate} />);

    // Test Action
    await user.click(screen.getByRole("button", { name: "Update Owner" }));

    // Expected Result
    expect(onTriggerUpdate).toHaveBeenCalledWith(7);
  });

  it("should disable the update button while updating", () => {
    // Test Action
    render(<BaseOwnerCard owner={makeOwner()} onTriggerUpdate={vi.fn()} isUpdating />);

    // Expected Result
    expect(screen.getByRole("button", { name: "Update Owner" })).toBeDisabled();
  });

  it("should disable the update button during cooldown and show the seconds", () => {
    // Test Action
    render(<BaseOwnerCard owner={makeOwner()} onTriggerUpdate={vi.fn()} cooldown={12} />);

    // Expected Result
    const button = screen.getByRole("button", { name: "Update Owner" });
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent("12s");
  });

  it("should enable the update button without cooldown", () => {
    // Test Action
    render(<BaseOwnerCard owner={makeOwner()} onTriggerUpdate={vi.fn()} />);

    // Expected Result
    const button = screen.getByRole("button", { name: "Update Owner" });
    expect(button).toBeEnabled();
    expect(button).toHaveTextContent("Update");
  });

  it("should call onDeleteClick with the owner", async () => {
    // Test Data
    const user = userEvent.setup();
    const onDeleteClick = vi.fn();
    const owner = makeOwner();
    render(<BaseOwnerCard owner={owner} onDeleteClick={onDeleteClick} />);

    // Test Action
    await user.click(screen.getByRole("button", { name: "Delete Owner" }));

    // Expected Result
    expect(onDeleteClick).toHaveBeenCalledWith(owner);
  });

  it("should render no buttons without handlers", () => {
    // Test Action
    render(<BaseOwnerCard owner={makeOwner()} />);

    // Expected Result
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("should only render the buttons whose handler is given", () => {
    // Test Action
    render(<BaseOwnerCard owner={makeOwner()} onDeleteClick={vi.fn()} />);

    // Expected Result
    expect(screen.queryByRole("button", { name: "Update Owner" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete Owner" })).toBeInTheDocument();
  });

  it("should render the custom content and action slots with the owner", () => {
    // Test Data
    const renderCustomContent = vi.fn((o: BaseOwner) => <div>custom-{o.name}</div>);
    const renderActions = vi.fn((o: BaseOwner) => <button type="button">action-{o.name}</button>);
    const owner = makeOwner();

    // Test Action
    render(<BaseOwnerCard owner={owner} renderCustomContent={renderCustomContent} renderActions={renderActions} />);

    // Expected Result
    expect(screen.getByText("custom-Alice")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "action-Alice" })).toBeInTheDocument();
    expect(renderCustomContent).toHaveBeenCalledWith(owner);
    expect(renderActions).toHaveBeenCalledWith(owner);
  });
});
