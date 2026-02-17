import { Alert, Button, Popconfirm, Table, Tag, theme, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { toast } from "sonner";
import CreateUserModal from "../../components/users/CreateUserModal";
import { selectCurrentUser } from "../../redux/features/auth/authSlice";
import { useDeleteUserMutation, useGetUsersQuery } from "../../redux/features/user/userApi";
import { useAppSelector } from "../../redux/hooks";

const { Title, Text } = Typography;

type TUserRow = {
  _id: string;
  fullName?: string;
  username: string;
  email: string;
  role: "manager" | "user";
};

const UserManagement = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const currentUser = useAppSelector(selectCurrentUser);
  const { data, isLoading, isError, error, refetch } = useGetUsersQuery(undefined);
  const [deleteUser] = useDeleteUserMutation();
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);

  if (!currentUser || currentUser.role !== "manager") {
    return (
      <Alert
        type="error"
        showIcon
        message="Access denied"
        description="Only managers can manage users."
        style={{ margin: 16 }}
      />
    );
  }

  const users: TUserRow[] = data?.data || [];

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting user...");
    try {
      await deleteUser(id).unwrap();
      toast.success("User deleted successfully.", { id: toastId, duration: 2000 });
      refetch();
    } catch (err: any) {
      toast.error(
        `Failed to delete user. ${
          err?.data?.errorDetails ? err?.data?.errorDetails.issues[0].message : err?.data?.message
        }`,
        {
          id: toastId,
          duration: 2000,
        },
      );
    }
  };

  const columns: ColumnsType<TUserRow> = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (value: string | undefined, record) => value || record.username,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: "manager" | "user") => (
        <Tag color={role === "manager" ? "blue" : "green"} style={{ textTransform: "capitalize" }}>
          {role}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_value, record) => (
        <Popconfirm
          title="Delete user"
          description="Are you sure you want to delete this user?"
          okText="Yes"
          cancelText="No"
          onConfirm={() => handleDelete(record._id)}
          okButtonProps={{ danger: true }}
        >
          <Button danger size="small" disabled={record._id === currentUser._id}>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div>
          <Title level={3} style={{ margin: 0 }}>
            User Management
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Add and remove users. Only managers have access to this page.
          </Text>
        </div>
        <Button type="primary" onClick={() => setIsCreateUserOpen(true)}>
          Add User
        </Button>
      </div>

      {isError && (
        <Alert
          type="error"
          showIcon
          message="Failed to load users"
          description={(error as any)?.data?.message || "Something went wrong while fetching users."}
          style={{ marginBottom: 16 }}
        />
      )}

      <Table
        rowKey={(record) => record._id}
        loading={isLoading}
        columns={columns}
        dataSource={users}
        pagination={{ pageSize: 20, showSizeChanger: true }}
        scroll={{ x: 800 }}
      />

      <CreateUserModal
        open={isCreateUserOpen}
        onClose={() => {
          setIsCreateUserOpen(false);
          refetch();
        }}
      />
    </div>
  );
};

export default UserManagement;
