// Third Party
import { render, renderHook, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

// AA Geuthur React
import { AaReactProvider, useAaReact } from "@/Provider";

describe("AaReactProvider", () => {
  it("should provide the app names to useAaReact", () => {
    // Test Data
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AaReactProvider projectName="ledger" appName="aa-ledger">
        {children}
      </AaReactProvider>
    );

    // Test Action
    const { result } = renderHook(() => useAaReact(), { wrapper });

    // Expected Result
    expect(result.current).toEqual({ projectName: "ledger", appName: "aa-ledger" });
  });

  it("should render its children", () => {
    // Test Action
    render(
      <AaReactProvider projectName="ledger" appName="aa-ledger">
        <p>Page</p>
      </AaReactProvider>,
    );

    // Expected Result
    expect(screen.getByText("Page")).toBeInTheDocument();
  });

  it("should throw outside of the provider", () => {
    // Test Action & Expected Result
    expect(() => renderHook(() => useAaReact())).toThrow("useAaReact must be used inside <AaReactProvider");
  });
});
