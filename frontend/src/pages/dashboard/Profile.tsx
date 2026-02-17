import { Card, Col, Divider, Layout, Row, Typography, theme } from "antd";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import Form from "../../components/form/Form";
import MyInput from "../../components/form/Input";
import { selectCurrentUser } from "../../redux/features/auth/authSlice";
import { useUpdateProfileMutation, useChangePasswordMutation } from "../../redux/features/user/userApi";
import { useAppSelector } from "../../redux/hooks";

const { Content } = Layout;
const { Title, Text } = Typography;

const Profile = () => {
  const user = useAppSelector(selectCurrentUser);
  const {
    token: { borderRadiusLG, colorTextHeading },
  } = theme.useToken();

  const [updateProfile] = useUpdateProfileMutation();
  const [changePassword] = useChangePasswordMutation();

  if (!user) {
    return null;
  }

  const handleProfileUpdate = async (data: FieldValues) => {
    const toastId = toast.loading("Updating profile...");

    try {
      const payload: { fullName?: string; username?: string; email?: string } = {};

      if (data.fullName) {
        payload.fullName = data.fullName;
      }

      if (user.role === "manager") {
        if (data.username) {
          payload.username = data.username;
        }
        if (data.email) {
          payload.email = data.email;
        }
      }

      if (Object.keys(payload).length === 0) {
        toast.info("Nothing to update.", { id: toastId, duration: 2000 });
        return;
      }

      await updateProfile({ id: user._id, data: payload }).unwrap();

      toast.success("Profile updated successfully.", { id: toastId, duration: 2000 });
    } catch (err: any) {
      toast.error(
        `Failed to update profile. ${
          err?.data?.errorDetails ? err?.data?.errorDetails.issues[0].message : err?.data?.message
        }`,
        {
          id: toastId,
          duration: 2000,
        },
      );
    }
  };

  const handlePasswordChange = async (data: FieldValues) => {
    const toastId = toast.loading("Changing password...");

    try {
      await changePassword({
        id: user._id,
        data: { currentPassword: data.currentPassword, newPassword: data.newPassword },
      }).unwrap();

      toast.success("Password changed successfully.", { id: toastId, duration: 2000 });
    } catch (err: any) {
      toast.error(
        `Failed to change password. ${
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
    <Layout style={{ minHeight: "100%" }}>
      <Content
        style={{
          padding: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <Row justify="center" align="top" style={{ width: "100%", maxWidth: "900px" }} gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card
              bordered={false}
              style={{
                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                borderRadius: borderRadiusLG,
              }}
            >
              <Title level={3} style={{ marginBottom: 4, color: colorTextHeading }}>
                Profile
              </Title>
              <Text type="secondary" style={{ fontSize: 13 }}>
                Update your personal details. Only managers can change username and email.
              </Text>

              <Divider />

              <Form onSubmit={handleProfileUpdate}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <MyInput type="text" name="fullName" label="Full Name" placeholder="Enter your full name" />

                  {user.role === "manager" ? (
                    <>
                      <MyInput type="text" name="username" label="Username" placeholder={user.username} />
                      <MyInput type="email" name="email" label="Email" placeholder="Enter email" />
                    </>
                  ) : (
                    <>
                      <div>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                          Username
                        </Text>
                        <div style={{ fontWeight: 600 }}>{user.username}</div>
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    style={{
                      marginTop: "10px",
                      width: "100%",
                      padding: "10px 16px",
                      borderRadius: 8,
                      border: "none",
                      background: "#1677ff",
                      color: "#fff",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </Form>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card
              bordered={false}
              style={{
                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                borderRadius: borderRadiusLG,
              }}
            >
              <Title level={3} style={{ marginBottom: 4, color: colorTextHeading }}>
                Change Password
              </Title>
              <Text type="secondary" style={{ fontSize: 13 }}>
                Update your password. Make sure to use a strong one.
              </Text>

              <Divider />

              <Form onSubmit={handlePasswordChange}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <MyInput
                    required
                    type="password"
                    name="currentPassword"
                    label="Current Password"
                    placeholder="Enter current password"
                  />
                  <MyInput
                    required
                    type="password"
                    name="newPassword"
                    label="New Password"
                    placeholder="Enter new password"
                  />

                  <button
                    type="submit"
                    style={{
                      marginTop: "10px",
                      width: "100%",
                      padding: "10px 16px",
                      borderRadius: 8,
                      border: "none",
                      background: "#1677ff",
                      color: "#fff",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Change Password
                  </button>
                </div>
              </Form>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Profile;

