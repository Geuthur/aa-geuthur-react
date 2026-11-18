// Third Party
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

// AA Geuthur React
import { MissingOwnerCard } from "@/Components/Base/OwnerSettings/MissingOwnerCard";
import type { BaseMissingOwner } from "@/Components/Base/OwnerSettings/types";

const missing: BaseMissingOwner = { id: 5, name: "Bob", owner_type: "character", subtitle: "Alt of Alice" };

describe("MissingOwnerCard", () => {
  it("should show name, subtitle, badge and explanation with the app name", () => {
    // Test Action
    render(<MissingOwnerCard missing={missing} appName="Ledger" />);

    // Expected Result
    expect(screen.getByRole("heading", { name: "Bob" })).toBeInTheDocument();
    expect(screen.getByText("Alt of Alice")).toBeInTheDocument();
    expect(screen.getByText("Not Registered")).toBeInTheDocument();
    expect(screen.getByText("Bob is not registered in Ledger.")).toBeInTheDocument();
  });

  it("should default the app name to Alliance Auth", () => {
    // Test Action
    render(<MissingOwnerCard missing={missing} />);

    // Expected Result
    expect(screen.getByText("Bob is not registered in Alliance Auth.")).toBeInTheDocument();
  });

  it("should show no button without actionUrl", () => {
    // Test Action
    render(<MissingOwnerCard missing={missing} />);

    // Expected Result
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("should show a link with the default label interpolating the app", () => {
    // Test Action
    render(<MissingOwnerCard missing={missing} appName="Ledger" actionUrl="/add/" />);

    // Expected Result
    const link = screen.getByRole("button", { name: "Add to Ledger" });
    expect(link).toHaveAttribute("href", "/add/");
  });

  it("should use a custom actionLabel", () => {
    // Test Action
    render(<MissingOwnerCard missing={missing} actionUrl="/add/" actionLabel="Register now" />);

    // Expected Result
    expect(screen.getByRole("button", { name: "Register now" })).toHaveAttribute("href", "/add/");
  });

  it("should show the portrait with a rounded shape for corporations", () => {
    // Test Action
    render(
      <MissingOwnerCard
        missing={{ id: 1, name: "Corp", owner_type: "corporation", avatar_url: "/c.png" }}
      />,
    );

    // Expected Result
    const img = screen.getByRole("img", { name: "Corp" });
    expect(img).toHaveAttribute("src", "/c.png");
    expect(img).toHaveClass("rounded");
    expect(img).not.toHaveClass("rounded-circle");
  });
});
