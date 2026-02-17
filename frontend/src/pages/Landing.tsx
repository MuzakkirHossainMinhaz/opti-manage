import { BarChartOutlined, LoginOutlined, SafetyCertificateOutlined, TeamOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { Button, Card, Col, Grid, Layout, Row, Space, theme, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import logo from "../../public/logo.png";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;
const { useBreakpoint } = Grid;

const Landing = () => {
  const navigate = useNavigate();
  const {
    token: { colorPrimary, colorWarning, borderRadiusLG },
  } = theme.useToken();
  const screens = useBreakpoint();

  const features = [
    {
      icon: <SafetyCertificateOutlined style={{ fontSize: "24px", color: colorWarning }} />,
      title: "Inventory Management",
      description:
        "Track your frames, lenses, and contact lenses with our advanced inventory system. Never run out of stock again.",
    },
    {
      icon: <BarChartOutlined style={{ fontSize: "24px", color: colorWarning }} />,
      title: "Sales Analytics",
      description:
        "Visualize your sales data with intuitive charts. Identify top-selling products and optimize your revenue.",
    },
    {
      icon: <TeamOutlined style={{ fontSize: "24px", color: colorWarning }} />,
      title: "User Roles",
      description:
        "Manage access with secure role-based authentication. separate portals for admins and staff members.",
    },
    {
      icon: <ThunderboltOutlined style={{ fontSize: "24px", color: colorWarning }} />,
      title: "Fast & Reliable",
      description: "Built with modern technologies ensuring high performance and 99.9% uptime for your business.",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
      {/* Header */}
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          padding: screens.md ? "0 50px" : "0 20px",
          height: "70px",
        }}
      >
        <div
          className="logo"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: "18px",
            }}
          >
            <img src={logo} alt="OptiManageLogo" style={{ width: "28px" }} />
          </div>
          <Title level={4} style={{ margin: 0, color: "#1f1f1f", fontWeight: 700 }}>
            OptiManage
          </Title>
        </div>
        <Space>
          <Button onClick={() => navigate("/login")} style={{ fontWeight: 500, borderRadius: "20px" }}>
            Log in
          </Button>
            <Button type="primary" size="large" onClick={() => navigate("/login")} style={{ fontWeight: 500, borderRadius: "26px" }}>
              Sign In
            </Button>
        </Space>
      </Header>

      <Content>
        {/* Hero Section */}
        <div
          style={{
            background: "linear-gradient(180deg, #e0f2f1 0%, #ffffff 100%)",
            padding: screens.md ? "80px 50px 100px" : "40px 20px 60px",
            display: "flex",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              maxWidth: "1240px",
              width: "100%",
              display: "flex",
              flexDirection: screens.md ? "row" : "column-reverse",
              alignItems: "center",
              justifyContent: "space-between",
              gap: screens.md ? "60px" : "40px",
            }}
          >
            <div
              style={{
                flex: 1,
                textAlign: screens.md ? "left" : "center",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  background: "#a9d6d4ff",
                  color: colorPrimary,
                  borderRadius: "20px",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  marginBottom: "16px",
                }}
              >
                #1 Optical Shop Management Software
              </div>
              <Title
                level={1}
                style={{
                  fontSize: screens.md ? "3.5rem" : "2.5rem",
                  marginBottom: "24px",
                  background: "linear-gradient(45deg, #1f1f1f, #595959)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  lineHeight: 1.2,
                }}
              >
                Focus on Your Vision, <br />
                <span
                  style={{
                    color: colorPrimary,
                    WebkitTextFillColor: colorPrimary,
                  }}
                >
                  We'll Handle the Rest
                </span>
              </Title>
              <Paragraph
                style={{
                  fontSize: "1.25rem",
                  color: "#666",
                  marginBottom: "40px",
                  lineHeight: "1.8",
                  maxWidth: "540px",
                  marginInline: screens.md ? "0" : "auto",
                }}
              >
                Streamline your optical business with our all-in-one platform for inventory, sales, and customer
                management. Simple, powerful, and secure.
              </Paragraph>
              <Space size="middle" wrap>
                <Button
                  type="primary"
                  size="large"
                  icon={<LoginOutlined />}
                  onClick={() => navigate("/login")}
                  style={{
                    height: "52px",
                    padding: "0 40px",
                    fontSize: "1.1rem",
                    borderRadius: "26px",
                    boxShadow: `0 4px 14px 0 ${colorPrimary}63`,
                  }}
                >
                  Sign In
                </Button>
              </Space>

              <div
                style={{
                  marginTop: "40px",
                  display: "flex",
                  gap: "24px",
                  justifyContent: screens.md ? "flex-start" : "center",
                }}
              >
                <div>
                  <Title level={4} style={{ margin: 0, color: colorPrimary }}>
                    500+
                  </Title>
                  <Text type="secondary">Shops</Text>
                </div>
                <div
                  style={{
                    width: "1px",
                    height: "40px",
                    background: "#e8e8e8",
                  }}
                ></div>
                <div>
                  <Title level={4} style={{ margin: 0, color: colorPrimary }}>
                    1M+
                  </Title>
                  <Text type="secondary">Sales</Text>
                </div>
                <div
                  style={{
                    width: "1px",
                    height: "40px",
                    background: "#e8e8e8",
                  }}
                ></div>
                <div>
                  <Title level={4} style={{ margin: 0, color: colorPrimary }}>
                    99%
                  </Title>
                  <Text type="secondary">Satisfaction</Text>
                </div>
              </div>
            </div>

            <div
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "120%",
                  height: "120%",
                  background: "radial-gradient(circle, rgba(24,144,255,0.1) 0%, rgba(255,255,255,0) 70%)",
                  zIndex: 0,
                }}
              ></div>
              <img
                src={logo}
                alt="OptiManage Dashboard"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.1))",
                  transform: "perspective(1000px) rotateY(-5deg)",
                  zIndex: 1,
                  animation: "float 6s ease-in-out infinite",
                }}
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div
          style={{
            padding: screens.md ? "80px 50px" : "60px 20px",
            background: "#fff",
          }}
        >
          <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "60px" }}>
              <Title level={2}>Everything You Need</Title>
              <Paragraph type="secondary" style={{ fontSize: "1.1rem" }}>
                Powerful features designed to help your optical business grow
              </Paragraph>
            </div>

            <Row gutter={[32, 32]}>
              {features.map((feature, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <Card
                    hoverable
                    bordered={false}
                    style={{
                      height: "100%",
                      background: "#f9f9f9",
                      borderRadius: borderRadiusLG,
                      textAlign: "center",
                      transition: "all 0.3s",
                    }}
                    bodyStyle={{ padding: "32px 24px" }}
                  >
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        background: "#fff",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 20px",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                      }}
                    >
                      {feature.icon}
                    </div>
                    <Title level={4} style={{ marginBottom: "12px" }}>
                      {feature.title}
                    </Title>
                    <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                      {feature.description}
                    </Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </div>

        {/* CTA Section */}
        <div
          style={{
            padding: "80px 20px",
            background: "#001529",
            color: "#fff",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <Title level={2} style={{ color: "#fff", marginBottom: "20px" }}>
              Ready to optimize your optical shop?
            </Title>
            <Paragraph
              style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: "1.2rem",
                marginBottom: "40px",
              }}
            >
              Join hundreds of optical stores that trust OptiManage for their daily operations.
            </Paragraph>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate("/login")}
              style={{
                height: "56px",
                padding: "0 48px",
                fontSize: "1.2rem",
                borderRadius: "28px",
              }}
            >
              Sign In
            </Button>
          </div>
        </div>
      </Content>

      <Footer style={{ background: "#f0f2f5", padding: "40px 0" }}>
        <div
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            padding: "0 20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              <img src="/logo.png" alt="OptiManage" style={{ width: "24px", height: "24px" }} />
            </div>
            <Text strong style={{ fontSize: "1.2rem" }}>
              OptiManage
            </Text>
          </div>
          <Space size="large" style={{ marginBottom: "20px" }}>
            <Text type="secondary" style={{ cursor: "pointer" }}>
              About
            </Text>
            <Text type="secondary" style={{ cursor: "pointer" }}>
              Features
            </Text>
            <Text type="secondary" style={{ cursor: "pointer" }}>
              Pricing
            </Text>
            <Text type="secondary" style={{ cursor: "pointer" }}>
              Contact
            </Text>
          </Space>
          <div>
            <Text type="secondary">© {new Date().getFullYear()} OptiManage. All rights reserved.</Text>
          </div>
        </div>
      </Footer>
      <style>{`
        @keyframes float {
          0% { transform: perspective(1000px) rotateY(-5deg) translateY(0px); }
          50% { transform: perspective(1000px) rotateY(-5deg) translateY(-20px); }
          100% { transform: perspective(1000px) rotateY(-5deg) translateY(0px); }
        }
      `}</style>
    </Layout>
  );
};

export default Landing;
