import { Alert, Button, Popconfirm, Table, Tag, theme, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { toast } from "sonner";
import CreateUserModal from "../../components/users/CreateUserModal";
import { selectCurrentUser } from "../../redux/features/auth/authSlice";
import { useDeleteUserMutation, useGetUsersQuery } from "../../redux/features/user/userApi";
import {
  useGetOwnershipRequestsQuery,
  useUpdateOwnershipRequestStatusMutation,
} from "../../redux/features/ownershipRequest/ownershipRequestApi";
import { useAppSelector } from "../../redux/hooks";

const { Title, Text } = Typography;

type TUserRow = {
  _id: string;
  fullName?: string;
  username: string;
  email: string;
  role: "manager" | "user";
};

type TOwnershipRequestRow = {
  _id: string;
  eyeGlass?: { _id: string; name: string };
  fromUser?: { _id: string; username: string; role: "manager" | "user" };
  toUser?: { _id: string; username: string; role: "manager" | "user" };
  status: "pending" | "approved" | "rejected" | "cancelled";
};

const UserManagement = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const currentUser = useAppSelector(selectCurrentUser);
  const { data, isLoading, isError, error, refetch } = useGetUsersQuery(undefined);
  const [deleteUser] = useDeleteUserMutation();
  const {
    data: ownershipRequestsData,
    isLoading: isOwnershipRequestsLoading,
    refetch: refetchOwnershipRequests,
  } = useGetOwnershipRequestsQuery(undefined);
  const [updateOwnershipRequestStatus, { isLoading: isUpdatingRequest }] =
    useUpdateOwnershipRequestStatusMutation();
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
  const ownershipRequests: TOwnershipRequestRow[] = ownershipRequestsData?.data || [];

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

  const ownershipRequestColumns: ColumnsType<TOwnershipRequestRow> = [
    {
      title: "Eye Glass",
      dataIndex: ["eyeGlass", "name"],
      key: "eyeGlass",
      render: (_value, record) => record.eyeGlass?.name || "Unknown",
    },
    {
      title: "From",
      dataIndex: ["fromUser", "username"],
      key: "fromUser",
      render: (_value, record) => record.fromUser?.username || "Unknown",
    },
    {
      title: "To",
      dataIndex: ["toUser", "username"],
      key: "toUser",
      render: (_value, record) => record.toUser?.username || "Unknown",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: TOwnershipRequestRow["status"]) => {
        const color =
          status === "pending" ? "orange" : status === "approved" ? "green" : status === "rejected" ? "red" : "default";
        return (
          <Tag color={color} style={{ textTransform: "capitalize" }}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_value, record) => {
        if (record.status !== "pending") {
          return null;
        }

        const handleUpdateStatus = async (status: "approved" | "rejected") => {
          const toastId = toast.loading("Updating request...");
          try {
            await updateOwnershipRequestStatus({ id: record._id, status }).unwrap();
            toast.success("Request updated successfully.", { id: toastId, duration: 2000 });
            refetchOwnershipRequests();
          } catch (err: any) {
            toast.error(
              `Failed to update request. ${
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
          <div style={{ display: "flex", gap: 8 }}>
            <Button
              type="primary"
              size="small"
              loading={isUpdatingRequest}
              onClick={() => handleUpdateStatus("approved")}
            >
              Approve
            </Button>
            <Button danger size="small" loading={isUpdatingRequest} onClick={() => handleUpdateStatus("rejected")}>
              Reject
            </Button>
          </div>
        );
      },
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

      <div style={{ marginTop: 32 }}>
        <Title level={4} style={{ marginBottom: 8 }}>
          Ownership Requests
        </Title>
        <Text type="secondary" style={{ fontSize: 13 }}>
          Review pending access requests and approve or reject them.
        </Text>
        <Table
          style={{ marginTop: 12 }}
          rowKey={(record) => record._id}
          loading={isOwnershipRequestsLoading}
          columns={ownershipRequestColumns}
          dataSource={ownershipRequests}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          scroll={{ x: 800 }}
        />
      </div>

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
