import SideDrawer from "./SideDrawer";

const Layout = (props: any) => {
  return (
    <div className="layout-main-flex">
      <div className="layout-nav">
        <SideDrawer />
      </div>
      <div className="layout-main">{props.children}</div>
    </div>
  );
};

export default Layout;
