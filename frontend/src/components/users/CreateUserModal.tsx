import { Button, Modal } from "antd";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import Form from "../form/Form";
import MyInput from "../form/Input";
import { useRegisterMutation } from "../../redux/features/auth/authApi";

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
}

const CreateUserModal = ({ open, onClose }: CreateUserModalProps) => {
  const [registerUser, { isLoading }] = useRegisterMutation();

  const handleSubmit = async (data: FieldValues) => {
    const toastId = toast.loading("Creating user...");

    try {
      const payload = {
        fullName: data.fullName,
        username: data.username,
        email: data.email,
        password: data.password,
      };

      await registerUser(payload).unwrap();

      toast.success("User created successfully.", { id: toastId, duration: 2000 });
      onClose();
    } catch (err: any) {
      toast.error(
        `Failed to create user. ${
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
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={
        <p
          className="my-font"
          style={{
            fontSize: "18px",
            fontWeight: 600,
            paddingBottom: "12px",
            borderBottom: "2px solid #e5e5e5",
            color: "#1f1f1f",
            margin: 0,
          }}
        >
          Add New User
        </p>
      }
      destroyOnClose
      centered
      maskClosable={false}
      width={600}
    >
      <Form onSubmit={handleSubmit}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <MyInput type="text" name="fullName" label="Full Name" placeholder="Enter full name" />
          <MyInput required type="text" name="username" label="Username" placeholder="Choose a username" />
          <MyInput required type="email" name="email" label="Email" placeholder="Enter email" />
          <MyInput required type="password" name="password" label="Password" placeholder="Create a password" />

          <Button
            className="my-font"
            type="primary"
            htmlType="submit"
            loading={isLoading}
            style={{
              fontSize: "15px",
              fontWeight: 600,
              height: "37px",
              marginTop: "6px",
            }}
          >
            Create User
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateUserModal;
