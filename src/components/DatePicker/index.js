import React, { useState, useEffect } from "react";
import { Day, Calendar } from "../../classes";
import moment from "moment";

export default function DatePicker() {
  let lang = window.navigator.language;
  let date_ = new Day(new Date(), lang);
  const [todayDate, setTodayDate] = useState(new Day(new Date(), lang));
  const [date, setDate] = useState(date_);
  const [calendar, setCalendar] = useState(
    new Calendar(date_.year, date_.monthNumber, lang)
  );
  const [monthDays, setMonthDays] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(date_.monthNumber);
  const [currentYear, setCurrentYear] = useState(date_.year);

  const getMonthDayGrid = () => {
    const firstDayOfTheMonth = calendar.month.getDay(1);
    const prevMonth = calendar.getPreviousMonth();
    const totalLastMonthFinalDays = firstDayOfTheMonth.dayNumber - 1;
    const totalDays = calendar.month.numberOfDays + totalLastMonthFinalDays;
    const monthList = Array.from({ length: totalDays });

    for (let i = totalLastMonthFinalDays; i < totalDays; i++) {
      monthList[i] = calendar.month.getDay(i + 1 - totalLastMonthFinalDays);
    }

    for (let i = 0; i < totalLastMonthFinalDays; i++) {
      const inverted = totalLastMonthFinalDays - (i + 1);
      monthList[i] = prevMonth.getDay(prevMonth.numberOfDays - inverted);
    }

    return monthList;
  };

  const scrollDate = ({ action, interval }) => {
    let newMonth;
    switch (action) {
      case "decrease":
        newMonth = moment(new Date(date.Date)).subtract(1, interval).format();
        break;
      default:
        newMonth = moment(new Date(date.Date)).add(1, interval).format();
        break;
    }
    setDate(new Day(new Date(newMonth)), lang);
  };

  const selectMonth = (e) => {
    setCurrentMonth(+e.target.value);

    let newDate = moment(new Date(date.Date)).set("month", +e.target.value - 1);

    setDate(new Day(new Date(newDate), lang));
  };

  const selectYear = (e) => {
    setCurrentYear(+e.target.value);

    let newDate = moment(new Date(date.Date)).set("year", +e.target.value);
    setDate(new Day(new Date(newDate), lang));
  };

  useEffect(() => {
    setCalendar(new Calendar(date.year, date.monthNumber, lang));
    setCurrentMonth(date.monthNumber);
    setCurrentYear(date.year);
  }, [date]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setMonthDays(getMonthDayGrid());
  }, [calendar]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="calendar">
      <div></div>
      <div className="calendar__header">
        <div className="calendar__header__month">
          <div className="calendar__header__month__info">
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              viewBox="0 0 25 25"
              className="calendar__icon"
            >
              <path
                d="M24.3,2.6v22h-24v-22h3v1c0,1.1,0.9,2,2,2s2-0.9,2-2v-1h10v1c0,1.1,0.9,2,2,2s2-0.9,2-2v-1H24.3z M22.3,8.6h-20v14h20V8.6z
	 M20.3,1.6c0-0.6-0.4-1-1-1s-1,0.4-1,1v2c0,0.6,0.4,1,1,1s1-0.4,1-1V1.6z M6.3,3.6c0,0.6-0.4,1-1,1s-1-0.4-1-1v-2c0-0.6,0.4-1,1-1
	s1,0.4,1,1V3.6z"
              />
              {selectedDay && (
                <text
                  dominant-baseline="middle"
                  text-anchor="middle"
                  x="50%"
                  y="17"
                >
                  {selectedDay.date}
                </text>
              )}
            </svg>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="calendar__month">
                <h2>{calendar && `${calendar.month.name}`} </h2>
                <div className="calendar__month__actions">
                  <button>{chevronUp()}</button>
                  <button>{chevronDown()}</button>
                </div>
                <select value={currentMonth} onChange={(e) => selectMonth(e)}>
                  {months.map((m) => (
                    <option value={m.mNumber}>{m.mName}</option>
                  ))}
                </select>
              </span>
              <div className="calendar__header__month__actions">
                <button
                  className="restart"
                  style={
                    todayDate?.month === date?.month
                      ? {
                          opacity: 0,
                          visibility: "hidden",
                        }
                      : {
                          opacity: 1,
                          visibility: "visible",
                        }
                  }
                  onClick={() => {
                    setSelectedDay(new Day(new Date(), lang));
                    setDate(new Day(new Date(), lang));
                  }}
                >
                  {restart()}
                </button>
                <button
                  onClick={() =>
                    scrollDate({ action: "decrease", interval: "months" })
                  }
                >
                  {chevronLeft()}
                </button>

                <button
                  onClick={() =>
                    scrollDate({ action: "increase", interval: "months" })
                  }
                >
                  {chevronRight()}
                </button>
              </div>
            </div>
            <span className="calendar__year">
              {calendar && `${calendar.year}`}

              <select value={currentYear} onChange={(e) => selectYear(e)}>
                {[...Array(50)].map((_, index) => (
                  <option value={date_.year + index}>
                    {date_.year + index}
                  </option>
                ))}
              </select>
            </span>
          </div>
        </div>
      </div>
      <div className="calendar__tableheader">
        {Array.isArray(calendar?.weekDays) &&
          calendar.weekDays.map((weekDay, index) => (
            <span key={index}>{weekDay.substring(0, 3)}</span>
          ))}
      </div>
      <div className="calendar__days">
        {Array.isArray(monthDays) &&
          monthDays.map((day) => {
            let classes = [day.day.toLowerCase()];
            if (day.isToday) classes = [...classes, "today"];
            if (selectedDay?.timestamp === day.timestamp)
              classes = [...classes, "selected"];
            if (day.month === date.month) classes = [...classes, "current"];

            return (
              <button
                key={day.timestamp}
                onClick={() => setSelectedDay(day)}
                className={`${classes.join(" ")}`}
              >
                <span className="day">
                  <span className="text">{day.date}</span>
                </span>

                <span className="ind"></span>
              </button>
            );
          })}
      </div>
    </div>
  );
}

