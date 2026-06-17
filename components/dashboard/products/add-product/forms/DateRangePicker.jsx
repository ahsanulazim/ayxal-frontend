"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./daterangepicker.css";

const DateRangePicker = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  return (
    <>
      <label className="label">Start & end date</label>

      <div className="w-full">
        <DatePicker
          selectsRange={true}
          startDate={startDate}
          endDate={endDate}
          minDate={new Date()}
          onChange={(update) => {
            setDateRange(update);
          }}
          dateFormat="dd/MM/yyyy"
          placeholderText="DD/MM/YYYY - DD/MM/YYYY"
          // DaisyUI class wrapper layout matching graphics
          className="input w-full"
        />
      </div>
    </>
  );
};

export default DateRangePicker;
