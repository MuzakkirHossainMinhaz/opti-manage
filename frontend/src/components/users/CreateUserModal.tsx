import { Modal } from "antd";
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
  const [registerUser] = useRegisterMutation();

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
      title="Add New User"
      destroyOnClose
      centered
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
            Create User
          </button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateUserModal;

