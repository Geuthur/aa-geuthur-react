// React
import ReactDOM from "react-dom";

// AA Geuthur React
import AuthLeftMenu from "@/Menu/AuthLeftMenu";
import { useMenu } from "@/Menu/Hooks";

/** Loads the menu and renders the left links into the `nav-left` element of the Alliance Auth template. */
export const AuthLeftMenuAsync = () => {
  const menuRoot = typeof document !== "undefined" ? document.getElementById("nav-left") : null;

  const { data: menuData, isLoading, isError } = useMenu();

  if (!menuRoot || !menuData?.left_links) {
    return <></>;
  }

  return ReactDOM.createPortal(
    <AuthLeftMenu error={isError} isLoading={isLoading} data={menuData.left_links} />,
    menuRoot,
  );
};

export default AuthLeftMenuAsync;
