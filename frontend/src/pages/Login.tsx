import { Alert, Button, Card, Col, Layout, Row, theme, Typography } from "antd";
import { FieldValues } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import logo from "../../public/logo.png";
import Form from "../components/form/Form";
import MyInput from "../components/form/Input";
import { useLoginMutation } from "../redux/features/auth/authApi";
import { IUser, setUser, useCurrentToken } from "../redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { verifyToken } from "../utils/verifyToken";

const { Title, Text } = Typography;
const { Content } = Layout;

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login] = useLoginMutation();
  const {
    token: { borderRadiusLG, colorTextHeading },
  } = theme.useToken();

  const token = useAppSelector(useCurrentToken);

  // submit handler
  const onSubmit = async (data: FieldValues) => {
    const toastId = toast.loading("Logging in...");

    try {
      const userInfo = {
        username: data.username,
        password: data.password,
      };

      const res = await login(userInfo).unwrap(); // login

      const user = verifyToken(res.data.token) as IUser;
      dispatch(setUser({ user: user, token: res.data.token })); // set user and token in redux

      toast.success("Logged in.", { id: toastId, duration: 2000 });

      navigate(`/dashboard`);
    } catch (err: any) {
      toast.error(
        `Login failed. ${err?.data?.errorDetails ? err?.data?.errorDetails.issues[0].message : err?.data?.message}`,
        {
          id: toastId,
          duration: 2000,
        },
      );
    }
  };

  if (token) {
    // if user is already logged in, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

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
                Welcome Back
              </Title>
              <Text type="secondary">Sign in to your account to continue</Text>
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
                  <MyInput required type="text" name="username" label="Username" placeholder="Enter your username" />
                  <MyInput required type="password" name="password" label="Password" placeholder="Enter your password" />

                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    style={{ marginTop: "10px", fontWeight: 600 }}
                  >
                    Log In
                  </Button>
                </div>
              </Form>

              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <Text>New to OptiManage? </Text>
                <Button type="link" onClick={() => navigate("/register")} style={{ padding: 0, fontWeight: 600 }}>
                  Create an account
                </Button>
              </div>
            </Card>

            <Alert
              message="Demo Credentials"
              description={
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    marginTop: "8px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "13px",
                    }}
                  >
                    <Text strong>Manager:</Text>
                    <span>
                      User: <Text code>Manager</Text> Pass: <Text code>Manager@2026</Text>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "13px",
                    }}
                  >
                    <Text strong>Staff:</Text>
                    <span>
                      User: <Text code>test.user1</Text> Pass: <Text code>Test@user1</Text>
                    </span>
                  </div>
                </div>
              }
              type="info"
              showIcon
              style={{ marginTop: "24px", borderRadius: borderRadiusLG }}
            />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Login;
