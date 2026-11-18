// Third Party
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// AA Geuthur React
import { formatLastFetch, useLivePing } from "@/Components/Base/Badges/liveStatusHelper";

describe("formatLastFetch", () => {
  it("should return an empty string without a value", () => {
    // Test Action / Expected Result
    expect(formatLastFetch()).toBe("");
    expect(formatLastFetch(0)).toBe("");
  });

  it("should format the timestamp as EVE time", () => {
    // Test Data
    const ts = Date.UTC(2026, 4, 20, 19, 10, 24);

    // Test Action / Expected Result
    expect(formatLastFetch(ts)).toBe("19:10:24 EVE");
  });
});

describe("useLivePing", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should start without a ping", () => {
    // Test Action
    const { result } = renderHook(() => useLivePing(1000, false, 2000));

    // Expected Result
    expect(result.current).toBe(false);
  });

  it("should ping after 0 ms and stop after the duration", () => {
    // Test Action
    const { result } = renderHook(() => useLivePing(1000, false, 2000));
    act(() => {
      vi.advanceTimersByTime(0);
    });

    // Expected Result
    expect(result.current).toBe(true);

    // Test Action
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // Expected Result
    expect(result.current).toBe(false);
  });

  it("should use the default duration of 2000 ms", () => {
    // Test Action
    const { result } = renderHook(() => useLivePing(1000));
    act(() => {
      vi.advanceTimersByTime(1999);
    });

    // Expected Result
    expect(result.current).toBe(true);

    // Test Action
    act(() => {
      vi.advanceTimersByTime(1);
    });

    // Expected Result
    expect(result.current).toBe(false);
  });

  it("should not ping while busy", () => {
    // Test Action
    const { result } = renderHook(() => useLivePing(1000, true, 2000));
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // Expected Result
    expect(result.current).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("should ping again when dataUpdatedAt changes", () => {
    // Test Data
    const { result, rerender } = renderHook(({ at }) => useLivePing(at, false, 2000), {
      initialProps: { at: 1000 },
    });
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current).toBe(false);

    // Test Action
    rerender({ at: 2000 });
    act(() => {
      vi.advanceTimersByTime(0);
    });

    // Expected Result
    expect(result.current).toBe(true);
  });

  it("should clear both timers on unmount", () => {
    // Test Data
    const { unmount } = renderHook(() => useLivePing(1000, false, 2000));
    expect(vi.getTimerCount()).toBe(2);

    // Test Action
    unmount();

    // Expected Result
    expect(vi.getTimerCount()).toBe(0);
  });
});
