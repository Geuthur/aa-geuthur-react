// React
import { MemoryRouter, Route, Routes } from "react-router-dom";

// Third Party
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

// AA Geuthur React
import { ProjectName, withProvider } from "@/__tests__/testUtils";
import * as ApiCalls from "@/Api/calls";
import AuthBase from "@/Pages/Base";

const renderBase = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    withProvider(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[`/${ProjectName}/`]}>{ui}</MemoryRouter>
      </QueryClientProvider>,
    ),
  );
};

describe("AuthBase", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.getElementById("nav-left")?.remove();
  });

  it("should render the routed page inside the aa-react container", () => {
    // Test Data
    vi.spyOn(ApiCalls, "loadMenu").mockResolvedValue({ left_links: [], right_links: [] });

    // Test Action
    const { container } = renderBase(
      <Routes>
        <Route path={`/${ProjectName}/`} element={<AuthBase className="extra" />}>
          <Route index element={<p>Routed page</p>} />
        </Route>
      </Routes>,
    );

    // Expected Result
    const wrapper = container.querySelector(".aa-react.container");
    expect(wrapper).toHaveClass("mt-4", "extra");
    expect(wrapper).toContainElement(screen.getByText("Routed page"));
  });

  it("should keep the minimum width of the container by default and drop it on request", () => {
    // Test Data
    vi.spyOn(ApiCalls, "loadMenu").mockResolvedValue({ left_links: [], right_links: [] });
    const page = (props: { fluidOnSmallScreens?: boolean }) => (
      <Routes>
        <Route path={`/${ProjectName}/`} element={<AuthBase {...props} />}>
          <Route index element={<p>Routed page</p>} />
        </Route>
      </Routes>
    );

    // Test Action
    const { container, unmount } = renderBase(page({}));
    const byDefault = container.querySelector(".aa-react.container");
    unmount();
    const { container: fluid } = renderBase(page({ fluidOnSmallScreens: true }));

    // Expected Result
    expect(byDefault).not.toHaveClass("aa-container-fluid-small");
    expect(fluid.querySelector(".aa-react.container")).toHaveClass("aa-container-fluid-small");
  });

  it("should render the menu links into the navigation of Alliance Auth", async () => {
    // Test Data
    const navLeft = document.createElement("ul");
    navLeft.id = "nav-left";
    document.body.appendChild(navLeft);
    vi.spyOn(ApiCalls, "loadMenu").mockResolvedValue({
      left_links: [{ name: "Characters", link: "/characters/" }],
      right_links: [],
    });

    // Test Action
    renderBase(<AuthBase>Content</AuthBase>);

    // Expected Result
    const link = await screen.findByText("Characters");
    expect(navLeft).toContainElement(link);
    expect(link.getAttribute("href")).toBe(`/${ProjectName}/characters/`);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});
