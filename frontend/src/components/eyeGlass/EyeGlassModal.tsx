import { Modal } from "antd";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import { useCreateEyeGlassMutation, useUpdateEyeGlassMutation } from "../../redux/features/eyeGlass/eyeGlassApi";
import EyeGlassForm from "./EyeGlassForm";

interface EyeGlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "update" | "duplicate";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
  eyeGlassId?: string;
}

const EyeGlassModal = ({ isOpen, onClose, mode, initialData, eyeGlassId }: EyeGlassModalProps) => {
  const [createEyeGlass, { isLoading: isCreating }] = useCreateEyeGlassMutation();
  const [updateEyeGlass, { isLoading: isUpdating }] = useUpdateEyeGlassMutation();

  const handleSubmit = async (data: FieldValues) => {
    const toastId = toast.loading(
      mode === "add" ? "Creating eye-glass..." : mode === "update" ? "Updating eye-glass..." : "Creating variant...",
    );

    try {
      const eyeGlassInfo = {
        photo: data.photo,
        name: data.name,
        price: parseFloat(data.price),
        quantity: parseFloat(data.quantity),
        frameMaterial: data.frameMaterial,
        frameShape: data.frameShape,
        lensType: data.lensType,
        templeType: data.templeType,
        templeLength: parseFloat(data.templeLength),
        bridgeWidth: parseFloat(data.bridgeWidth),
        lensWidth: parseFloat(data.lensWidth),
        lensHeight: parseFloat(data.lensHeight),
        lensMaterial: data.lensMaterial,
        brand: data.brand,
        gender: data.gender,
        color: data.color,
      };

      if (mode === "add") {
        await createEyeGlass(eyeGlassInfo).unwrap();
      } else if (mode === "update" && eyeGlassId) {
        await updateEyeGlass({ _id: eyeGlassId, ...eyeGlassInfo }).unwrap();
      } else if (mode === "duplicate") {
        await createEyeGlass(eyeGlassInfo).unwrap();
      }

      toast.success(
        mode === "add"
          ? "Successfully Created."
          : mode === "update"
            ? "Successfully Updated."
            : "Successfully Created Variant.",
        { id: toastId },
      );
      onClose();
    } catch (err) {
      toast.error(
        mode === "add" ? "Failed to Create." : mode === "update" ? "Failed to Update." : "Failed to Create Variant.",
        { id: toastId },
      );
    }
  };

  const getTitle = () => {
    if (mode === "add") return "Add New Eye Glass";
    if (mode === "update") return "Update Eye Glass";
    return "Duplicate Eye Glass Variant";
  };

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
          {getTitle()}
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
      <EyeGlassForm
        key={`${mode}-${eyeGlassId || "new"}`} // Force remount on change
        onSubmit={handleSubmit}
        defaultValues={initialData}
        isLoading={isCreating || isUpdating}
        submitBtnText={
          mode === "add"
            ? isCreating
              ? "Creating..."
              : "Create"
            : mode === "update"
              ? isUpdating
                ? "Updating..."
                : "Update"
              : isCreating
                ? "Creating Variant..."
                : "Create Variant"
        }
        isModal
      />
    </Modal>
  );
};

export default EyeGlassModal;
