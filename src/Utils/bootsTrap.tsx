// React
import type { ComponentProps, ReactElement } from "react";

// Third Party
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

/**
 * Tooltip notification component
 * @param message The message to display inside the tooltip
 * @returns A React element representing the tooltip container
 */
export function toolTipContainer(message: string): ReactElement {
  return (
    <div className="aa-tooltip-container">
      <span>{message}</span>
    </div>
  );
}

/**
 * Helper function for rendering tooltips
 * @param message The message to display inside the tooltip
 * @param children The React element that triggers the tooltip
 */
export function renderTooltip(message: string, children: ComponentProps<typeof OverlayTrigger>["children"]) {
  return (
    <OverlayTrigger
      placement="auto"
      trigger={["hover", "focus"]}
      overlay={
        <Tooltip id="aa-react-tooltip" className="aa-tooltip">
          {message}
        </Tooltip>
      }
    >
      {children}
    </OverlayTrigger>
  );
}
