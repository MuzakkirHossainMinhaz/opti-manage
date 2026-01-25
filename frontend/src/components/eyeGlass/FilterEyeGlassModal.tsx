import type { SliderSingleProps } from "antd";
import { Button, Modal, Slider, theme } from "antd";
import React, { useState } from "react";
import { FieldValues } from "react-hook-form";
import { brands, frameColors, frameMaterials, frameShapes, lensTypes } from "../../utils/static.data";
import Form from "../form/Form";
import MySelect from "../form/Select";

// props interface
interface IProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setFilters: React.Dispatch<
    React.SetStateAction<{
      price?: number[];
      templeLength?: number[];
      bridgeWidth?: number[];
      frameMaterial?: string;
      frameShape?: string;
      lensType?: string;
      brand?: string;
      gender?: string;
      color?: string;
    }>
  >;
}

const FilterEyeGlassModal: React.FC<IProps> = ({ isModalOpen, setIsModalOpen, setFilters }: IProps) => {
  const [price, setPrice] = useState<number[]>([50, 200]);
  const [templeLength, setTempleLength] = useState<number[]>([100, 150]);
  const [bridgeWidth, setBridgeWidth] = useState<number[]>([15, 25]);
  const {
    token: { colorError, colorErrorBg, colorErrorBorder, colorErrorHover },
  } = theme.useToken();
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);

  // filter eye-glasses
  const onSubmit = async (data: FieldValues) => {
    const eyeGlassInfo = {
      price: price,
      templeLength: templeLength,
      bridgeWidth: bridgeWidth,
      frameMaterial: data.frameMaterial,
      frameShape: data.frameShape,
      lensType: data.lensType,
      brand: data.brand,
      gender: data.gender,
      color: data.color,
    };

    // set filters
    setFilters(eyeGlassInfo);
    setIsModalOpen(false);
  };

  const onReset = () => {
    setFilters({});
    setPrice([50, 200]);
    setTempleLength([100, 150]);
    setBridgeWidth([15, 25]);
    setIsModalOpen(false);
  };

  const priceMarks: SliderSingleProps["marks"] = {
    0: "0",
    50: "50",
    200: "200",
    500: "500",
  };

  const templeLengthMarks: SliderSingleProps["marks"] = {
    50: "50",
    100: "100",
    150: "150",
    200: "200",
  };

  const bridgeWidthMarks: SliderSingleProps["marks"] = {
    10: "10",
    15: "15",
    20: "20",
    25: "25",
    30: "30",
    40: "40",
    50: "50",
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
          Filter Eye-Glasses
        </p>
      }
      centered
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
      width={600}
      destroyOnClose
      maskClosable={false}
    >
      <Form onSubmit={onSubmit}>
        <div
          style={{
            width: "100%",
            maxWidth: "800px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            borderRadius: 0,
            padding: "10px 0",
            boxShadow: "none",
            background: "transparent",
            border: "none",
          }}
        >
          <div>
            <p className="my-font" style={{ fontSize: "15px", fontWeight: "600" }}>
              Price Range:
            </p>
            <Slider
              range
              marks={priceMarks}
              defaultValue={[50, 200]}
              min={0}
              max={500}
              onChange={(value) => setPrice(value as number[])}
            />
          </div>
          <div className="responsive-flex">
            <MySelect
              name="frameMaterial"
              label="Frame Material:"
              options={[{ label: "All", value: "" }, ...frameMaterials]}
            />
            <MySelect name="frameShape" label="Frame Shape:" options={[{ label: "All", value: "" }, ...frameShapes]} />
          </div>
          <div className="responsive-flex">
            <MySelect name="lensType" label="Lens Type:" options={[{ label: "All", value: "" }, ...lensTypes]} />
            <MySelect name="brand" label="Brand:" options={[{ label: "All", value: "" }, ...brands]} />
          </div>
          <div className="responsive-flex">
            <MySelect
              name="gender"
              label="Gender:"
              options={[
                { label: "All", value: "" },
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
            <MySelect name="color" label="Color:" options={frameColors} />
          </div>
          <div>
            <p className="my-font" style={{ fontSize: "15px", fontWeight: "600" }}>
              Temple Length:
            </p>
            <Slider
              range
              marks={templeLengthMarks}
              defaultValue={[100, 150]}
              min={50}
              max={200}
              onChange={(value) => setTempleLength(value as number[])}
            />
          </div>
          <div>
            <p className="my-font" style={{ fontSize: "15px", fontWeight: "600" }}>
              Bridge Width:
            </p>
            <Slider
              range
              marks={bridgeWidthMarks}
              defaultValue={[15, 25]}
              min={10}
              max={50}
              onChange={(value) => setBridgeWidth(value as number[])}
            />
          </div>
          <div className="responsive-flex" style={{ paddingTop: "18px", borderTop: "2px solid #e5e5e5" }}>
            <Button
              style={{
                width: "100%",
                height: "37px",
                fontWeight: "600",
                fontSize: "15px",
                border: `1px solid ${isLogoutHovered ? colorErrorHover : colorErrorBorder}`,
                background: isLogoutHovered ? colorErrorBg : "transparent",
                color: colorError,
                transition: "all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)",
                boxShadow: "none",
              }}
              onMouseEnter={() => setIsLogoutHovered(true)}
              onMouseLeave={() => setIsLogoutHovered(false)}
              type="primary"
              htmlType="button"
              onClick={onReset}
              className="my-font"
            >
              Reset
            </Button>
            <Button
              style={{
                width: "100%",
                height: "37px",
                fontWeight: "600",
                fontSize: "15px",
              }}
              type="primary"
              htmlType="submit"
              className="my-font"
            >
              Apply
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default FilterEyeGlassModal;
