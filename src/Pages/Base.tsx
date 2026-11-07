// React
import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";

// Third Party
import { Col } from "react-bootstrap";

// AA Geuthur React
import ErrorBoundary from "@/Components/Base/Loader";
import AuthLeftMenuAsync from "@/Menu/AuthLeftMenuAsync";
import AuthRightMenuAsync from "@/Menu/AuthRightMenuAsync";

export interface AuthBaseProps {
  /** Extra classes for the `aa-react container` wrapper. */
  className?: string;
  /** Content instead of the router `Outlet`. */
  children?: ReactNode;
}

/**
 * Layout of an app page in Alliance Auth: renders the menus into the navigation bar and the
 * routed page inside the `aa-react container` wrapper (640px to 1280px wide) with an error boundary.
 */
const AuthBase = ({ className = "", children }: AuthBaseProps) => {
  return (
    <>
      <AuthLeftMenuAsync />
      <AuthRightMenuAsync />
      <Col>
        <div className={`aa-react container mt-4 ${className}`}>
          <ErrorBoundary>{children ?? <Outlet />}</ErrorBoundary>
        </div>
      </Col>
    </>
  );
};

export default AuthBase;
