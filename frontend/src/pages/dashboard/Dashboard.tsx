import { DollarCircleOutlined, RiseOutlined, ShoppingOutlined, TagOutlined } from "@ant-design/icons";
import { Card, Col, Row, Spin, Statistic, Table, theme } from "antd";
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
import { useGetAllEyeGlassesQuery } from "../../redux/features/eyeGlass/eyeGlassApi";
import { useGetAllSalesQuery } from "../../redux/features/sales/salesApi";

const DashboardHome = () => {
  const {
    token: { borderRadiusLG, colorPrimary, colorSuccess, colorWarning },
  } = theme.useToken();

  // Fetch data
  const { data: salesData, isLoading: isSalesLoading } = useGetAllSalesQuery(undefined);
  const { data: productsData, isLoading: isProductsLoading } = useGetAllEyeGlassesQuery({ limit: 10000 });

  if (isSalesLoading || isProductsLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <Spin size="large" />
      </div>
    );
  }

  const sales = salesData?.data || [];
  const products = productsData?.data || [];

  // Calculate Statistics
  const totalRevenue = sales.reduce((acc: number, curr: any) => acc + (curr.quantity * curr.productPrice || 0), 0);
  const totalSalesCount = sales.length;
  const totalProducts = productsData?.meta?.total || products.length;
  const totalInventoryValue = products.reduce((acc: number, curr: any) => acc + (curr.quantity * curr.price || 0), 0);

  // Prepare Chart Data: Revenue over Time (last 7 days or all time grouped by date)
  const salesByDate = sales.reduce((acc: any, curr: any) => {
    const date = new Date(curr.saleDate).toLocaleDateString();
    if (!acc[date]) acc[date] = 0;
    acc[date] += curr.quantity * curr.productPrice || 0;
    return acc;
  }, {});

  const revenueChartData = Object.keys(salesByDate)
    .map((date) => ({
      date,
      revenue: salesByDate[date],
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort by date

  // Prepare Chart Data: Sales by Brand (Top 5)
  // Note: Assuming sale object has product info or we can map productId to product brand
  // If sale object doesn't have brand, we might skip this or use something else.
  // Checking typical response: usually populated. If not, we use mock or skip.
  // Let's assume generic "Product" for now if brand missing.

  // Recent Sales Table Data
  const recentSales = [...sales]
    .sort((a: any, b: any) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime())
    .slice(0, 5);

  const columns = [
    {
      title: "Buyer Name",
      dataIndex: "buyerName",
      key: "buyerName",
    },
    {
      title: "Product",
      dataIndex: "productName", // Assuming populated
      key: "productName",
      render: (text: string) => text || "N/A",
    },
    {
      title: "Date",
      dataIndex: "saleDate",
      key: "saleDate",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Amount",
      key: "amount",
      render: (_: any, record: any) => `$${(record.quantity * record.productPrice).toFixed(2)}`,
    },
  ];

  // Colors for Pie Chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Top Statistics Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)", borderRadius: borderRadiusLG }}>
            <Statistic
              title="Total Revenue"
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
              title="Total Sales"
              value={totalSalesCount}
              valueStyle={{ color: colorPrimary }}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)", borderRadius: borderRadiusLG }}>
            <Statistic
              title="Total Products"
              value={totalProducts}
              valueStyle={{ color: "#1890ff" }}
              prefix={<TagOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)", borderRadius: borderRadiusLG }}>
            <Statistic
              title="Inventory Value"
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
            title="Revenue Trend"
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
          <Card
            title="Sales Distribution"
            bordered={false}
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)", borderRadius: borderRadiusLG, height: "100%" }}
          >
            <div
              style={{ height: 300, width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
            >
              {/* Using a simple Pie chart for demo, ideally grouped by category/brand */}
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Sales", value: totalSalesCount },
                      { name: "Inventory", value: totalProducts },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {/* Just generic colors for now */}
                    <Cell key="cell-0" fill={COLORS[0]} />
                    <Cell key="cell-1" fill={COLORS[1]} />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Sales Table */}
      <Card
        title="Recent Sales"
        bordered={false}
        style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)", borderRadius: borderRadiusLG }}
      >
        <Table columns={columns} dataSource={recentSales} rowKey="_id" pagination={false} scroll={{ x: true }} />
      </Card>
    </div>
  );
};

export default DashboardHome;
