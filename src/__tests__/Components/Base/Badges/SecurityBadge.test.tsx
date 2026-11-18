// Third Party
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

// AA Geuthur React
import { SecurityBadge } from "@/Components/Base/Badges";

describe("SecurityBadge", () => {
  it.each([
    [1.0, "aa-badge-hisec", "1.0"],
    [0.5, "aa-badge-hisec", "0.5"],
    [0.4, "aa-badge-lowsec", "0.4"],
    [0.1, "aa-badge-lowsec", "0.1"],
    [0.0, "aa-badge-nullsec", "0.0"],
    [-0.7, "aa-badge-nullsec", "-0.7"],
  ])("should render sec %s with class %s and text %s", (sec, cls, text) => {
    // Test Action
    render(<SecurityBadge sec={sec} />);

    // Expected Result
    const badge = screen.getByText(text);
    expect(badge).toHaveClass("sec-badge", cls);
  });

  it("should round to one decimal", () => {
    // Test Action
    render(<SecurityBadge sec={0.87} />);

    // Expected Result
    expect(screen.getByText("0.9")).toBeInTheDocument();
  });

  it("should append a custom className", () => {
    // Test Action
    render(<SecurityBadge sec={0.9} className="ms-2" />);

    // Expected Result
    expect(screen.getByText("0.9")).toHaveClass("sec-badge", "aa-badge-hisec", "ms-2");
  });
});
