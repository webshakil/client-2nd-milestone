import React, { useState, useEffect } from "react";
import { Calendar, Clock, Sparkles, AlertCircle } from "lucide-react";

const DateTimePicker = ({
  label,
  value,
  onChange,
  error,
  required = false,
  minDate = null,
  maxDate = null,
}) => {
  const [date, setDate] = useState(value?.date || "");
  const [time, setTime] = useState(value?.time || "");
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    if (value) {
      setDate(value.date || "");
      setTime(value.time || "");
    }
  }, [value]);

  const handleChange = (field, val) => {
    const newState = { date, time, [field]: val };
    if (field === "date") setDate(val);
    if (field === "time") setTime(val);
    onChange?.(newState);
  };

  return (
    <div>
      <label className="flex items-center text-lg font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        <Sparkles className="w-5 h-5 mr-2 text-blue-500" />
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-2xl shadow-xl border p-6">
        {/* Date */}
        <div>
          <label className="flex items-center text-base font-semibold text-blue-700 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center mr-3 shadow-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            Select Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => handleChange("date", e.target.value)}
            onFocus={() => setFocusedField("date")}
            onBlur={() => setFocusedField(null)}
            min={minDate}
            max={maxDate}
            className={`w-full px-4 py-3 border-2 rounded-xl bg-white transition-all duration-300 ${
              focusedField === "date"
                ? "border-blue-400 shadow-lg ring-2 ring-blue-100"
                : error
                ? "border-red-300"
                : "border-blue-200 hover:border-blue-300"
            }`}
          />
        </div>

        {/* Time */}
        <div>
          <label className="flex items-center text-base font-semibold text-purple-700 mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center mr-3 shadow-lg">
              <Clock className="w-5 h-5 text-white" />
            </div>
            Select Time
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => handleChange("time", e.target.value)}
            onFocus={() => setFocusedField("time")}
            onBlur={() => setFocusedField(null)}
            className={`w-full px-4 py-3 border-2 rounded-xl bg-white transition-all duration-300 ${
              focusedField === "time"
                ? "border-purple-400 shadow-lg ring-2 ring-purple-100"
                : error
                ? "border-red-300"
                : "border-purple-200 hover:border-purple-300"
            }`}
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center space-x-3">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <p className="text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
};

export default DateTimePicker;
