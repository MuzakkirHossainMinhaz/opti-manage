/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CopyOutlined,
  DeleteOutlined,
  FilterOutlined,
  PlusCircleOutlined,
  RetweetOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePickerProps,
  Input,
  InputRef,
  Space,
  Table,
  TableColumnType,
  TableColumnsType,
  TableProps,
  Tooltip,
  theme,
} from "antd";
import { FilterDropdownProps } from "antd/es/table/interface";
import React, { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import EyeGlassModal from "../../components/eyeGlass/EyeGlassModal";
import FilterEyeGlassModal from "../../components/eyeGlass/FilterEyeGlassModal";
import SellEyeGlassModal from "../../components/eyeGlass/SellEyeGlassModal";
import { selectCurrentUser } from "../../redux/features/auth/authSlice";
import {
  useDeleteAllEyeGlassesMutation,
  useDeleteEyeGlassMutation,
  useGetAllEyeGlassesQuery,
} from "../../redux/features/eyeGlass/eyeGlassApi";
import { useCreateSalesMutation } from "../../redux/features/sales/salesApi";
import { useAppSelector } from "../../redux/hooks";

type OnChange = NonNullable<TableProps<any>["onChange"]>;
type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

const EyeGlasses: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [deleteEyeGlass, { isLoading: isDeleting }] = useDeleteEyeGlassMutation();
  const [deleteAllEyeGlasses, { isLoading: isDeletingAll }] = useDeleteAllEyeGlassesMutation();
  const [filters, setFilters] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const user = useAppSelector(selectCurrentUser);
  const [productId, setProductId] = useState("");
  const [date, setDate] = useState("");
  const [createSales, { isLoading: isSalesCreating }] = useCreateSalesMutation();
  const [quantity, setQuantity] = useState(0);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [saleData, setSaleData] = useState<any>(null);
  const [isEyeGlassModalOpen, setIsEyeGlassModalOpen] = useState(false);
  const [eyeGlassModalMode, setEyeGlassModalMode] = useState<"add" | "update" | "duplicate">("add");
  const [selectedEyeGlass, setSelectedEyeGlass] = useState<any>(null);

  // eye-glass modal handlers
  const showAddModal = () => {
    setEyeGlassModalMode("add");
    setSelectedEyeGlass(null);
    setIsEyeGlassModalOpen(true);
  };

  const showUpdateModal = (record: any) => {
    setEyeGlassModalMode("update");
    setSelectedEyeGlass(record);
    setIsEyeGlassModalOpen(true);
  };

  const showDuplicateModal = (record: any) => {
    setEyeGlassModalMode("duplicate");
    setSelectedEyeGlass(record);
    setIsEyeGlassModalOpen(true);
  };

  // sell eye-glass handler
  const handleSell = async (data: FieldValues) => {
    const toastId = toast.loading("Selling eye-glass...");

    const sale = {
      productId,
      ...data,
      saleDate: date,
      sellerId: user?._id,
    };

    if (data.quantity > quantity) {
      toast.error("Insufficient quantity.", { id: toastId });
      return;
    }

    if (data.buyerName.trim() === "") {
      toast.error("Please enter the name of the buyer.", { id: toastId });
      return;
    }

    if (!date) {
      toast.error("Please select a date for the sale.", { id: toastId });
      return;
    }

    try {
      const response = await createSales(sale).unwrap();
      setSaleData(response?.data);
      toast.success("Successfully sold.", { id: toastId });
    } catch (error) {
      toast.error("Failed to sell eye-glass.", { id: toastId });
      return;
    }
  };

  // date for sell modal
  const onDateChange: DatePickerProps["onChange"] = (_date, dateString) => {
    setDate(dateString as string);
  };

  // for sell modal
  const showIsSellModal = (id: string, quantity: number) => {
    setIsSellModalOpen(true);
    setProductId(id);
    setQuantity(quantity);
  };

  const closeIsSellModal = () => {
    setIsSellModalOpen(false);
    setProductId("");
    setDate("");
    setSaleData(null);
  };

  // for filter in table
  const handleSearch = (selectedKeys: string[], confirm: FilterDropdownProps["confirm"], dataIndex: any) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  // for filter in table
  const handleChange: OnChange = (pagination, _filters, sorter) => {
    setPagination({
      current: pagination.current || 1,
      pageSize: pagination.pageSize || 10,
    });
    setSortedInfo(sorter as Sorts);
  };

  // for filter in table
  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  // for filter in table
  const showModal = () => {
    setIsModalOpen(true);
  };

  // fetch data
  const { data, isLoading } = useGetAllEyeGlassesQuery({
    ...filters,
    page: pagination.current,
    limit: pagination.pageSize,
  });

  // select from table to delete
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // product delete handler
  const handleDelete = async () => {
    const toastId = toast.loading("Deleting...");

    if (selectedRowKeys.length === 0) {
      toast.error("Please select at least one item to delete.", {
        id: toastId,
      });
      return;
    }

    try {
      await deleteEyeGlass(selectedRowKeys);
      toast.success("Successfully Deleted.", { id: toastId });
      setSelectedRowKeys([]);
    } catch (error) {
      toast.error("Failed to delete.", { id: toastId });
      return;
    }
  };

  // all / bulk delete handler
  const handleAllDelete = async () => {
    const toastId = toast.loading("Deleting all items...");

    try {
      await deleteAllEyeGlasses(undefined);
      toast.success("Successfully Deleted.", {
        id: toastId,
        duration: 2000,
      });
    } catch (error) {
      toast.error("Failed to delete.", { id: toastId });
    }
  };

  // for filter
  const getColumnSearchProps = (dataIndex: any): TableColumnType<any> => ({
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

  // table columns
  const columns: TableColumnsType<any> = [
    {
      title: "Name",
      dataIndex: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
      sortOrder: sortedInfo.columnKey === "quantity" ? sortedInfo.order : null,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      sortOrder: sortedInfo.columnKey === "price" ? sortedInfo.order : null,
    },
    {
      title: "Frame Material",
      dataIndex: "frameMaterial",
    },
    {
      title: "Frame Shape",
      dataIndex: "frameShape",
    },
    {
      title: "Temple Type",
      dataIndex: "templeType",
    },
    {
      title: "Lens Type",
      dataIndex: "lensType",
    },
    {
      title: "Brand",
      dataIndex: "brand",
    },
    {
      title: "Gender",
      dataIndex: "gender",
    },
    {
      title: "Action",
      render: (_: any, record: any) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: "15px",
            fontWeight: "600",
          }}
        >
          <Tooltip title="Update">
            <Button shape="circle" size="small" icon={<RetweetOutlined />} onClick={() => showUpdateModal(record)} />
          </Tooltip>
          <Tooltip title="Create Variant">
            <Button shape="circle" size="small" icon={<CopyOutlined />} onClick={() => showDuplicateModal(record)} />
          </Tooltip>
          <Tooltip title="Sell">
            <Button
              shape="circle"
              size="small"
              icon={<ShoppingCartOutlined />}
              onClick={() => showIsSellModal(record._id, record.quantity)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

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
        <div
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "center",
          }}
        >
          <Button
            danger
            type="primary"
            onClick={handleAllDelete}
            icon={<DeleteOutlined />}
            loading={isLoading || isDeletingAll}
          >
            Bulk Delete
          </Button>
          <Button
            danger
            onClick={handleDelete}
            icon={<DeleteOutlined />}
            disabled={!hasSelected}
            loading={isLoading || isDeleting}
          >
            Delete
          </Button>
          <span>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}</span>
        </div>
        <div
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "center",
          }}
        >
          <div>
            <p>Total items: {data?.meta?.total}</p>
          </div>
          <Button type="default" icon={<FilterOutlined />} iconPosition="start" onClick={showModal}>
            Filter
          </Button>
          <Button type="primary" onClick={showAddModal} icon={<PlusCircleOutlined />} loading={isLoading}>
            Add Item
          </Button>
        </div>
      </div>

      {/* show all eye glasses */}
      <Table
        rowSelection={rowSelection}
        loading={isLoading}
        bordered
        rowKey={(record) => record._id}
        columns={columns}
        dataSource={data?.data || []}
        onChange={handleChange}
        scroll={{ x: 1000 }}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: data?.meta?.total || 0,
          showSizeChanger: true,
        }}
      />

      <FilterEyeGlassModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} setFilters={setFilters} />

      <SellEyeGlassModal
        isOpen={isSellModalOpen}
        onClose={closeIsSellModal}
        onSubmit={handleSell}
        onDateChange={onDateChange}
        isLoading={isSalesCreating}
        saleData={saleData}
        defaultQuantity={quantity}
      />

      <EyeGlassModal
        isOpen={isEyeGlassModalOpen}
        onClose={() => setIsEyeGlassModalOpen(false)}
        mode={eyeGlassModalMode}
        initialData={selectedEyeGlass}
        eyeGlassId={selectedEyeGlass?._id}
      />
    </div>
  );
};

export default EyeGlasses;
