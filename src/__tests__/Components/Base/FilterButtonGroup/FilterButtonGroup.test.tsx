// Third Party
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

// AA Geuthur React
import { FilterButtonGroup } from "@/Components/Base/FilterButtonGroup";

const options = [
  { value: "all", label: "All", count: 5 },
  { value: "open", label: "Open", count: 0, icon: <i data-testid="open-icon" /> },
  { value: "done", label: "Done" },
];

describe("FilterButtonGroup", () => {
  it("should mark the active option as primary and the others as secondary", () => {
    // Test Action
    render(<FilterButtonGroup options={options} value="open" onChange={vi.fn()} ariaLabel="Filter" />);

    // Expected Result
    expect(screen.getByRole("group", { name: "Filter" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Open/ })).toHaveClass("btn-primary");
    expect(screen.getByRole("button", { name: /Open/ })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /All/ })).toHaveClass("btn-secondary");
    expect(screen.getByRole("button", { name: /All/ })).toHaveAttribute("aria-pressed", "false");
  });

  it("should show counters, including zero, and the icon", () => {
    // Test Action
    render(<FilterButtonGroup options={options} value="all" onChange={vi.fn()} ariaLabel="Filter" />);

    // Expected Result
    expect(screen.getByText("5")).toHaveClass("badge");
    expect(screen.getByText("0")).toHaveClass("badge");
    expect(screen.getByTestId("open-icon")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Done" }).querySelector(".badge")).toBeNull();
  });

  it("should call onChange with the value of the clicked option", async () => {
    // Test Data
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FilterButtonGroup options={options} value="all" onChange={onChange} ariaLabel="Filter" />);

    // Test Action
    await user.click(screen.getByRole("button", { name: "Done" }));

    // Expected Result
    expect(onChange).toHaveBeenCalledWith("done");
  });
});
