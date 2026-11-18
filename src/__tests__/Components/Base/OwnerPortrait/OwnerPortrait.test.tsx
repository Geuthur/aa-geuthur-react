// Third Party
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

// AA Geuthur React
import { OwnerPortrait } from "@/Components/Base/OwnerPortrait";

describe("OwnerPortrait", () => {
  it("should render the image when a src is given", () => {
    // Test Action
    render(<OwnerPortrait src="/portrait.png" alt="Alice" />);

    // Expected Result
    const img = screen.getByRole("img", { name: "Alice" });
    expect(img.tagName).toBe("IMG");
    expect(img).toHaveAttribute("src", "/portrait.png");
    expect(img).toHaveAttribute("loading", "lazy");
  });

  it("should render the type icon with aria-label when src is missing", () => {
    // Test Action
    render(<OwnerPortrait alt="Alice" type="corporation" />);

    // Expected Result
    const icon = screen.getByRole("img", { name: "Alice" });
    expect(icon.tagName).toBe("DIV");
    expect(icon.querySelector("svg")).not.toBeNull();
  });

  it("should hide the icon from assistive tech without alt", () => {
    // Test Action
    const { container } = render(<OwnerPortrait type="alliance" />);

    // Expected Result
    const icon = container.firstElementChild as HTMLElement;
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon).not.toHaveAttribute("aria-label");
  });

  it("should use different icons per type and fall back to the character icon", () => {
    // Test Action
    const { container: corp } = render(<OwnerPortrait type="corporation" />);
    const { container: ally } = render(<OwnerPortrait type="alliance" />);
    const { container: unknown } = render(<OwnerPortrait type="whatever" />);
    const { container: char } = render(<OwnerPortrait />);

    // Expected Result
    const html = (c: HTMLElement) => c.querySelector("svg")?.innerHTML;
    expect(html(corp)).not.toBe(html(ally));
    expect(html(corp)).not.toBe(html(char));
    expect(html(ally)).not.toBe(html(char));
    expect(html(unknown)).toBe(html(char));
  });

  it("should default to size lg and apply sm and md", () => {
    // Test Action
    const { container, rerender } = render(<OwnerPortrait src="/a.png" />);

    // Expected Result
    expect(container.firstElementChild).toHaveClass("aa-owner-portrait-lg");

    rerender(<OwnerPortrait src="/a.png" size="sm" />);
    expect(container.firstElementChild).toHaveClass("aa-owner-portrait-sm");

    rerender(<OwnerPortrait src="/a.png" size="md" />);
    expect(container.firstElementChild).toHaveClass("aa-owner-portrait-md");
  });

  it("should use the matching icon size", () => {
    // Test Action
    const { container, rerender } = render(<OwnerPortrait size="sm" />);

    // Expected Result
    expect(container.querySelector("svg")).toHaveAttribute("width", "16");
    rerender(<OwnerPortrait size="md" />);
    expect(container.querySelector("svg")).toHaveAttribute("width", "20");
    rerender(<OwnerPortrait size="lg" />);
    expect(container.querySelector("svg")).toHaveAttribute("width", "24");
  });

  it("should be a circle by default and rounded for shape rounded", () => {
    // Test Action
    const { container, rerender } = render(<OwnerPortrait src="/a.png" />);

    // Expected Result
    expect(container.firstElementChild).toHaveClass("rounded-circle");

    rerender(<OwnerPortrait src="/a.png" shape="rounded" />);
    expect(container.firstElementChild).toHaveClass("rounded");
    expect(container.firstElementChild).not.toHaveClass("rounded-circle");
  });

  it("should add a border only when bordered", () => {
    // Test Action
    const { container, rerender } = render(<OwnerPortrait src="/a.png" />);

    // Expected Result
    expect(container.firstElementChild).not.toHaveClass("border");

    rerender(<OwnerPortrait src="/a.png" bordered />);
    expect(container.firstElementChild).toHaveClass("border", "border-2", "border-secondary");
  });

  it("should append a custom className on image and icon", () => {
    // Test Action
    const { container, rerender } = render(<OwnerPortrait src="/a.png" className="custom" />);

    // Expected Result
    expect(container.firstElementChild).toHaveClass("custom");

    rerender(<OwnerPortrait className="custom" />);
    expect(container.firstElementChild).toHaveClass("custom");
  });
});
