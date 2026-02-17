import { DollarCircleOutlined, RiseOutlined, ShoppingOutlined, TagOutlined } from "@ant-design/icons";
import { Card, Col, Row, Spin, Statistic, Table, Tag, theme, Typography } from "antd";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { selectCurrentUser } from "../../redux/features/auth/authSlice";
import { useGetDashboardStatsQuery } from "../../redux/features/dashboard/dashboardApi";
import { useAppSelector } from "../../redux/hooks";

const { Title, Text } = Typography;

const DashboardHome = () => {
  const {
    token: { borderRadiusLG, colorPrimary, colorSuccess, colorWarning, colorBgContainer },
  } = theme.useToken();
  const currentUser = useAppSelector(selectCurrentUser);

  const { data, isLoading } = useGetDashboardStatsQuery(undefined);

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <Spin size="large" />
      </div>
    );
  }

  const stats = data?.data || {};

  const isManager = currentUser?.role === "manager";

  const totalRevenue = stats.totalRevenue || 0;
  const totalSalesCount = isManager ? stats.totalSales || 0 : stats.todaySalesCount || 0;
  const totalProducts = isManager ? stats.totalProducts || 0 : stats.recentlyAddedItems?.length || 0;
  const totalInventoryValue = isManager ? stats.inventoryValue || 0 : stats.todayRevenue || 0;

  const revenueChartData = (stats.recentSales || []).map((sale: any) => ({
    date: sale.saleDate ? new Date(sale.saleDate).toLocaleDateString() : "",
    revenue: (sale.quantity || 0) * (sale.productPrice || sale.productId?.price || 0),
  }));

  const columns = [
    {
      title: "Buyer Name",
      dataIndex: "buyerName",
      key: "buyerName",
    },
    {
      title: isManager ? "Product" : "Product",
      dataIndex: ["productId", "name"],
      key: "productName",
      render: (_value: string, record: any) => record.productId?.name || record.productName || "N/A",
    },
    {
      title: "Date",
      dataIndex: "saleDate",
      key: "saleDate",
      render: (date: string) => (date ? new Date(date).toLocaleDateString() : "N/A"),
    },
    {
      title: "Amount",
      key: "amount",
      render: (_: any, record: any) =>
        `$${((record.quantity || 0) * (record.productPrice || record.productId?.price || 0)).toFixed(2)}`,
    },
  ];

  // Colors for Pie Chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "20px",
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
        boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        border: "none",
      }}
    >
      <div style={{ marginBottom: 8 }}>
        <Title level={3} style={{ margin: 0 }}>
          {isManager ? "Manager Dashboard" : "My Performance"}
        </Title>
        <Text type="secondary" style={{ fontSize: 13 }}>
          {isManager
            ? "Global statistics across the practice."
            : "Your recent sales performance and inventory contributions."}
        </Text>
      </div>

      {/* Top Statistics Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)", borderRadius: borderRadiusLG }}>
            <Statistic
              title={isManager ? "Total Revenue" : "My Total Revenue"}
              value={totalRevenue}
              precision={2}
              valueStyle={{ color: colorSuccess }}
              prefix={<DollarCircleOutlined />}
              suffix="$"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)", borderRadius: borderRadiusLG }}>
            <Statistic
              title={isManager ? "Total Sales" : "My Sales Today"}
              value={totalSalesCount}
              valueStyle={{ color: colorPrimary }}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)", borderRadius: borderRadiusLG }}>
            <Statistic
              title={isManager ? "Total Products" : "My Recently Added Items"}
              value={totalProducts}
              valueStyle={{ color: "#1890ff" }}
              prefix={<TagOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)", borderRadius: borderRadiusLG }}>
            <Statistic
              title={isManager ? "Inventory Value" : "My Revenue Today"}
              value={totalInventoryValue}
              precision={2}
              valueStyle={{ color: colorWarning }}
              prefix={<RiseOutlined />}
              suffix="$"
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card
            title={isManager ? "Revenue Trend" : "My Recent Revenue"}
            bordered={false}
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)", borderRadius: borderRadiusLG, height: "100%" }}
          >
            <div style={{ height: 300, width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke={colorPrimary} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          {isManager ? (
            <Card
              title="Top Performing Staff"
              bordered={false}
              style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)", borderRadius: borderRadiusLG, height: "100%" }}
            >
              <div
                style={{ height: 300, width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={(stats.salesByUser || []).map((item: any) => ({
                        name: item.username || "Unknown",
                        value: item.revenue,
                      }))}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {(stats.salesByUser || []).map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          ) : (
            <Card
              title="My Goals"
              bordered={false}
              style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)", borderRadius: borderRadiusLG, height: "100%" }}
            >
              <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Text>Daily Sales Goal</Text>
                  <Tag color="blue">10</Tag>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Text>Sales Today</Text>
                  <Tag color={stats.todaySalesCount >= 10 ? "green" : "orange"}>{stats.todaySalesCount || 0}</Tag>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Text>Revenue Goal</Text>
                  <Tag color="blue">$1000</Tag>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Text>Revenue Today</Text>
                  <Tag color={stats.todayRevenue >= 1000 ? "green" : "orange"}>
                    ${stats.todayRevenue?.toFixed(2) || "0.00"}
                  </Tag>
                </div>
              </div>
            </Card>
          )}
        </Col>
      </Row>

      {/* Recent Sales / Items Table */}
      <Card
        title={isManager ? "Recent Sales" : "My Recent Sales"}
        bordered={false}
        style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)", borderRadius: borderRadiusLG }}
      >
        <Table
          columns={columns}
          dataSource={stats.recentSales || []}
          rowKey="_id"
          pagination={false}
          scroll={{ x: true }}
        />
      </Card>

      {!isManager && (
        <Card
          title="My Recently Added Items"
          bordered={false}
          style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)", borderRadius: borderRadiusLG }}
        >
          <Table
            columns={[
              { title: "Name", dataIndex: "name", key: "name" },
              { title: "Brand", dataIndex: "brand", key: "brand" },
              { title: "Quantity", dataIndex: "quantity", key: "quantity" },
              { title: "Price", dataIndex: "price", key: "price" },
            ]}
            dataSource={stats.recentlyAddedItems || []}
            rowKey="_id"
            pagination={false}
            scroll={{ x: true }}
          />
        </Card>
      )}
    </div>
  );
};

export default DashboardHome;
