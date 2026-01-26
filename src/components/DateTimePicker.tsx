import React, { useState, useEffect, useRef } from "react";

interface DateTimePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({ value, onChange }) => {
  const get12Hour = (date: Date | null): number => {
    if (!date) return 12;
    const hour24 = date.getHours();
    let hour12 = hour24 % 12;
    if (hour12 === 0) hour12 = 12;
    return hour12;
  };

  const [currentDate, setCurrentDate] = useState<Date>(value || new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(value);
  const [hours, setHours] = useState<number>(get12Hour(value));
  const [minutes, setMinutes] = useState<number>(value ? value.getMinutes() : 0);
  const [seconds, setSeconds] = useState<number>(value ? value.getSeconds() : 0);
  const [isAM, setIsAM] = useState<boolean>(value ? value.getHours() < 12 : true);
  const [showMonthDropdown, setShowMonthDropdown] = useState<boolean>(false);
  const [showYearDropdown, setShowYearDropdown] = useState<boolean>(false);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const isInternalUpdate = useRef<boolean>(false);
  const dateInputRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-dropdown]')) {
        setShowMonthDropdown(false);
        setShowYearDropdown(false);
      }
      // Close calendar if clicking outside
      if (showCalendar && 
          dateInputRef.current && 
          !dateInputRef.current.contains(target) &&
          calendarRef.current &&
          !calendarRef.current.contains(target)) {
        setShowCalendar(false);
      }
    };

    if (showMonthDropdown || showYearDropdown || showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
    return undefined;
  }, [showMonthDropdown, showYearDropdown, showCalendar]);

  // Update time when value changes externally (only if different from current state)
  useEffect(() => {
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }
    
    if (value) {
      // Check if the value is actually different from current selectedDate
      const isDifferent = !selectedDate || value.getTime() !== selectedDate.getTime();
      
      if (isDifferent) {
        setSelectedDate(value);
        setCurrentDate(new Date(value.getFullYear(), value.getMonth(), 1));
        const hour24 = value.getHours();
        // Convert 24-hour to 12-hour format
        let hour12 = hour24 % 12;
        if (hour12 === 0) hour12 = 12;
        setHours(hour12);
        setMinutes(value.getMinutes());
        setSeconds(value.getSeconds());
        setIsAM(hour24 < 12);
      }
    } else if (selectedDate !== null) {
      setSelectedDate(null);
    }
  }, [value]);

  // Update parent when date or time changes
  useEffect(() => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      let hour24 = hours;
      if (!isAM && hours !== 12) {
        hour24 = hours + 12;
      } else if (isAM && hours === 12) {
        hour24 = 0;
      }
      newDate.setHours(hour24, minutes, seconds);
      
      // Check if the new date is actually different from the current value
      if (!value || value.getTime() !== newDate.getTime()) {
        isInternalUpdate.current = true;
        onChange(newDate);
      }
    }
  }, [selectedDate, hours, minutes, seconds, isAM, onChange, value]);

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const selectDate = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    // Always use current time state values to ensure consistency
    // Convert 12-hour format to 24-hour format
    let hour24 = hours;
    if (!isAM && hours !== 12) {
      hour24 = hours + 12;
    } else if (isAM && hours === 12) {
      hour24 = 0;
    }
    newDate.setHours(hour24, minutes, seconds);
    setSelectedDate(newDate);
    // Close calendar after selecting a date
    setShowCalendar(false);
  };

  const selectMonth = (monthIndex: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), monthIndex, 1));
    setShowMonthDropdown(false);
  };

  const selectYear = (year: number) => {
    setCurrentDate(prev => new Date(year, prev.getMonth(), 1));
    setShowYearDropdown(false);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days: Array<{ day: number; isCurrentMonth: boolean }> = [];
    
    // Previous month days
    const prevMonthDays = getDaysInMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, isCurrentMonth: false });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }
    
    // Next month days to fill the grid
    const remainingCells = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingCells; i++) {
      days.push({ day: i, isCurrentMonth: false });
    }

    return days;
  };

  const isSelectedDate = (day: number): boolean => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentDate.getMonth() &&
      selectedDate.getFullYear() === currentDate.getFullYear()
    );
  };

  const calendarDays = renderCalendar();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const yearRange = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  const handleHourChange = (value: number) => {
    if (value >= 1 && value <= 12) {
      setHours(value);
    }
  };

  const handleMinuteChange = (value: number) => {
    if (value >= 0 && value <= 59) {
      setMinutes(value);
    }
  };

  const handleSecondChange = (value: number) => {
    if (value >= 0 && value <= 59) {
      setSeconds(value);
    }
  };

  const formatDateForInput = (date: Date | null): string => {
    if (!date) return "";
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const renderCalendarPopup = () => (
    <div
      ref={calendarRef}
      style={{
        position: "absolute",
        top: "100%",
        left: 0,
        marginTop: "4px",
        border: "1px solid #e9ecef",
        borderRadius: "4px",
        backgroundColor: "#fff",
        padding: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        zIndex: 1000,
        minWidth: "280px"
      }}
    >
      {/* Calendar Section */}
      <div style={{ marginBottom: "12px" }}>
        {/* Navigation Bar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "8px"
        }}>
          <button
            onClick={() => navigateMonth('prev')}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px 8px",
              fontSize: "16px",
              color: "#495057",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px",
              borderRadius: "4px",
              transition: "background-color 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f8f9fa";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 9L4.5 6L7.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <div style={{ position: "relative" }} data-dropdown>
              <button
                onClick={() => {
                  setShowMonthDropdown(!showMonthDropdown);
                  setShowYearDropdown(false);
                }}
                style={{
                  background: "none",
                  border: "1px solid #dee2e6",
                  borderRadius: "4px",
                  padding: "4px 8px",
                  cursor: "pointer",
                  fontSize: "13px",
                  color: "#495057",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  minWidth: "110px",
                  justifyContent: "space-between"
                }}
              >
                <span>{months[currentMonth]}</span>
                <span style={{ fontSize: "10px" }}>▼</span>
              </button>
              {showMonthDropdown && (
                <div data-dropdown style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  marginTop: "4px",
                  background: "#fff",
                  border: "1px solid #dee2e6",
                  borderRadius: "4px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  zIndex: 1000,
                  maxHeight: "200px",
                  overflowY: "auto",
                  minWidth: "140px"
                }}>
                  {months.map((month, index) => (
                    <div
                      key={index}
                      onClick={() => selectMonth(index)}
                      style={{
                        padding: "6px 10px",
                        cursor: "pointer",
                        fontSize: "13px",
                        color: "#495057",
                        backgroundColor: index === currentMonth ? "#e3f2fd" : "transparent"
                      }}
                      onMouseEnter={(e) => {
                        if (index !== currentMonth) {
                          e.currentTarget.style.backgroundColor = "#f8f9fa";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (index !== currentMonth) {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }
                      }}
                    >
                      {month}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ position: "relative" }} data-dropdown>
              <button
                onClick={() => {
                  setShowYearDropdown(!showYearDropdown);
                  setShowMonthDropdown(false);
                }}
                style={{
                  background: "none",
                  border: "1px solid #dee2e6",
                  borderRadius: "4px",
                  padding: "4px 8px",
                  cursor: "pointer",
                  fontSize: "13px",
                  color: "#495057",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  minWidth: "90px",
                  justifyContent: "space-between"
                }}
              >
                <span>{currentYear}</span>
                <span style={{ fontSize: "10px" }}>▼</span>
              </button>
              {showYearDropdown && (
                <div data-dropdown style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  marginTop: "4px",
                  background: "#fff",
                  border: "1px solid #dee2e6",
                  borderRadius: "4px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  zIndex: 1000,
                  maxHeight: "200px",
                  overflowY: "auto",
                  minWidth: "110px"
                }}>
                  {yearRange.map((year) => (
                    <div
                      key={year}
                      onClick={() => selectYear(year)}
                      style={{
                        padding: "6px 10px",
                        cursor: "pointer",
                        fontSize: "13px",
                        color: "#495057",
                        backgroundColor: year === currentYear ? "#e3f2fd" : "transparent"
                      }}
                      onMouseEnter={(e) => {
                        if (year !== currentYear) {
                          e.currentTarget.style.backgroundColor = "#f8f9fa";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (year !== currentYear) {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }
                      }}
                    >
                      {year}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => navigateMonth('next')}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px 8px",
              fontSize: "16px",
              color: "#495057",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px",
              borderRadius: "4px",
              transition: "background-color 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f8f9fa";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Days of Week Header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "3px",
          marginBottom: "6px"
        }}>
          {daysOfWeek.map(day => (
            <div
              key={day}
              style={{
                textAlign: "center",
                fontSize: "11px",
                fontWeight: 600,
                color: "#6c757d",
                padding: "2px"
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "3px"
        }}>
          {calendarDays.map((dayObj, index) => {
            const { day, isCurrentMonth: isCurrentMonthDay } = dayObj;
            const isSelected = isSelectedDate(day) && isCurrentMonthDay;
            const isToday = isCurrentMonthDay && 
              new Date().getDate() === day &&
              new Date().getMonth() === currentMonth &&
              new Date().getFullYear() === currentYear;

            return (
              <button
                key={index}
                onClick={() => isCurrentMonthDay && selectDate(day)}
                disabled={!isCurrentMonthDay}
                style={{
                  background: isSelected ? "#0B63E9" : "transparent",
                  color: isSelected ? "#fff" : isCurrentMonthDay ? "#495057" : "#adb5bd",
                  border: isSelected ? "1px solid #0B63E9" : "1px solid transparent",
                  borderRadius: "4px",
                  padding: "4px",
                  cursor: isCurrentMonthDay ? "pointer" : "default",
                  fontSize: "13px",
                  fontWeight: isToday ? 600 : 400,
                  minHeight: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: isCurrentMonthDay ? 1 : 0.5
                }}
                onMouseEnter={(e) => {
                  if (!isSelected && isCurrentMonthDay) {
                    e.currentTarget.style.backgroundColor = "#f8f9fa";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontFamily: "Inter, sans-serif",
      position: "relative",
      flexWrap: "nowrap" as const
    }}>
      {/* Date Input */}
      <div ref={dateInputRef} style={{ position: "relative", flex: "1 1 0", minWidth: "120px" }}>
        <input
          type="text"
          readOnly
          value={formatDateForInput(selectedDate)}
          onClick={() => setShowCalendar(!showCalendar)}
          placeholder="Select date"
          style={{
            width: "100%",
            padding: "8px 12px",
            border: "1px solid #dee2e6",
            borderRadius: "4px",
            fontSize: "14px",
            fontFamily: "Inter, sans-serif",
            outline: "none",
            cursor: "pointer",
            backgroundColor: "#fff",
            boxSizing: "border-box"
          }}
        />
        {showCalendar && renderCalendarPopup()}
      </div>

      {/* Time Picker Section */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        flexShrink: 0,
        flexWrap: "nowrap" as const
      }}>
        <input
          type="number"
          min="1"
          max="12"
          value={hours || ''}
          onChange={(e) => handleHourChange(parseInt(e.target.value) || 0)}
          style={{
            width: "50px",
            padding: "8px",
            border: "1px solid #dee2e6",
            borderRadius: "4px",
            fontSize: "13px",
            textAlign: "center",
            fontFamily: "Inter, sans-serif",
            outline: "none",
            boxSizing: "border-box"
          }}
        />
        <span style={{ fontSize: "13px", color: "#495057" }}>:</span>
        <input
          type="number"
          min="0"
          max="59"
          value={minutes.toString().padStart(2, '0')}
          onChange={(e) => handleMinuteChange(parseInt(e.target.value) || 0)}
          style={{
            width: "50px",
            padding: "8px",
            border: "1px solid #dee2e6",
            borderRadius: "4px",
            fontSize: "13px",
            textAlign: "center",
            fontFamily: "Inter, sans-serif",
            outline: "none",
            boxSizing: "border-box"
          }}
        />
        <span style={{ fontSize: "13px", color: "#495057" }}>:</span>
        <input
          type="number"
          min="0"
          max="59"
          value={seconds.toString().padStart(2, '0')}
          onChange={(e) => handleSecondChange(parseInt(e.target.value) || 0)}
          style={{
            width: "50px",
            padding: "8px",
            border: "1px solid #dee2e6",
            borderRadius: "4px",
            fontSize: "13px",
            textAlign: "center",
            fontFamily: "Inter, sans-serif",
            outline: "none",
            boxSizing: "border-box"
          }}
        />
        <select
          value={isAM ? "AM" : "PM"}
          onChange={(e) => setIsAM(e.target.value === "AM")}
          style={{
            padding: "8px",
            border: "1px solid #dee2e6",
            borderRadius: "4px",
            fontSize: "13px",
            fontFamily: "Inter, sans-serif",
            outline: "none",
            cursor: "pointer",
            backgroundColor: "#fff",
            minWidth: "60px",
            boxSizing: "border-box"
          }}
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    </div>
  );
};

export default DateTimePicker;
