import { DashboardOutlined, EyeOutlined, HistoryOutlined, LogoutOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, Layout, Menu, theme } from "antd";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { logout, selectCurrentUser } from "../../redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

const { Sider } = Layout;

const Sidebar = ({ collapsed }: { collapsed: boolean }) => {
  const {
    token: { colorBgContainer, colorPrimary, colorError, colorErrorBg, colorErrorBorder, colorErrorHover },
  } = theme.useToken();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);
  const user = useAppSelector(selectCurrentUser);

  const handleLogout = () => {
    dispatch(logout());
  };

  const sidebarItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/eye-glasses",
      icon: <EyeOutlined />,
      label: "Eye Glasses",
    },
    {
      key: "/sales-history",
      icon: <HistoryOutlined />,
      label: "Sales History",
    },
    ...(user?.role === "manager"
      ? [
          {
            key: "/activity-log",
            icon: <HistoryOutlined />,
            label: "Activity Log",
          },
        ]
      : []),
  ];

  const getSelectedKey = () => {
    // Match exact path or start of path (for nested routes)
    const currentPath = location.pathname;
    const matchedItem = sidebarItems.find(
      (item) => currentPath === item.key || (currentPath.startsWith(item.key) && item.key !== "/dashboard"),
    );
    return matchedItem ? [matchedItem.key] : [currentPath];
  };

  return (
    <Sider
      width={280}
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{
        background: colorBgContainer,
        borderRight: "1px solid #f0f0f0",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1000,
        boxShadow: "2px 0 8px rgba(0,0,0,0.02)", // Subtle shadow for depth
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Logo Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "70px", // Increased height
            gap: "12px",
            borderBottom: "1px solid #f0f0f0",
            flexShrink: 0,
            padding: "0 16px",
          }}
        >
          <div
            style={{
              background: collapsed ? "transparent" : `rgba(0, 0, 0, 0.02)`,
              borderRadius: "12px",
              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
            }}
          >
            <img
              src={logo}
              alt="logo"
              style={{
                width: collapsed ? "32px" : "36px",
                height: collapsed ? "32px" : "36px",
                objectFit: "contain",
                transition: "all 0.3s ease",
              }}
            />
          </div>
          {!collapsed && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <h1
                style={{
                  color: "#1f1f1f",
                  fontWeight: "700",
                  fontSize: "18px",
                  lineHeight: "1.2",
                  margin: 0,
                  whiteSpace: "nowrap",
                }}
              >
                Opti Manage
              </h1>
              <span style={{ fontSize: "11px", color: "#888", fontWeight: 500 }}>Store Management</span>
            </div>
          )}
        </div>

        {/* Menu Section */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 4px" }}>
          <ConfigProvider
            theme={{
              components: {
                Menu: {
                  itemSelectedBg: colorPrimary,
                  itemSelectedColor: "#ffffff",
                  itemHoverBg: "rgba(0, 0, 0, 0.04)",
                  itemActiveBg: colorPrimary,
                  itemColor: "#555",
                  iconSize: 16,
                  itemMarginInline: 8,
                  itemBorderRadius: 8,
                },
              },
            }}
          >
            <Menu
              theme="light"
              mode="inline"
              selectedKeys={getSelectedKey()}
              items={sidebarItems}
              onClick={({ key }) => navigate(key)}
              style={{
                borderRight: "none",
                fontSize: "14px",
                fontWeight: 500,
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            />
          </ConfigProvider>
        </div>

        {/* Logout Section */}
        <div
          style={{
            padding: "12px",
            borderTop: "1px solid #f0f0f0",
            flexShrink: 0,
          }}
        >
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            onMouseEnter={() => setIsLogoutHovered(true)}
            onMouseLeave={() => setIsLogoutHovered(false)}
            block
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "40px",
              fontWeight: 600,
              border: `1px solid ${isLogoutHovered ? colorErrorHover : colorErrorBorder}`,
              background: collapsed ? "transparent" : isLogoutHovered ? colorErrorBg : "transparent",
              color: colorError,
              borderRadius: "8px",
              transition: "all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)",
            }}
          >
            {!collapsed && "Logout"}
          </Button>
        </div>
      </div>
    </Sider>
  );
};

export default Sidebar;
