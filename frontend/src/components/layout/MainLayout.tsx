import { MenuFoldOutlined, MenuUnfoldOutlined, UserAddOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Layout, Tag, theme } from "antd";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import CreateUserModal from "../users/CreateUserModal";
import Sidebar from "./Sidebar";
const { Header, Content, Footer } = Layout;

const MainLayout = () => {
  const user = useAppSelector((state) => state.auth.user);
  const [collapsed, setCollapsed] = useState(false);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG, colorPrimary, colorPrimaryBg },
  } = theme.useToken();

  return (
    // layout component added from ant design
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar collapsed={collapsed} /> {/*layout sidebar*/}
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 280,
          transition: "margin-left 0.2s",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header
          style={{
            padding: "9px 16px",
            background: colorBgContainer,
            display: "flex",
            height: 70,
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #f0f0f0",
            flexShrink: 0,
            zIndex: 999,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 52,
              height: 52,
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {user?.role === "manager" && (
              <Button
                type="primary"
                size="small"
                icon={<UserAddOutlined />}
                onClick={() => setIsCreateUserOpen(true)}
              >
                Add User
              </Button>
            )}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 2,
              }}
            >
              <span
                style={{
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "#1f1f1f",
                  lineHeight: "1.2",
                }}
              >
                {user?.username}
              </span>
              <Tag
                color={colorPrimaryBg}
                style={{
                  color: colorPrimary,
                  border: "none",
                  margin: 0,
                  fontSize: "10px",
                  lineHeight: "16px",
                  padding: "0 8px",
                  fontWeight: 600,
                  borderRadius: "100px", // Pill shape
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                role : {user?.role}
              </Tag>
            </div>
            <Avatar
              size={42}
              icon={<UserOutlined />}
              onClick={() => navigate("/profile")}
              style={{
                backgroundColor: colorPrimaryBg,
                color: colorPrimary,
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
              }}
            />
          </div>
        </Header>

        {/* content body of the layout */}
        <Content
          className="hide-scrollbar"
          style={{
            margin: "16px",
            padding: 0, // Remove padding from container to let pages control it
            flex: 1, // Take up remaining space
            overflowY: "auto", // Enable vertical scrolling for content only
            background: "transparent", // Use transparent to show Layout background
            borderRadius: borderRadiusLG,
            overflowX: "hidden", // Changed to hidden to prevent double scrollbars, pages should handle scroll
          }}
        >
          <Outlet />
        </Content>

        {/* footer */}
        <Footer
          style={{
            height: 65,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#fff",
            flexShrink: 0,
            color: "#8c8c8c",
            fontSize: "13px",
            borderTop: "1px solid rgba(0,0,0,0.03)",
            transition: "all 0.2s",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              opacity: 0.8,
            }}
          >
            <span>© {new Date().getFullYear()}</span>
            <span
              style={{
                fontWeight: 600,
                color: "#595959",
              }}
            >
              Opti Manage
            </span>
            <span
              style={{
                width: 3,
                height: 3,
                background: "#d9d9d9",
                borderRadius: "50%",
              }}
            />
            <span>All rights reserved.</span>
          </div>
        </Footer>
        <CreateUserModal open={isCreateUserOpen} onClose={() => setIsCreateUserOpen(false)} />
      </Layout>
    </Layout>
  );
};

export default MainLayout;
