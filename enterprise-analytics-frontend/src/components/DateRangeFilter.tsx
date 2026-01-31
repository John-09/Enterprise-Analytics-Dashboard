import { DatePicker } from "antd";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

export default function DateRangeFilter({
  onChange,
}: {
  onChange: (start?: string, end?: string) => void;
}) {
  return (
    <RangePicker
      onChange={(dates) => {
        if (!dates) return onChange(undefined, undefined);
        onChange(
          dayjs(dates[0]).format("YYYY-MM-DD"),
          dayjs(dates[1]).format("YYYY-MM-DD")
        );
      }}
    />
  );
}
