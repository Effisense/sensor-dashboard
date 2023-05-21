import { DateRangePickerValue } from "@tremor/react";
import { useState } from "react";

type DateRangeProps = {
  startDate?: Date;
  endDate?: Date;
};

const useDateRange = ({ startDate, endDate }: DateRangeProps) => {
  const start = startDate ? startDate : new Date();
  if (!startDate) {
    start.setDate(start.getDate() - 7);
  }

  const end = endDate ? endDate : new Date();

  const [dateRange, setDateRange] = useState<DateRangePickerValue>([
    start,
    end,
  ]);

  return {
    startDate: dateRange[0],
    endDate: dateRange[1],
    setDateRange,
  };
};

export default useDateRange;
