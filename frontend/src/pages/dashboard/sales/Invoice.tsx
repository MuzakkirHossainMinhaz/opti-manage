import { ArrowLeftOutlined } from "@ant-design/icons";
import { PDFViewer } from "@react-pdf/renderer";
import { Alert, Button, Spin, theme } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useGetSaleByIdQuery } from "../../../redux/features/sales/salesApi";
import InvoiceDocument from "./InvoiceDocument";

const InvoicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: saleData, isLoading, isError, error } = useGetSaleByIdQuery(id);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <div
      style={{
        padding: "20px",
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
        boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        border: "none",
        height: "calc(100vh - 100px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} shape="circle" />
        <span style={{ fontSize: "18px", fontWeight: 600 }}>Invoice Preview</span>
      </div>

      {isError && (
        <Alert
          type="error"
          showIcon
          message="Unable to load invoice"
          description={
            (error as any)?.data?.message === "You do not have permission to view this sale"
              ? "You are not allowed to view this invoice."
              : (error as any)?.data?.message || "Something went wrong while loading the invoice."
          }
          style={{ marginBottom: 16 }}
        />
      )}

      {isLoading ? (
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Spin size="large" tip="Loading invoice..." />
        </div>
      ) : (
        <PDFViewer style={{ width: "100%", flex: 1, border: "none", borderRadius: "8px" }}>
          <InvoiceDocument sale={saleData?.data} />
        </PDFViewer>
      )}
    </div>
  );
};

export default InvoicePage;
