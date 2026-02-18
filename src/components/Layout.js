import { Sidebar } from "./Sidebar";
import "./Layout.css";

export const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Sidebar />
      <main className="layout__content">{children}</main>
    </div>
  );
};
