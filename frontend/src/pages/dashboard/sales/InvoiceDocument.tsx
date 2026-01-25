import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 12,
    color: "#333",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 20,
  },
  brand: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1677ff", // Ant Design primary color
  },
  invoiceTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#555",
  },
  invoiceMeta: {
    marginTop: 10,
    flexDirection: "column",
    alignItems: "flex-end",
  },
  metaItem: {
    flexDirection: "row",
    marginBottom: 4,
  },
  metaLabel: {
    fontWeight: "bold",
    marginRight: 8,
    color: "#777",
  },
  billTo: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#555",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 4,
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e8e8e8",
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 20,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableColHeader: {
    width: "25%",
    borderStyle: "solid",
    borderColor: "#e8e8e8",
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    backgroundColor: "#f9f9f9",
    padding: 8,
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderColor: "#e8e8e8",
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    padding: 8,
  },
  tableCellHeader: {
    margin: "auto",
    fontSize: 10,
    fontWeight: "bold",
    color: "#555",
  },
  tableCell: {
    margin: "auto",
    fontSize: 10,
  },
  totalSection: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  totalRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 8,
    width: "40%",
    justifyContent: "space-between",
  },
  totalLabel: {
    fontWeight: "bold",
    fontSize: 14,
  },
  totalValue: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#1677ff",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 10,
    color: "#999",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
});

interface InvoiceDocumentProps {
  sale: {
    _id: string;
    buyerName: string;
    quantity: number;
    saleDate: string;
    productId: {
      name: string;
      price: number;
      brand?: string;
      color?: string;
    };
  };
}

const InvoiceDocument = ({ sale }: InvoiceDocumentProps) => {
  const buyerName = sale?.buyerName || "N/A";
  const quantity = sale?.quantity || 0;
  const productName = sale?.productId?.name || "Unknown Product";
  const unitPrice = sale?.productId?.price || 0;
  const saleDate = sale?.saleDate ? new Date(sale.saleDate).toLocaleDateString() : new Date().toLocaleDateString();
  const invoiceId = sale?._id ? sale._id.slice(-6).toUpperCase() : "000000";

  const totalAmount = (quantity * unitPrice).toFixed(2);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>Opti Manage</Text>
            <Text style={{ fontSize: 10, color: "#777", marginTop: 4 }}>Vision for the Future</Text>
          </View>
          <View style={styles.invoiceMeta}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Invoice #:</Text>
              <Text>{invoiceId}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Date:</Text>
              <Text>{saleDate}</Text>
            </View>
          </View>
        </View>

        {/* Bill To */}
        <View style={styles.billTo}>
          <Text style={styles.sectionTitle}>Bill To:</Text>
          <Text style={{ fontSize: 14, marginBottom: 4 }}>{buyerName}</Text>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={{ ...styles.tableColHeader, width: "40%" }}>
              <Text style={styles.tableCellHeader}>Item Description</Text>
            </View>
            <View style={{ ...styles.tableColHeader, width: "20%" }}>
              <Text style={styles.tableCellHeader}>Quantity</Text>
            </View>
            <View style={{ ...styles.tableColHeader, width: "20%" }}>
              <Text style={styles.tableCellHeader}>Unit Price</Text>
            </View>
            <View style={{ ...styles.tableColHeader, width: "20%" }}>
              <Text style={styles.tableCellHeader}>Total</Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={{ ...styles.tableCol, width: "40%" }}>
              <Text style={styles.tableCell}>{productName}</Text>
              {sale?.productId?.brand && (
                <Text style={{ fontSize: 8, color: "#777", marginTop: 2 }}>Brand: {sale.productId.brand}</Text>
              )}
            </View>
            <View style={{ ...styles.tableCol, width: "20%" }}>
              <Text style={styles.tableCell}>{quantity}</Text>
            </View>
            <View style={{ ...styles.tableCol, width: "20%" }}>
              <Text style={styles.tableCell}>${unitPrice.toFixed(2)}</Text>
            </View>
            <View style={{ ...styles.tableCol, width: "20%" }}>
              <Text style={styles.tableCell}>${totalAmount}</Text>
            </View>
          </View>
        </View>

        {/* Total */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Grand Total:</Text>
            <Text style={styles.totalValue}>${totalAmount}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Thank you for your business!</Text>
          <Text style={{ marginTop: 4 }}>© 2026 Opti Manage · All rights reserved.</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoiceDocument;
