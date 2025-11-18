import { useState, useMemo, MouseEvent } from "react";
import styles from "./DateRangePicker.module.scss";

interface DayInfo {
  day: number;
  dateStr: string;
  date: Date;
  isAvailable: boolean;
}

interface MonthInfo {
  year: number;
  month: number;
}

interface AvailableMonthsInfo {
  firstDate: Date;
  lastDate: Date;
  availableMonths: MonthInfo[];
  availableDatesSet: Set<string>;
}

interface DateRangePickerProps {
  availableDates?: string[];
  onRangeSelect?: (startDate: string, endDate: string) => void;
  className?: string;
  selectedStartDate?: string | null;
  selectedEndDate?: string | null;
}

function DateRangePicker({
  availableDates = [],
  onRangeSelect,
  className,
  selectedStartDate = null,
  selectedEndDate = null
}: DateRangePickerProps) {
  const [startDate, setStartDate] = useState<string | null>(selectedStartDate);
  const [endDate, setEndDate] = useState<string | null>(selectedEndDate);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const availableMonthsInfo = useMemo<AvailableMonthsInfo | null>(() => {
    if (!availableDates.length) return null;

    const dates = availableDates.map(d => new Date(d));
    const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime());

    const firstDate = sortedDates[0];
    const lastDate = sortedDates[sortedDates.length - 1];

    const monthsSet = new Set<string>();
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

  const [currentMonth, setCurrentMonth] = useState(() =>
    availableMonthsInfo?.availableMonths[0]?.month ?? new Date().getMonth()
  );
  const [currentYear, setCurrentYear] = useState(() =>
    availableMonthsInfo?.availableMonths[0]?.year ?? new Date().getFullYear()
  );

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

  const calendarDays = useMemo<(DayInfo | null)[]>(() => {
    if (!availableMonthsInfo) return [];

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    const startDay = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const days: (DayInfo | null)[] = [];

    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

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

  const handleDateClick = (dayInfo: DayInfo | null) => {
    if (!dayInfo || !dayInfo.isAvailable) return;

    if (!startDate || (startDate && endDate)) {
      setStartDate(dayInfo.dateStr);
      setEndDate(null);
    } else {
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

  const isDateInRange = (dateStr: string | undefined) => {
    if (!startDate || !dateStr) return false;

    const current = new Date(dateStr);
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : hoveredDate ? new Date(hoveredDate) : null;

    if (!end) return dateStr === startDate;

    const rangeStart = start < end ? start : end;
    const rangeEnd = start < end ? end : start;

    return current >= rangeStart && current <= rangeEnd;
  };

  const getMonthName = (monthIndex: number): string => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthIndex];
  };

  if (!availableMonthsInfo) return null;

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleContainerClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div
      className={[styles["date-range-picker"], className].filter(Boolean).join(" ")}
      onMouseDown={handleContainerClick}
    >
      <div className={styles["date-range-picker__header"]}>
        <button
          className={styles["date-range-picker__nav-btn"]}
          disabled={!canGoPrev}
          onClick={handlePrevMonth}
        >
          &lt;
        </button>
        <div className={styles["date-range-picker__monthYear"]}>
          {getMonthName(currentMonth)} {currentYear}
        </div>
        <button
          className={styles["date-range-picker__nav-btn"]}
          disabled={!canGoNext}
          onClick={handleNextMonth}
        >
          &gt;
        </button>
      </div>

      <div className={styles["date-range-picker__week-days"]}>
        {weekDays.map((day, index) => (
          <div key={index} className={styles["date-range-picker__week-day"]}>
            {day}
          </div>
        ))}
      </div>

      <div className={styles["date-range-picker__days"]}>
        {calendarDays.map((dayInfo, index) => (
          <div
            key={index}
            className={[
              styles["date-range-picker__day"],
              !dayInfo && styles["date-range-picker__day--empty"],
              dayInfo && !dayInfo.isAvailable && styles["date-range-picker__day--disabled"],
              dayInfo && dayInfo.dateStr === startDate && styles["date-range-picker__day--start"],
              dayInfo && dayInfo.dateStr === endDate && styles["date-range-picker__day--end"],
              dayInfo && isDateInRange(dayInfo.dateStr) && styles["date-range-picker__day--in-range"]
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
