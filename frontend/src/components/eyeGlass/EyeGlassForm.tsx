import { Button, theme } from "antd";
import { FieldValues } from "react-hook-form";
import {
  brands,
  frameColors,
  frameMaterials,
  frameShapes,
  lensMaterials,
  lensTypes,
  templeTypes,
} from "../../utils/static.data";
import Form from "../form/Form";
import MyInput from "../form/Input";
import MySelect from "../form/Select";

interface EyeGlassFormProps {
  onSubmit: (data: FieldValues) => Promise<void>;
  defaultValues?: Record<string, any>;
  isLoading: boolean;
  submitBtnText: string;
  isModal?: boolean;
}

const EyeGlassForm = ({ onSubmit, defaultValues, isLoading, submitBtnText, isModal = false }: EyeGlassFormProps) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Form onSubmit={onSubmit} defaultValues={defaultValues}>
      <div
        style={{
          width: "100%",
          maxWidth: isModal ? "100%" : "800px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          borderRadius: isModal ? 0 : borderRadiusLG,
          padding: isModal ? "10px 0" : "30px",
          boxShadow: isModal ? "none" : "0 4px 24px rgba(0,0,0,0.06)",
          background: isModal ? "transparent" : colorBgContainer,
          border: "none",
        }}
      >
        <div className="responsive-flex">
          <MyInput required type="text" name="photo" label="Photo URL:" />
          <MyInput required type="text" name="name" label="Name:" />
        </div>
        <div className="responsive-flex">
          <MyInput required type="number" name="price" label="Price:" />
          <MyInput required type="number" name="quantity" label="Quantity:" />
        </div>
        <div className="responsive-flex">
          <MySelect required name="frameMaterial" label="Frame Material:" options={frameMaterials} />
          <MySelect required name="frameShape" label="Frame Shape:" options={frameShapes} />
        </div>
        <div className="responsive-flex">
          <MySelect required name="lensType" label="Lens Type:" options={lensTypes} />
          <MySelect required name="templeType" label="Temple Type:" options={templeTypes} />
        </div>
        <div className="responsive-flex">
          <MyInput required type="number" name="templeLength" label="Temple Length:" />
          <MyInput required type="number" name="bridgeWidth" label="Bridge Width:" />
        </div>
        <div className="responsive-flex">
          <MyInput required type="number" name="lensWidth" label="Lens Width:" />
          <MyInput required type="number" name="lensHeight" label="Lens Height:" />
        </div>
        <div className="responsive-flex">
          <MySelect required name="lensMaterial" label="Lens Material:" options={lensMaterials} />
          <MySelect required name="brand" label="Brand:" options={brands} />
        </div>
        <div className="responsive-flex">
          <MySelect
            required
            name="gender"
            label="Gender:"
            options={[
              {
                label: "Male",
                value: "male",
              },
              {
                label: "Female",
                value: "female",
              },
            ]}
          />
          <MySelect required name="color" label="Color:" options={frameColors} />
        </div>
        <Button
          className="my-font"
          style={{
            fontSize: "15px",
            fontWeight: "600",
            height: "37px",
            marginTop: "6px",
          }}
          type="primary"
          htmlType="submit"
          loading={isLoading}
        >
          {submitBtnText}
        </Button>
      </div>
    </Form>
  );
};

export default EyeGlassForm;
