// React
import ReactDOM from "react-dom";

// AA Geuthur React
import AuthRightMenu from "@/Menu/AuthRightMenu";
import { useMenu } from "@/Menu/Hooks";

/** Loads the menu and renders the right links into the `nav-right` element of the Alliance Auth template. */
export const AuthRightMenuAsync = () => {
  const menuRoot = typeof document !== "undefined" ? document.getElementById("nav-right") : null;

  const { data: menuData, isLoading, isError } = useMenu();

  if (!menuRoot || !menuData?.right_links) {
    return <></>;
  }

  return ReactDOM.createPortal(
    <AuthRightMenu error={isError} isLoading={isLoading} data={menuData.right_links} />,
    menuRoot,
  );
};

export default AuthRightMenuAsync;
