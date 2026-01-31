import { DatePicker } from "antd";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

export default function DateRangeFilter({
  value,
  onChange,
}: {
  value: [dayjs.Dayjs, dayjs.Dayjs];
  onChange: (start?: string, end?: string) => void;
}) {
  return (
    <RangePicker
      value={value}
      onChange={(dates) => {
        if (!dates) return;
        onChange(dates[0].format("YYYY-MM-DD"), dates[1].format("YYYY-MM-DD"));
      }}
    />
  );
}
