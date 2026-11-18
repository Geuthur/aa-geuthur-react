// Third Party
import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// AA Geuthur React
import { LiveStatusIndicator } from "@/Components/Base/Badges";

const UPDATED_AT = Date.UTC(2026, 4, 20, 19, 10, 24);

describe("LiveStatusIndicator", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should show the error dot on error", () => {
    // Test Action
    const { container } = render(<LiveStatusIndicator isError dataUpdatedAt={UPDATED_AT} />);

    // Expected Result
    expect(container.querySelector(".aa-status-dot-error")).not.toBeNull();
    expect(container.querySelector(".aa-status-dot-busy")).toBeNull();
    expect(container.querySelector(".aa-status-dot-ready")).toBeNull();
  });

  it("should show the busy dot while loading or fetching", () => {
    // Test Action
    const { container, rerender } = render(<LiveStatusIndicator isLoading />);

    // Expected Result
    expect(container.querySelector(".aa-status-dot-busy")).not.toBeNull();

    rerender(<LiveStatusIndicator isFetching />);
    expect(container.querySelector(".aa-status-dot-busy")).not.toBeNull();
  });

  it("should prefer error over busy", () => {
    // Test Action
    const { container } = render(<LiveStatusIndicator isError isLoading />);

    // Expected Result
    expect(container.querySelector(".aa-status-dot-error")).not.toBeNull();
    expect(container.querySelector(".aa-status-dot-busy")).toBeNull();
  });

  it("should show the ready dot otherwise", () => {
    // Test Action
    const { container } = render(<LiveStatusIndicator dataUpdatedAt={UPDATED_AT} />);

    // Expected Result
    expect(container.querySelector(".aa-status-dot-ready")).not.toBeNull();
  });

  it("should ping after data arrived and stop after pingDuration", () => {
    // Test Action
    const { container } = render(<LiveStatusIndicator dataUpdatedAt={UPDATED_AT} pingDuration={1000} />);

    // Expected Result
    expect(container.querySelector(".aa-status-ping")).toBeNull();

    // Test Action
    act(() => {
      vi.advanceTimersByTime(0);
    });

    // Expected Result
    expect(container.querySelector(".aa-status-ping")).not.toBeNull();

    // Test Action
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Expected Result
    expect(container.querySelector(".aa-status-ping")).toBeNull();
  });

  it("should not ping while busy", () => {
    // Test Action
    const { container } = render(<LiveStatusIndicator isFetching dataUpdatedAt={UPDATED_AT} />);
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Expected Result
    expect(container.querySelector(".aa-status-ping")).toBeNull();
  });

  it("should not show text without showTimestamp", () => {
    // Test Action
    const { container } = render(<LiveStatusIndicator dataUpdatedAt={UPDATED_AT} />);

    // Expected Result
    expect(container.querySelector(".aa-status-text")).toBeNull();
  });

  it("should show the timestamp with the default prefix", () => {
    // Test Action
    render(<LiveStatusIndicator showTimestamp dataUpdatedAt={UPDATED_AT} />);

    // Expected Result
    expect(screen.getByText("↻ 19:10:24 EVE")).toHaveClass("aa-status-text");
  });

  it("should use a custom timestamp prefix", () => {
    // Test Action
    render(<LiveStatusIndicator showTimestamp dataUpdatedAt={UPDATED_AT} timestampPrefix="Updated" />);

    // Expected Result
    expect(screen.getByText("Updated 19:10:24 EVE")).toBeInTheDocument();
  });

  it("should show Error text with the error class", () => {
    // Test Action
    render(<LiveStatusIndicator showTimestamp isError dataUpdatedAt={UPDATED_AT} />);

    // Expected Result
    expect(screen.getByText("Error")).toHaveClass("aa-status-text", "aa-status-text-error");
  });

  it("should show Loading… while busy", () => {
    // Test Action
    render(<LiveStatusIndicator showTimestamp isLoading />);

    // Expected Result
    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });

  it("should show No fetch yet without data", () => {
    // Test Action
    render(<LiveStatusIndicator showTimestamp />);

    // Expected Result
    expect(screen.getByText("No fetch yet")).toBeInTheDocument();
  });

  it("should apply className, dotClassName and textClassName", () => {
    // Test Action
    const { container } = render(
      <LiveStatusIndicator
        showTimestamp
        dataUpdatedAt={UPDATED_AT}
        className="wrapper"
        dotClassName="dot-extra"
        textClassName="text-extra"
      />,
    );

    // Expected Result
    expect(container.firstElementChild).toHaveClass("wrapper");
    expect(container.firstElementChild).not.toHaveClass("aa-status-indicator");
    expect(container.querySelector(".aa-status-dot")).toHaveClass("dot-extra");
    expect(screen.getByText(/19:10:24 EVE/)).toHaveClass("text-extra");
  });

  it("should use the default wrapper class", () => {
    // Test Action
    const { container } = render(<LiveStatusIndicator />);

    // Expected Result
    expect(container.firstElementChild).toHaveClass("aa-status-indicator");
  });

  it("should render children beside the dot", () => {
    // Test Action
    render(
      <LiveStatusIndicator>
        <span>child</span>
      </LiveStatusIndicator>,
    );

    // Expected Result
    expect(screen.getByText("child")).toBeInTheDocument();
  });
});
