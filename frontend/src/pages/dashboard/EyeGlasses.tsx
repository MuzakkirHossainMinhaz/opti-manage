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
  Modal,
  Select,
  Space,
  Table,
  TableColumnType,
  TableColumnsType,
  TableProps,
  Tooltip,
  Typography,
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
  useDeleteEyeGlassMutation,
  useGetAllEyeGlassesQuery,
  useReassignEyeGlassOwnerMutation,
} from "../../redux/features/eyeGlass/eyeGlassApi";
import { useCreateOwnershipRequestMutation } from "../../redux/features/ownershipRequest/ownershipRequestApi";
import { useCreateSalesMutation } from "../../redux/features/sales/salesApi";
import { useGetUsersQuery } from "../../redux/features/user/userApi";
import { useAppSelector } from "../../redux/hooks";

type OnChange = NonNullable<TableProps<any>["onChange"]>;
type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

const { Title, Text } = Typography;

const EyeGlasses: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [deleteEyeGlass, { isLoading: isDeleting }] = useDeleteEyeGlassMutation();
  const [filters, setFilters] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [productId, setProductId] = useState("");
  const [date, setDate] = useState("");
  const [createSales, { isLoading: isSalesCreating }] = useCreateSalesMutation();
  const [quantity, setQuantity] = useState(0);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [saleData, setSaleData] = useState<any>(null);
  const [isEyeGlassModalOpen, setIsEyeGlassModalOpen] = useState(false);
  const [eyeGlassModalMode, setEyeGlassModalMode] = useState<"add" | "update" | "duplicate">("add");
  const [selectedEyeGlass, setSelectedEyeGlass] = useState<any>(null);
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
  const [eyeGlassForReassign, setEyeGlassForReassign] = useState<any | null>(null);
  const [newOwnerId, setNewOwnerId] = useState<string | undefined>(undefined);
  const [requestingEyeGlassId, setRequestingEyeGlassId] = useState<string | null>(null);
  const [createOwnershipRequest, { isLoading: isRequestCreating }] = useCreateOwnershipRequestMutation();
  const [reassignEyeGlassOwner, { isLoading: isReassigning }] = useReassignEyeGlassOwnerMutation();
  const { data: usersData, isLoading: isUsersLoading } = useGetUsersQuery(undefined, {
    refetchOnMountOrArgChange: false,
  } as any);
  const user = useAppSelector(selectCurrentUser);

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
    } catch (error: any) {
      const message = error?.data?.message || "Failed to sell eye-glass.";
      toast.error(message, { id: toastId });
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

  const handleRequestAccess = async (eyeGlassId: string) => {
    setRequestingEyeGlassId(eyeGlassId);
    const toastId = toast.loading("Requesting access...");

    try {
      await createOwnershipRequest({ eyeGlassId }).unwrap();
      toast.success("Access request sent to owner and manager.", { id: toastId });
    } catch (error: any) {
      const message = error?.data?.message || "Failed to request access.";
      toast.error(message, { id: toastId });
    } finally {
      setRequestingEyeGlassId(null);
    }
  };

  const openReassignModal = (record: any) => {
    setEyeGlassForReassign(record);
    setNewOwnerId(undefined);
    setIsReassignModalOpen(true);
  };

  const handleReassignConfirm = async () => {
    if (!eyeGlassForReassign || !newOwnerId) {
      toast.error("Please select a new owner.");
      return;
    }

    const toastId = toast.loading("Reassigning ownership...");

    try {
      await reassignEyeGlassOwner({ eyeGlassId: eyeGlassForReassign._id, newOwnerId }).unwrap();
      toast.success("Ownership reassigned successfully.", { id: toastId });
      setIsReassignModalOpen(false);
      setEyeGlassForReassign(null);
      setNewOwnerId(undefined);
    } catch (error: any) {
      const message = error?.data?.message || "Failed to reassign ownership.";
      toast.error(message, { id: toastId });
    }
  };

  // product delete handler
  const handleDelete = () => {
    if (selectedRowKeys.length === 0) {
      toast.error("Please select at least one item to delete.");
      return;
    }

    Modal.confirm({
      title: (
        <p
          className="my-font"
          style={{
            fontSize: "18px",
            fontWeight: "600",
            paddingBottom: "12px",
            borderBottom: "2px solid #e5e5e5",
            color: "#1f1f1f",
            margin: 0,
          }}
        >
          Delete Selected Eye Glasses
        </p>
      ),
      content: (
        <p
          style={{
            marginTop: 16,
            fontSize: "14px",
          }}
        >
          Are you sure you want to delete {selectedRowKeys.length} selected item(s)? This action cannot be undone.
        </p>
      ),
      icon: null,
      centered: true,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      maskClosable: false,
      okButtonProps: {
        className: "my-font",
        style: {
          fontWeight: 600,
        },
      },
      cancelButtonProps: {
        className: "my-font",
      },
      onOk: async () => {
        const toastId = toast.loading("Deleting...");
        try {
          await deleteEyeGlass(selectedRowKeys);
          toast.success("Successfully Deleted.", { id: toastId });
          setSelectedRowKeys([]);
        } catch (error: any) {
          const message = error?.data?.message || "Failed to delete.";
          toast.error(message, { id: toastId });
        }
      },
    });
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
          {user?.role === "user" && record.createdBy && record.createdBy !== user._id && (
            <Button
              size="small"
              onClick={() => handleRequestAccess(record._id)}
              loading={requestingEyeGlassId === record._id && isRequestCreating}
            >
              Request Access
            </Button>
          )}
          {user?.role === "manager" && (
            <Button size="small" type="link" onClick={() => openReassignModal(record)}>
              Reassign
            </Button>
          )}
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
        <div>
          <Title level={3} style={{ margin: 0 }}>
            Eye Glass Inventory
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Manage stock, create variants, and sell eye glasses.
          </Text>
          <div style={{ marginTop: 8 }}>
            <Text style={{ fontSize: 12 }}>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}</Text>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          <div style={{ fontSize: 13 }}>Total items: {data?.meta?.total}</div>
          <Button type="default" icon={<FilterOutlined />} iconPosition="start" onClick={showModal}>
            Filter
          </Button>
          <Button type="primary" onClick={showAddModal} icon={<PlusCircleOutlined />} loading={isLoading}>
            Add Item
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
        </div>
      </div>

      {/* show all eye glasses */}
      <Table
        rowSelection={rowSelection}
        loading={isLoading}
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
              marginBottom: 0,
            }}
          >
            Reassign Eye Glass Ownership
          </p>
        }
        centered
        open={isReassignModalOpen}
        onCancel={() => setIsReassignModalOpen(false)}
        onOk={handleReassignConfirm}
        confirmLoading={isReassigning}
        okText="Reassign"
        okButtonProps={{ disabled: !newOwnerId }}
        destroyOnClose
        maskClosable={false}
        width={520}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
          <div>
            <Text style={{ fontWeight: 600 }}>Eye Glass:</Text> <Text>{eyeGlassForReassign?.name || "N/A"}</Text>
          </div>
          <Select
            placeholder="Select new owner"
            loading={isUsersLoading}
            value={newOwnerId}
            onChange={(value) => setNewOwnerId(value)}
            style={{ width: "100%" }}
            options={
              usersData?.data
                ?.filter((u: any) => u._id !== eyeGlassForReassign?.createdBy)
                .map((u: any) => ({
                  label: `${u.username} (${u.role})`,
                  value: u._id,
                })) || []
            }
          />
        </div>
      </Modal>
    </div>
  );
};

export default EyeGlasses;
