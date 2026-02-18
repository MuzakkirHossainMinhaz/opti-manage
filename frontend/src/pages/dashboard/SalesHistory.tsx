/* eslint-disable no-case-declarations */
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import { PDFDownloadLink } from "@react-pdf/renderer";
import type { InputRef, TableColumnType, TableColumnsType, TableProps } from "antd";
import { Button, Input, Select, Space, Table, Typography, theme } from "antd";
import { FilterDropdownProps } from "antd/es/table/interface";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useGetAllSalesQuery } from "../../redux/features/sales/salesApi";
import InvoiceDocument from "./sales/InvoiceDocument";

type TDataType = {
  _id: string;
  productId: {
    name: string;
    price: number;
    brand?: string;
    color?: string;
    [key: string]: any;
  };
  quantity: number;
  buyerName: string;
  saleDate: string;
  sellerId: string;
  [key: string]: any;
};

type OnChange = NonNullable<TableProps<TDataType>["onChange"]>;
type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

const { Title, Text } = Typography;

const SalesHistory: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});
  const [salesData, setSalesData] = useState<TDataType[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const { data, isLoading } = useGetAllSalesQuery({
    page: pagination.current,
    limit: pagination.pageSize,
  });

  const handleSearch = (selectedKeys: string[], confirm: FilterDropdownProps["confirm"], dataIndex: string) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleChange: OnChange = (tablePagination, _filters, sorter) => {
    setSortedInfo(sorter as Sorts);
    setPagination({
      current: tablePagination.current || 1,
      pageSize: tablePagination.pageSize || 10,
    });
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const getColumnSearchProps = (dataIndex: string): TableColumnType<TDataType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8, width: 250 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns: TableColumnsType<TDataType> = [
    {
      title: "Buyer Name",
      dataIndex: "buyerName",
      ...getColumnSearchProps("buyerName"),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
      sortOrder: sortedInfo.columnKey === "quantity" ? sortedInfo.order : null,
    },
    {
      title: "Sell Date",
      dataIndex: "saleDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Download Invoice",
      render: (_, record) => {
        return (
          <PDFDownloadLink document={<InvoiceDocument sale={record} />} fileName={`invoice-${record._id}.pdf`}>
            {() => (
              <Button size="small" shape="round" icon={<DownloadOutlined />}>
                Download
              </Button>
            )}
          </PDFDownloadLink>
        );
      },
    },
  ];

  const onCategoryChange = (value: string) => {
    const currentDate = new Date();

    let filteredData: TDataType[] = [...(data?.data || [])];

    // Define the date range based on the selected category
    switch (value) {
      case "weekly":
        // Filter data for the current week
        const startOfWeek = new Date(currentDate);
        startOfWeek.setHours(0, 0, 0, 0); // Set to the beginning of the day
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Go back to the start of the week
        filteredData = filteredData.filter((sale) => new Date(sale.saleDate) >= startOfWeek);
        break;

      case "daily":
        // Filter data for the current day
        const startOfDay = new Date(currentDate);
        startOfDay.setHours(0, 0, 0, 0); // Set to the beginning of the day
        filteredData = filteredData.filter((sale) => new Date(sale.saleDate) >= startOfDay);
        break;

      case "monthly":
        // Filter data for the current month
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        filteredData = filteredData.filter((sale) => new Date(sale.saleDate) >= startOfMonth);
        break;

      case "yearly":
        // Filter data for the current year
        const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
        filteredData = filteredData.filter((sale) => new Date(sale.saleDate) >= startOfYear);
        break;

      default:
        // No filter applied for unknown category
        break;
    }

    // Update the salesData state with the filtered data
    setSalesData(filteredData);
  };

  useEffect(() => {
    if (data?.data) {
      onCategoryChange("weekly");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const hasSelected = selectedRowKeys.length > 0;

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
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div>
          <Title level={3} style={{ margin: 0 }}>
            Sales History
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Review past sales and download invoices. Filter by time period.
          </Text>
          <div style={{ marginTop: 8 }}>
            <Text style={{ fontSize: 12 }}>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}</Text>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "center",
          }}
        >
          <div>Total Sales: {data?.meta?.total || salesData.length || 0}</div>
          <Space>
            <span style={{ fontWeight: 500 }}>Categorized By:</span>
            <Select
              style={{ width: 120 }}
              placeholder="Select an option"
              onChange={onCategoryChange}
              defaultValue={"weekly"}
              options={[
                {
                  label: "All Time",
                  value: "all",
                },
                {
                  label: "Daily",
                  value: "daily",
                },
                {
                  label: "Weekly",
                  value: "weekly",
                },
                {
                  label: "Monthly",
                  value: "monthly",
                },
                {
                  label: "Yearly",
                  value: "yearly",
                },
              ]}
            />
          </Space>
        </div>
      </div>
      <Table
        rowSelection={rowSelection}
        loading={isLoading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: data?.meta?.total || 0,
          showSizeChanger: true,
        }}
        rowKey={(record) => record._id}
        columns={columns}
        dataSource={salesData}
        onChange={handleChange}
        scroll={{ x: 800 }}
      />
    </div>
  );
};

export default SalesHistory;
