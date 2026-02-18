import { Button, Card, Col, Divider, Row, Typography, theme } from "antd";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import Form from "../../components/form/Form";
import MyInput from "../../components/form/Input";
import { selectCurrentUser } from "../../redux/features/auth/authSlice";
import { useChangePasswordMutation, useUpdateProfileMutation } from "../../redux/features/user/userApi";
import { useAppSelector } from "../../redux/hooks";

const { Title, Text } = Typography;

const Profile = () => {
  const user = useAppSelector(selectCurrentUser);
  const {
    token: { borderRadiusLG, colorTextHeading, colorBgContainer },
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
    <div
      style={{
        padding: "20px",
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
        boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        border: "none",
      }}
    >
      <div
        style={{
          marginBottom: 24,
        }}
      >
        <Title level={3} style={{ margin: 0, color: colorTextHeading }}>
          Profile
        </Title>
        <Text type="secondary" style={{ fontSize: 13 }}>
          Manage your personal details and update your password.
        </Text>
      </div>

      <Row justify="space-between" align="top" gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card
            style={{
              boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
              borderRadius: borderRadiusLG,
            }}
          >
            <Title level={4} style={{ marginBottom: 4, color: colorTextHeading }}>
              Personal Details
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

                <Button type="primary" htmlType="submit" block style={{ marginTop: "10px", fontWeight: 600 }}>
                  Save Changes
                </Button>
              </div>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            style={{
              boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
              borderRadius: borderRadiusLG,
            }}
          >
            <Title level={4} style={{ marginBottom: 4, color: colorTextHeading }}>
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

                <Button type="primary" htmlType="submit" block style={{ marginTop: "10px", fontWeight: 600 }}>
                  Change Password
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
