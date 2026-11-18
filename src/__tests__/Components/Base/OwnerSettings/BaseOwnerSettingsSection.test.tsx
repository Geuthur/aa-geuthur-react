// Third Party
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

// AA Geuthur React
import { BaseOwnerSettingsSection } from "@/Components/Base/OwnerSettings/BaseOwnerSettingsSection";
import type { BaseMissingOwner, BaseOwner } from "@/Components/Base/OwnerSettings/types";

const owners: BaseOwner[] = [
  { id: 1, name: "Alice", owner_type: "character", subtitle: "Pilot", status: "ok" },
  { id: 2, name: "Bob Corp", owner_type: "corporation", subtitle: "Miners", status: "ok" },
  { id: 3, name: "Carol", owner_type: "character", status: "error" },
];

const missing: BaseMissingOwner[] = [{ id: 10, name: "Dave", owner_type: "character", subtitle: "Alt" }];

describe("BaseOwnerSettingsSection", () => {
  it("should show default title, description and count", () => {
    // Test Action
    render(<BaseOwnerSettingsSection owners={owners} />);

    // Expected Result
    expect(screen.getByRole("heading", { name: "Owner Status" })).toBeInTheDocument();
    expect(screen.getByText("ESI synchronization status of your linked owners.")).toBeInTheDocument();
    expect(screen.getByText("(3)")).toBeInTheDocument();
  });

  it("should show custom title, description and icon", () => {
    // Test Action
    render(
      <BaseOwnerSettingsSection
        owners={owners}
        title="My Owners"
        description="Custom text"
        icon={<i data-testid="custom-icon" />}
      />,
    );

    // Expected Result
    expect(screen.getByRole("heading", { name: "My Owners" })).toBeInTheDocument();
    expect(screen.getByText("Custom text")).toBeInTheDocument();
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("should apply className and bodyClassName", () => {
    // Test Action
    const { container } = render(
      <BaseOwnerSettingsSection owners={owners} className="extra" bodyClassName="body-extra" />,
    );

    // Expected Result
    expect(container.querySelector(".card")).toHaveClass("extra");
    expect(container.querySelector(".card-body")).toHaveClass("body-extra");
    expect(container.querySelector(".card-body")).not.toHaveClass("bg-dark");
  });

  it("should use the default body class", () => {
    // Test Action
    const { container } = render(<BaseOwnerSettingsSection owners={owners} />);

    // Expected Result
    expect(container.querySelector(".card-body")).toHaveClass("bg-dark", "text-light");
  });

  it("should pass cardClassName to every owner card but not to missing cards", () => {
    // Test Action
    const { container } = render(
      <BaseOwnerSettingsSection owners={owners} missingOwners={missing} cardClassName="bg-dark" />,
    );

    // Expected Result
    expect(container.querySelectorAll("article.aa-owner-card")).toHaveLength(4);
    expect(container.querySelectorAll("article.bg-dark")).toHaveLength(3);
    expect(container.querySelector("article.aa-owner-card-missing")).not.toHaveClass("bg-dark");
  });

  it("should render a card per owner", () => {
    // Test Action
    render(<BaseOwnerSettingsSection owners={owners} />);

    // Expected Result
    expect(screen.getByRole("heading", { name: "Alice" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Bob Corp" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Carol" })).toBeInTheDocument();
  });

  it("should not show the filter bar by default", () => {
    // Test Action
    render(<BaseOwnerSettingsSection owners={owners} />);

    // Expected Result
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
  });

  it("should show the filter bar with enableFilters", () => {
    // Test Action
    render(<BaseOwnerSettingsSection owners={owners} enableFilters searchPlaceholder="Find" />);

    // Expected Result
    expect(screen.getByRole("searchbox")).toHaveAttribute("placeholder", "Find");
  });

  it("should filter by name and subtitle and show the counter", async () => {
    // Test Data
    const user = userEvent.setup();
    render(<BaseOwnerSettingsSection owners={owners} enableFilters />);

    // Test Action
    await user.type(screen.getByRole("searchbox"), "alice");

    // Expected Result
    expect(screen.getByRole("heading", { name: "Alice" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Bob Corp" })).not.toBeInTheDocument();
    expect(screen.getByText("(1 / 3)")).toBeInTheDocument();

    // Test Action
    await user.clear(screen.getByRole("searchbox"));
    await user.type(screen.getByRole("searchbox"), "miners");

    // Expected Result
    expect(screen.getByRole("heading", { name: "Bob Corp" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Alice" })).not.toBeInTheDocument();
  });

  it("should filter by type", async () => {
    // Test Data
    const user = userEvent.setup();
    render(<BaseOwnerSettingsSection owners={owners} enableFilters />);

    // Test Action
    await user.click(screen.getByRole("button", { name: /Corporations/ }));

    // Expected Result
    expect(screen.getByRole("heading", { name: "Bob Corp" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Alice" })).not.toBeInTheDocument();
    expect(screen.getByText("(1 / 3)")).toBeInTheDocument();
  });

  it("should show no match message and reset the filters", async () => {
    // Test Data
    const user = userEvent.setup();
    render(<BaseOwnerSettingsSection owners={owners} enableFilters />);
    await user.type(screen.getByRole("searchbox"), "zzz");

    // Expected Result
    expect(screen.getByText("No matching owners found.")).toBeInTheDocument();

    // Test Action
    await user.click(screen.getByRole("button", { name: "Reset filters" }));

    // Expected Result
    expect(screen.queryByText("No matching owners found.")).not.toBeInTheDocument();
    expect(screen.getByRole("searchbox")).toHaveValue("");
    expect(screen.getByText("(3)")).toBeInTheDocument();
  });

  it("should show the loading state without cards", () => {
    // Test Action
    render(<BaseOwnerSettingsSection owners={owners} isLoading />);

    // Expected Result
    expect(screen.getByText("Loading update statuses…")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Alice" })).not.toBeInTheDocument();
  });

  it("should show the default and a custom error message", () => {
    // Test Action
    const { unmount } = render(<BaseOwnerSettingsSection isError />);

    // Expected Result
    expect(screen.getByRole("alert")).toHaveTextContent("Failed to load update status.");
    unmount();

    render(<BaseOwnerSettingsSection isError errorMessage="Nope" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Nope");
  });

  it("should show the default and a custom empty message", () => {
    // Test Action
    const { unmount } = render(<BaseOwnerSettingsSection owners={[]} />);

    // Expected Result
    expect(screen.getByText("Nothing to show.")).toBeInTheDocument();
    unmount();

    render(<BaseOwnerSettingsSection owners={[]} emptyMessage="No owners yet" />);
    expect(screen.getByText("No owners yet")).toBeInTheDocument();
  });

  it("should show Update All only with onUpdateAll and owners", async () => {
    // Test Data
    const user = userEvent.setup();
    const onUpdateAll = vi.fn();
    const { rerender } = render(<BaseOwnerSettingsSection owners={owners} />);
    expect(screen.queryByRole("button", { name: /Update All/ })).not.toBeInTheDocument();

    rerender(<BaseOwnerSettingsSection owners={[]} onUpdateAll={onUpdateAll} />);
    expect(screen.queryByRole("button", { name: /Update All/ })).not.toBeInTheDocument();

    rerender(<BaseOwnerSettingsSection owners={owners} onUpdateAll={onUpdateAll} />);

    // Test Action
    await user.click(screen.getByRole("button", { name: "Update All" }));

    // Expected Result
    expect(onUpdateAll).toHaveBeenCalledTimes(1);
  });

  it("should show the cooldown text and disable Update All during cooldown or update", () => {
    // Test Action
    const { rerender } = render(<BaseOwnerSettingsSection owners={owners} onUpdateAll={vi.fn()} globalCooldown={30} />);

    // Expected Result
    expect(screen.getByRole("button", { name: "Update All (30s)" })).toBeDisabled();

    rerender(<BaseOwnerSettingsSection owners={owners} onUpdateAll={vi.fn()} isUpdatingAll />);
    expect(screen.getByRole("button", { name: "Update All" })).toBeDisabled();
  });

  it("should show the feedback message and close it", async () => {
    // Test Data
    const user = userEvent.setup();
    const onDismissFeedback = vi.fn();
    render(
      <BaseOwnerSettingsSection
        owners={owners}
        feedbackMessage={{ variant: "success", text: "Saved" }}
        onDismissFeedback={onDismissFeedback}
      />,
    );

    // Expected Result
    expect(screen.getByText("Saved").closest(".alert")).toHaveClass("alert-success");

    // Test Action
    await user.click(screen.getByRole("button", { name: /close/i }));

    // Expected Result
    expect(onDismissFeedback).toHaveBeenCalledTimes(1);
  });

  it("should not make the feedback dismissible without a handler", () => {
    // Test Action
    render(
      <BaseOwnerSettingsSection owners={owners} feedbackMessage={{ variant: "danger", text: "Failed" }} />,
    );

    // Expected Result
    expect(screen.getByText("Failed").closest(".alert")).toHaveClass("alert-danger");
    expect(screen.queryByRole("button", { name: /close/i })).not.toBeInTheDocument();
  });

  it("should trigger the single update with the owner id, ownerCooldowns and updatingOwnerId", async () => {
    // Test Data
    const user = userEvent.setup();
    const onTriggerSingleUpdate = vi.fn();
    render(
      <BaseOwnerSettingsSection
        owners={owners}
        onTriggerSingleUpdate={onTriggerSingleUpdate}
        ownerCooldowns={{ 2: 9 }}
        updatingOwnerId={3}
      />,
    );
    const buttons = screen.getAllByRole("button", { name: "Update Owner" });

    // Expected Result
    expect(buttons[0]).toBeEnabled();
    expect(buttons[1]).toBeDisabled();
    expect(buttons[1]).toHaveTextContent("9s");
    expect(buttons[2]).toBeDisabled();

    // Test Action
    await user.click(buttons[0]);

    // Expected Result
    expect(onTriggerSingleUpdate).toHaveBeenCalledWith(1);
  });

  it("should hide update and delete buttons per owner with isUpdatable and isDeletable", () => {
    // Test Action
    render(
      <BaseOwnerSettingsSection
        owners={owners}
        onTriggerSingleUpdate={vi.fn()}
        onDeleteOwner={vi.fn()}
        isUpdatable={(o) => o.id !== 1}
        isDeletable={(o) => o.id === 1}
      />,
    );

    // Expected Result
    expect(screen.getAllByRole("button", { name: "Update Owner" })).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: "Delete Owner" })).toHaveLength(1);
  });

  it("should not show delete buttons without onDeleteOwner", () => {
    // Test Action
    render(<BaseOwnerSettingsSection owners={owners} onTriggerSingleUpdate={vi.fn()} />);

    // Expected Result
    expect(screen.queryByRole("button", { name: "Delete Owner" })).not.toBeInTheDocument();
  });

  it("should confirm the deletion in a modal and call onDeleteOwner", async () => {
    // Test Data
    const user = userEvent.setup();
    const onDeleteOwner = vi.fn().mockResolvedValue(undefined);
    render(<BaseOwnerSettingsSection owners={owners} onDeleteOwner={onDeleteOwner} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    // Test Action
    await user.click(screen.getAllByRole("button", { name: "Delete Owner" })[0]);

    // Expected Result
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText("Are you sure you want to delete owner 'Alice'?")).toBeInTheDocument();
    expect(within(dialog).getByText("This action cannot be undone.")).toBeInTheDocument();
    expect(onDeleteOwner).not.toHaveBeenCalled();

    // Test Action
    await user.click(within(dialog).getByRole("button", { name: "Confirm Delete" }));

    // Expected Result
    expect(onDeleteOwner).toHaveBeenCalledWith(owners[0]);
    await vi.waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("should close the delete modal on Cancel without deleting", async () => {
    // Test Data
    const user = userEvent.setup();
    const onDeleteOwner = vi.fn();
    render(<BaseOwnerSettingsSection owners={owners} onDeleteOwner={onDeleteOwner} />);
    await user.click(screen.getAllByRole("button", { name: "Delete Owner" })[1]);
    const dialog = await screen.findByRole("dialog");

    // Test Action
    await user.click(within(dialog).getByRole("button", { name: "Cancel" }));

    // Expected Result
    expect(onDeleteOwner).not.toHaveBeenCalled();
    await vi.waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("should disable the modal buttons while deleting", async () => {
    // Test Data
    const user = userEvent.setup();
    render(<BaseOwnerSettingsSection owners={owners} onDeleteOwner={vi.fn()} isDeleting />);

    // Test Action
    await user.click(screen.getAllByRole("button", { name: "Delete Owner" })[0]);

    // Expected Result
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByRole("button", { name: "Deleting…" })).toBeDisabled();
    expect(within(dialog).getByRole("button", { name: "Cancel" })).toBeDisabled();
  });

  it("should use a custom delete title, description and body class", async () => {
    // Test Data
    const user = userEvent.setup();
    render(
      <BaseOwnerSettingsSection
        owners={owners}
        onDeleteOwner={vi.fn()}
        deleteModalTitle="Remove it"
        deleteModalDescription={(o) => <span>All data of {o.name} is lost</span>}
        deleteModalBodyClassName="aa-panel"
      />,
    );

    // Test Action
    await user.click(screen.getAllByRole("button", { name: "Delete Owner" })[0]);

    // Expected Result
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText("Remove it")).toBeInTheDocument();
    expect(within(dialog).getByText("All data of Alice is lost")).toBeInTheDocument();
    expect(within(dialog).queryByText("This action cannot be undone.")).not.toBeInTheDocument();
    expect(dialog.querySelector(".modal-body")).toHaveClass("aa-panel");
  });

  it("should render the custom card slots for every owner", () => {
    // Test Action
    render(
      <BaseOwnerSettingsSection
        owners={owners}
        renderCustomCardContent={(o) => <div>content-{o.id}</div>}
        renderCardActions={(o) => <button type="button">act-{o.id}</button>}
      />,
    );

    // Expected Result
    expect(screen.getByText("content-1")).toBeInTheDocument();
    expect(screen.getByText("content-3")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "act-2" })).toBeInTheDocument();
  });

  it("should show the missing section with the default title and description", () => {
    // Test Action
    render(<BaseOwnerSettingsSection owners={owners} missingOwners={missing} appName="Ledger" />);

    // Expected Result
    expect(screen.getByRole("heading", { name: "Missing in Ledger" })).toBeInTheDocument();
    expect(screen.getByText("The following characters belong to you but are not registered.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Dave" })).toBeInTheDocument();
    expect(screen.getByText("Dave is not registered in Ledger.")).toBeInTheDocument();
  });

  it("should use a custom missing title, description and action", () => {
    // Test Action
    render(
      <BaseOwnerSettingsSection
        owners={owners}
        missingOwners={missing}
        missingSectionTitle="Unregistered"
        missingSectionDescription="Please add them"
        missingActionUrl="/add/"
        missingActionLabel="Add now"
      />,
    );

    // Expected Result
    expect(screen.getByRole("heading", { name: "Unregistered" })).toBeInTheDocument();
    expect(screen.getByText("Please add them")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add now" })).toHaveAttribute("href", "/add/");
  });

  it("should not show the missing section without missing owners", () => {
    // Test Action
    render(<BaseOwnerSettingsSection owners={owners} missingOwners={[]} />);

    // Expected Result
    expect(screen.queryByText(/Missing in/)).not.toBeInTheDocument();
  });

  it("should show only missing owners when there are no owners", () => {
    // Test Action
    render(<BaseOwnerSettingsSection owners={[]} missingOwners={missing} />);

    // Expected Result
    expect(screen.queryByText("Nothing to show.")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Dave" })).toBeInTheDocument();
  });

  it("should filter missing owners by search and type", async () => {
    // Test Data
    const user = userEvent.setup();
    render(<BaseOwnerSettingsSection owners={owners} missingOwners={missing} enableFilters />);

    // Test Action
    await user.type(screen.getByRole("searchbox"), "alice");

    // Expected Result
    expect(screen.queryByRole("heading", { name: "Dave" })).not.toBeInTheDocument();
    expect(screen.queryByText(/Missing in/)).not.toBeInTheDocument();

    // Test Action
    await user.clear(screen.getByRole("searchbox"));
    await user.click(screen.getByRole("button", { name: /Corporations/ }));

    // Expected Result
    expect(screen.queryByRole("heading", { name: "Dave" })).not.toBeInTheDocument();
  });
});
