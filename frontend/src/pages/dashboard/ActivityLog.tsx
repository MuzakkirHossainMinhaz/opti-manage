import { Alert, Table, Tag, theme } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useGetActivityLogsQuery } from "../../redux/features/activityLog/activityLogApi";
import { useAppSelector } from "../../redux/hooks";
import { selectCurrentUser } from "../../redux/features/auth/authSlice";

type TActivityLog = {
  _id: string;
  action: "LOGIN" | "CREATE" | "UPDATE" | "DELETE";
  target: string;
  timestamp: string;
  user: {
    _id: string;
    username: string;
    role: string;
  };
};

const ActivityLog = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const currentUser = useAppSelector(selectCurrentUser);
  const { data, isLoading, isError, error } = useGetActivityLogsQuery(undefined);

  if (currentUser?.role !== "manager") {
    return (
      <Alert
        type="error"
        showIcon
        message="Access denied"
        description="Only managers can view the activity log."
        style={{ marginTop: 16 }}
      />
    );
  }

  const logs: TActivityLog[] = data?.data || [];

  const columns: ColumnsType<TActivityLog> = [
    {
      title: "Time",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (value: string) => new Date(value).toLocaleString(),
    },
    {
      title: "User",
      dataIndex: ["user", "username"],
      key: "user",
    },
    {
      title: "Role",
      dataIndex: ["user", "role"],
      key: "role",
      render: (role: string) => (
        <Tag color={role === "manager" ? "blue" : "green"} style={{ textTransform: "capitalize" }}>
          {role}
        </Tag>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (action: TActivityLog["action"]) => {
        const color =
          action === "DELETE" ? "red" : action === "UPDATE" ? "gold" : action === "CREATE" ? "green" : "default";
        return (
          <Tag color={color} style={{ fontWeight: 600 }}>
            {action}
          </Tag>
        );
      },
    },
    {
      title: "Details",
      dataIndex: "target",
      key: "target",
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
      {isError && (
        <Alert
          type="error"
          showIcon
          message="Failed to load activity log"
          description={(error as any)?.data?.message || "Something went wrong while fetching activity logs."}
          style={{ marginBottom: 16 }}
        />
      )}
      <Table
        rowKey={(record) => record._id}
        loading={isLoading}
        columns={columns}
        dataSource={logs}
        pagination={{ pageSize: 20, showSizeChanger: true }}
        scroll={{ x: 800 }}
      />
    </div>
  );
};

export default ActivityLog;

