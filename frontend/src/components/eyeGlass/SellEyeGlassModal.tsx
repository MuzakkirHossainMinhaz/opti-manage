import { DownloadOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button, DatePicker, DatePickerProps, Modal } from "antd";
import { FieldValues } from "react-hook-form";
import InvoiceDocument from "../../pages/dashboard/sales/InvoiceDocument";
import Form from "../form/Form";
import MyInput from "../form/Input";

interface SellEyeGlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FieldValues) => Promise<void>;
  onDateChange: DatePickerProps["onChange"];
  isLoading: boolean;
  saleData: any;
  defaultQuantity?: number;
}

const SellEyeGlassModal = ({
  isOpen,
  onClose,
  onSubmit,
  onDateChange,
  isLoading,
  saleData,
  defaultQuantity,
}: SellEyeGlassModalProps) => {
  return (
    <Modal
      title={
        <p
          className="my-font"
          style={{
            fontSize: "18px",
            fontWeight: "600",
            paddingBottom: "12px",
            borderBottom: "2px solid #e5e5e5",
            color: "#1f1f1f",
          }}
        >
          Sell Eye Glass
        </p>
      }
      centered
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnClose
      maskClosable={false}
    >
      <Form onSubmit={onSubmit} defaultValues={{ quantity: defaultQuantity }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 15,
            marginTop: 20,
          }}
        >
          <MyInput type="number" label="Quantity:" name="quantity" required />
          <MyInput type="text" label="Name of Buyer:" name="buyerName" required />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <label
              className="my-font"
              style={{
                fontWeight: "600",
                fontSize: "15px",
              }}
              htmlFor="saleDate"
            >
              Date of Sell:
            </label>
            <DatePicker onChange={onDateChange} style={{ width: "100%" }} />
          </div>

          <div className="responsive-flex">
            {!saleData && (
              <Button
                className="my-font"
                style={{
                  fontSize: "15px",
                  fontWeight: "600",
                  height: "37px",
                  marginTop: "4px",
                  width: "100%",
                }}
                type="primary"
                htmlType="submit"
                icon={<ShoppingCartOutlined />}
                loading={isLoading}
              >
                Sell
              </Button>
            )}
            {saleData && (
              <PDFDownloadLink
                document={<InvoiceDocument sale={saleData} />}
                fileName={`invoice-${saleData._id}.pdf`}
                style={{ width: "100%" }}
              >
                {({ loading }) => (
                  <Button
                    className="my-font"
                    style={{
                      fontSize: "15px",
                      fontWeight: "600",
                      height: "37px",
                      marginTop: "4px",
                      width: "100%",
                    }}
                    type="primary"
                    variant="filled"
                    color="orange"
                    icon={<DownloadOutlined />}
                    loading={loading}
                  >
                    Download Invoice
                  </Button>
                )}
              </PDFDownloadLink>
            )}
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default SellEyeGlassModal;
