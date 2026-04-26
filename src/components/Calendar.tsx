import { useState } from "react";
import { motion } from "framer-motion";
import Window from "./Window";

interface CalendarEvent {
  date: string;
  title: string;
}

const mockEvents: CalendarEvent[] = [
  { date: "2026-04-01", title: "Spring Started" },
  { date: "2026-04-22", title: "Earth Day" },
  { date: "2026-05-01", title: "May Day" },
  { date: "2026-06-21", title: "Summer Solstice" },
];

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function Calendar({ onClose, onFocus, isActive }: { onClose: () => void; onFocus?: () => void; isActive?: boolean }) {
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const isToday = (day: number) =>
    day === now.getDate() && currentMonth === now.getMonth() && currentYear === now.getFullYear();

  const hasEvent = (day: number) =>
    mockEvents.some(e => {
      const d = new Date(e.date);
      return d.getDate() === day && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

  return (
    <Window
      title="Calendar"
      icon="📅"
      isActive={isActive ?? true}
      defaultSize={{ width: 420, height: 480 }}
      minSize={{ width: 350, height: 400 }}
      onClose={onClose}
      onFocus={onFocus ?? (() => {})}
    >
      <div className="calendar-app">
        <div className="calendar-header">
          <button className="calendar-nav" onClick={prevMonth}>◀</button>
          <span className="calendar-month-year">{monthNames[currentMonth]} {currentYear}</span>
          <button className="calendar-nav" onClick={nextMonth}>▶</button>
        </div>

        <div className="calendar-weekdays">
          {dayNames.map(day => (
            <div key={day} className="calendar-weekday">{day}</div>
          ))}
        </div>

        <div className="calendar-days">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="calendar-day calendar-day-empty" />
          ))}
          {days.map(day => (
            <motion.div
              key={day}
              className={`calendar-day ${isToday(day) ? "calendar-today" : ""} ${selectedDate === day ? "calendar-selected" : ""} ${hasEvent(day) ? "calendar-event" : ""}`}
              onClick={() => setSelectedDate(day)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {day}
              {hasEvent(day) && <span className="calendar-event-dot" />}
            </motion.div>
          ))}
        </div>

        <div className="calendar-events">
          <h3>Events</h3>
          {mockEvents.map((event, idx) => (
            <div key={idx} className="calendar-event-item">
              <span className="calendar-event-date">{event.date}</span>
              <span className="calendar-event-title">{event.title}</span>
            </div>
          ))}
        </div>
      </div>
    </Window>
  );
}

export default Calendar;