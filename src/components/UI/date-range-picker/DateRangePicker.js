import { useState, useMemo } from "react";
import styles from "./DateRangePicker.module.scss";

function DateRangePicker({ availableDates = [], onRangeSelect, className, selectedStartDate = null, selectedEndDate = null }) {
  const [startDate, setStartDate] = useState(selectedStartDate);
  const [endDate, setEndDate] = useState(selectedEndDate);
  const [hoveredDate, setHoveredDate] = useState(null);

  // Parse available dates and get available months
  const availableMonthsInfo = useMemo(() => {
    if (!availableDates.length) return null;

    const dates = availableDates.map(d => new Date(d));
    const sortedDates = dates.sort((a, b) => a - b);

    const firstDate = sortedDates[0];
    const lastDate = sortedDates[sortedDates.length - 1];

    // Get all unique year-month combinations
    const monthsSet = new Set();
    sortedDates.forEach(date => {
      const yearMonth = `${date.getFullYear()}-${date.getMonth()}`;
      monthsSet.add(yearMonth);
    });

    const availableMonths = Array.from(monthsSet).map(ym => {
      const [year, month] = ym.split('-').map(Number);
      return { year, month };
    }).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });

    return {
      firstDate,
      lastDate,
      availableMonths,
      availableDatesSet: new Set(availableDates)
    };
  }, [availableDates]);

  // Current viewing month/year
  const [currentMonth, setCurrentMonth] = useState(() =>
    availableMonthsInfo?.availableMonths[0]?.month ?? new Date().getMonth()
  );
  const [currentYear, setCurrentYear] = useState(() =>
    availableMonthsInfo?.availableMonths[0]?.year ?? new Date().getFullYear()
  );

  // Navigation functions
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Check if prev/next buttons should be disabled
  const canGoPrev = useMemo(() => {
    if (!availableMonthsInfo) return false;
    const firstAvailable = availableMonthsInfo.availableMonths[0];
    if (currentYear > firstAvailable.year) return true;
    if (currentYear === firstAvailable.year && currentMonth > firstAvailable.month) return true;
    return false;
  }, [availableMonthsInfo, currentMonth, currentYear]);

  const canGoNext = useMemo(() => {
    if (!availableMonthsInfo) return false;
    const lastAvailable = availableMonthsInfo.availableMonths[availableMonthsInfo.availableMonths.length - 1];
    if (currentYear < lastAvailable.year) return true;
    if (currentYear === lastAvailable.year && currentMonth < lastAvailable.month) return true;
    return false;
  }, [availableMonthsInfo, currentMonth, currentYear]);

  // Generate calendar grid
  const calendarDays = useMemo(() => {
    if (!availableMonthsInfo) return [];

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    const startDay = firstDayOfMonth.getDay(); // 0 = Sunday
    const daysInMonth = lastDayOfMonth.getDate();

    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({
        day,
        dateStr,
        date: new Date(currentYear, currentMonth, day),
        isAvailable: availableMonthsInfo.availableDatesSet.has(dateStr)
      });
    }

    return days;
  }, [availableMonthsInfo, currentMonth, currentYear]);

  const handleDateClick = (dayInfo) => {
    if (!dayInfo || !dayInfo.isAvailable) return;

    if (!startDate || (startDate && endDate)) {
      // Start new selection
      setStartDate(dayInfo.dateStr);
      setEndDate(null);
    } else {
      // Complete selection
      const start = new Date(startDate);
      const end = new Date(dayInfo.dateStr);

      if (end < start) {
        setStartDate(dayInfo.dateStr);
        setEndDate(startDate);
        if (onRangeSelect) {
          onRangeSelect(dayInfo.dateStr, startDate);
        }
      } else {
        setEndDate(dayInfo.dateStr);
        if (onRangeSelect) {
          onRangeSelect(startDate, dayInfo.dateStr);
        }
      }
    }
  };

  const isDateInRange = (dateStr) => {
    if (!startDate || !dateStr) return false;

    const current = new Date(dateStr);
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : hoveredDate ? new Date(hoveredDate) : null;

    if (!end) return dateStr === startDate;

    const rangeStart = start < end ? start : end;
    const rangeEnd = start < end ? end : start;

    return current >= rangeStart && current <= rangeEnd;
  };

  const getMonthName = (monthIndex) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthIndex];
  };

  if (!availableMonthsInfo) return null;

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Prevent click events from bubbling up to document
  const handleContainerClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className={[styles.dateRangePicker, className].filter(Boolean).join(" ")}
      onMouseDown={handleContainerClick}
    >
      <div className={styles.dateRangePicker__header}>
        <button
          className={styles.dateRangePicker__navBtn}
          disabled={!canGoPrev}
          onClick={handlePrevMonth}
        >
          &lt;
        </button>
        <div className={styles.dateRangePicker__monthYear}>
          {getMonthName(currentMonth)} {currentYear}
        </div>
        <button
          className={styles.dateRangePicker__navBtn}
          disabled={!canGoNext}
          onClick={handleNextMonth}
        >
          &gt;
        </button>
      </div>

      <div className={styles.dateRangePicker__weekDays}>
        {weekDays.map((day, index) => (
          <div key={index} className={styles.dateRangePicker__weekDay}>
            {day}
          </div>
        ))}
      </div>

      <div className={styles.dateRangePicker__days}>
        {calendarDays.map((dayInfo, index) => (
          <div
            key={index}
            className={[
              styles.dateRangePicker__day,
              !dayInfo && styles.dateRangePicker__day_empty,
              dayInfo && !dayInfo.isAvailable && styles.dateRangePicker__day_disabled,
              dayInfo && dayInfo.dateStr === startDate && styles.dateRangePicker__day_start,
              dayInfo && dayInfo.dateStr === endDate && styles.dateRangePicker__day_end,
              dayInfo && isDateInRange(dayInfo.dateStr) && styles.dateRangePicker__day_inRange
            ].filter(Boolean).join(" ")}
            onClick={() => handleDateClick(dayInfo)}
            onMouseEnter={() => dayInfo && setHoveredDate(dayInfo.dateStr)}
            onMouseLeave={() => setHoveredDate(null)}
          >
            {dayInfo?.day}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DateRangePicker;