const chevronLeft = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
  </svg>
);

const chevronRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path d="M7.33 24l-2.83-2.829 9.339-9.175-9.339-9.167 2.83-2.829 12.17 11.996z" />
  </svg>
);

const chevronUp = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path d="M0 16.67l2.829 2.83 9.175-9.339 9.167 9.339 2.829-2.83-11.996-12.17z" />
  </svg>
);
const chevronDown = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z" />
  </svg>
);

const restart = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path d="M13.5 2c-5.629 0-10.212 4.436-10.475 10h-3.025l4.537 5.917 4.463-5.917h-2.975c.26-3.902 3.508-7 7.475-7 4.136 0 7.5 3.364 7.5 7.5s-3.364 7.5-7.5 7.5c-2.381 0-4.502-1.119-5.876-2.854l-1.847 2.449c1.919 2.088 4.664 3.405 7.723 3.405 5.798 0 10.5-4.702 10.5-10.5s-4.702-10.5-10.5-10.5z" />
  </svg>
);

const months = [
  {
    mName: "January",
    mNumber: 1,
  },
  {
    mName: "February",
    mNumber: 2,
  },
  {
    mName: "March",
    mNumber: 3,
  },
  {
    mName: "April",
    mNumber: 4,
  },
  {
    mName: "May",
    mNumber: 5,
  },
  {
    mName: "June",
    mNumber: 6,
  },
  {
    mName: "July",
    mNumber: 7,
  },
  {
    mName: "August",
    mNumber: 8,
  },
  {
    mName: "September",
    mNumber: 9,
  },
  {
    mName: "October",
    mNumber: 10,
  },
  {
    mName: "November",
    mNumber: 11,
  },
  {
    mName: "December",
    mNumber: 12,
  },
];
