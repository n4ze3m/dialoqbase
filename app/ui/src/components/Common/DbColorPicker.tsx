import { ColorPickerProps, ColorPicker } from "antd";

type Props = ColorPickerProps & {
    pickedColor?: string;
};

export const DbColorPicker = (props: Props) => {
  return (
    <div className="flex flex-row items-center">
      <ColorPicker {...props} />
      <div className="ml-2">{props.pickedColor}</div>
    </div>
  );
};
