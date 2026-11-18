// Third Party
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

// AA Geuthur React
import type { BaseMissingOwner } from "@/Components/Base/OwnerSettings/types";
import { UnregisteredModal } from "@/Components/Base/OwnerSettings/UnregisteredModal";

const items: BaseMissingOwner[] = [
  { id: 1, name: "Alice", owner_type: "character", subtitle: "Pilot", avatar_url: "/a.png" },
  { id: 2, name: "Bob Corp", owner_type: "corporation", subtitle: "Miners" },
  { id: 3, name: "Carol", owner_type: "character" },
];

describe("UnregisteredModal", () => {
  it("should not render anything when hidden", () => {
    // Test Action
    render(<UnregisteredModal show={false} onHide={vi.fn()} title="Unregistered" items={items} />);

    // Expected Result
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should show title, description, items and the counter", () => {
    // Test Action
    render(
      <UnregisteredModal show onHide={vi.fn()} title="Unregistered" description="Not yet added" items={items} />,
    );

    // Expected Result
    expect(screen.getByText("Unregistered")).toBeInTheDocument();
    expect(screen.getByText("Not yet added")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Pilot")).toBeInTheDocument();
    expect(screen.getByText("Bob Corp")).toBeInTheDocument();
    expect(screen.getByText("3 unregistered")).toBeInTheDocument();
  });

  it("should show a portrait only for items with an avatar", () => {
    // Test Action
    render(<UnregisteredModal show onHide={vi.fn()} title="Unregistered" items={items} />);

    // Expected Result
    expect(screen.getByRole("img", { name: "Alice" })).toHaveClass("aa-owner-portrait-sm");
    expect(screen.queryByRole("img", { name: "Carol" })).not.toBeInTheDocument();
  });

  it("should show the loading state without items list", () => {
    // Test Action
    render(<UnregisteredModal show onHide={vi.fn()} title="Unregistered" items={items} isLoading />);

    // Expected Result
    expect(screen.getByText("Loading…")).toBeInTheDocument();
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
  });

  it("should show the default and a custom error message", () => {
    // Test Action
    const { unmount } = render(<UnregisteredModal show onHide={vi.fn()} title="Unregistered" isError />);

    // Expected Result
    expect(screen.getByRole("alert")).toHaveTextContent("Failed to load data.");
    unmount();

    render(<UnregisteredModal show onHide={vi.fn()} title="Unregistered" isError errorMessage="Broken" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Broken");
  });

  it("should show the default and a custom empty message without search", () => {
    // Test Action
    const { unmount } = render(<UnregisteredModal show onHide={vi.fn()} title="Unregistered" items={[]} />);

    // Expected Result
    expect(screen.getByText("Nothing to show.")).toBeInTheDocument();
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
    unmount();

    render(<UnregisteredModal show onHide={vi.fn()} title="Unregistered" emptyMessage="All registered" />);
    expect(screen.getByText("All registered")).toBeInTheDocument();
  });

  it("should filter by name and subtitle and update the counter", async () => {
    // Test Data
    const user = userEvent.setup();
    render(<UnregisteredModal show onHide={vi.fn()} title="Unregistered" items={items} />);

    // Test Action
    await user.type(screen.getByRole("searchbox", { name: "Search owners" }), "alice");

    // Expected Result
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.queryByText("Bob Corp")).not.toBeInTheDocument();
    expect(screen.getByText("1 unregistered")).toBeInTheDocument();

    // Test Action
    await user.clear(screen.getByRole("searchbox"));
    await user.type(screen.getByRole("searchbox"), "miners");

    // Expected Result
    expect(screen.getByText("Bob Corp")).toBeInTheDocument();
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
  });

  it("should show the default no match message", async () => {
    // Test Data
    const user = userEvent.setup();
    render(<UnregisteredModal show onHide={vi.fn()} title="Unregistered" items={items} />);

    // Test Action
    await user.type(screen.getByRole("searchbox"), "zzz");

    // Expected Result
    expect(screen.getByText("No matching owners found.")).toBeInTheDocument();
    expect(screen.getByText("0 unregistered")).toBeInTheDocument();
  });

  it("should show a custom no match message", async () => {
    // Test Data
    const user = userEvent.setup();
    render(
      <UnregisteredModal show onHide={vi.fn()} title="Unregistered" items={items} noMatchMessage="Nobody here" />,
    );

    // Test Action
    await user.type(screen.getByRole("searchbox"), "zzz");

    // Expected Result
    expect(screen.getByText("Nobody here")).toBeInTheDocument();
  });

  it("should use a custom search placeholder and label", () => {
    // Test Action
    render(
      <UnregisteredModal
        show
        onHide={vi.fn()}
        title="Unregistered"
        items={items}
        searchPlaceholder="Find member"
        searchLabel="Member search"
      />,
    );

    // Expected Result
    const input = screen.getByRole("searchbox", { name: "Member search" });
    expect(input).toHaveAttribute("placeholder", "Find member");
  });

  it("should call onHide when closing", async () => {
    // Test Data
    const user = userEvent.setup();
    const onHide = vi.fn();
    render(<UnregisteredModal show onHide={onHide} title="Unregistered" items={items} />);
    const dialog = screen.getByRole("dialog");

    // Test Action
    await user.click(within(dialog).getAllByRole("button", { name: "Close" })[0]);

    // Expected Result
    expect(onHide).toHaveBeenCalledTimes(1);
  });
});
