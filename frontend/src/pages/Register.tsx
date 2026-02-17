import { Button, Card, Col, Layout, Row, theme, Typography } from "antd";
import { FieldValues } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import logo from "../../public/logo.png";
import Form from "../components/form/Form";
import MyInput from "../components/form/Input";
import { useRegisterMutation } from "../redux/features/auth/authApi";

const { Title, Text } = Typography;
const { Content } = Layout;

const Register = () => {
  const navigate = useNavigate();
  const [register] = useRegisterMutation();
  const {
    token: { borderRadiusLG, colorTextHeading },
  } = theme.useToken();

  // submit handler
  const onSubmit = async (data: FieldValues) => {
    const toastId = toast.loading("Registering...");

    try {
      const userInfo = {
        username: data.username,
        email: data.email,
        password: data.password,
      };

      await register(userInfo).unwrap(); // register

      toast.success("Successfully Registered. Please Login.", {
        id: toastId,
        duration: 2000,
      });

      navigate(`/login`);
    } catch (err: any) {
      toast.error(
        `Registration failed. ${
          err?.data?.errorDetails ? err?.data?.errorDetails.issues[0].message : err?.data?.message
        }`,
        {
          id: toastId,
          duration: 2000,
        },
      );
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content
        style={{
          background: `linear-gradient(180deg, #e0f2f1 0%, #ffffff 100%)`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <Row justify="center" align="middle" style={{ width: "100%" }}>
          <Col xs={24} sm={20} md={16} lg={10} xl={8}>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                }}
              >
                <img src={logo} alt="OptiManageLogo" style={{ width: "45px" }} />
              </div>
              <Title level={2} style={{ margin: 0, color: colorTextHeading }}>
                Create Account
              </Title>
              <Text type="secondary">Join OptiManage to streamline your business</Text>
            </div>

            <Card
              bordered={false}
              style={{
                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                borderRadius: borderRadiusLG,
              }}
            >
              <Form onSubmit={onSubmit}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <MyInput required type="text" name="username" label="Username" placeholder="Choose a username" />
                  <MyInput required type="email" name="email" label="Email" placeholder="Enter your email" />
                  <MyInput required type="password" name="password" label="Password" placeholder="Create a password" />

                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    style={{ marginTop: "10px", fontWeight: 600 }}
                  >
                    Register
                  </Button>
                </div>
              </Form>

              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <Text>Already have an account? </Text>
                <Button type="link" onClick={() => navigate("/login")} style={{ padding: 0, fontWeight: 600 }}>
                  Log in
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Register;
