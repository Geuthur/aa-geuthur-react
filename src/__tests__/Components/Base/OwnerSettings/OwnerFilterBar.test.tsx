// React
import type { ComponentProps } from "react";

// Third Party
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

// AA Geuthur React
import { OwnerFilterBar, type OwnerTypeFilter } from "@/Components/Base/OwnerSettings/OwnerFilterBar";

const counts: Record<OwnerTypeFilter, number> = { all: 6, character: 3, corporation: 2, alliance: 0 };

const renderBar = (props: Partial<ComponentProps<typeof OwnerFilterBar>> = {}) =>
  render(
    <OwnerFilterBar
      search=""
      onSearchChange={vi.fn()}
      typeFilter="all"
      onTypeChange={vi.fn()}
      counts={counts}
      {...props}
    />,
  );

describe("OwnerFilterBar", () => {
  it("should show All and only types with a count above zero", () => {
    // Test Action
    renderBar();

    // Expected Result
    expect(screen.getByRole("button", { name: /All/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Characters/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Corporations/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Alliances/ })).not.toBeInTheDocument();
  });

  it("should keep the active type visible even with a count of zero", () => {
    // Test Action
    renderBar({ typeFilter: "alliance" });

    // Expected Result
    expect(screen.getByRole("button", { name: /Alliances/ })).toHaveAttribute("aria-pressed", "true");
  });

  it("should show the counts", () => {
    // Test Action
    renderBar();

    // Expected Result
    expect(screen.getByRole("button", { name: /All/ })).toHaveTextContent("6");
    expect(screen.getByRole("button", { name: /Characters/ })).toHaveTextContent("3");
  });

  it("should call onTypeChange with the clicked type", async () => {
    // Test Data
    const user = userEvent.setup();
    const onTypeChange = vi.fn();
    renderBar({ onTypeChange });

    // Test Action
    await user.click(screen.getByRole("button", { name: /Corporations/ }));

    // Expected Result
    expect(onTypeChange).toHaveBeenCalledWith("corporation");
  });

  it("should call onSearchChange when typing", async () => {
    // Test Data
    const user = userEvent.setup();
    const onSearchChange = vi.fn();
    renderBar({ onSearchChange });

    // Test Action
    await user.type(screen.getByRole("searchbox", { name: "Search owners" }), "a");

    // Expected Result
    expect(onSearchChange).toHaveBeenCalledWith("a");
  });

  it("should show the search value", () => {
    // Test Action
    renderBar({ search: "alice" });

    // Expected Result
    expect(screen.getByRole("searchbox")).toHaveValue("alice");
  });

  it("should use the default and a custom search placeholder", () => {
    // Test Action
    const { unmount } = renderBar();

    // Expected Result
    expect(screen.getByPlaceholderText("Search owners…")).toBeInTheDocument();
    unmount();

    renderBar({ searchPlaceholder: "Find someone" });
    expect(screen.getByPlaceholderText("Find someone")).toBeInTheDocument();
  });
});
