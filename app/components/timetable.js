"use client";

import { useState } from "react";
import "./timetable.css";

export default function Timetable({ timeSlots, updateTimeSlots }) {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [selectedDay, setSelectedDay] = useState();
  const [selectedTime, setSelectedTime] = useState("");

  const handleClick = (i) => {
    setSelectedDay(i);
    setSelectedTime("");
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  const handleAddTime = () => {
    if (selectedTime !== "" && selectedDay !== undefined) {
      const dayKey = weekdays[selectedDay];
      const newTimeSlots = { ...timeSlots };
      newTimeSlots[dayKey] = [...(newTimeSlots[dayKey] || []), selectedTime];
      updateTimeSlots(newTimeSlots);
      setSelectedTime("");
    }
  };

  const handleRemoveTime = (day, index) => {
    const newTimeSlots = { ...timeSlots };
    newTimeSlots[day].splice(index, 1);
    updateTimeSlots(newTimeSlots);
  };

  const generateTimeOptions = () => {
    const timeOptions = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const hourString = hour.toString().padStart(2, "0");
        const minuteString = minute.toString().padStart(2, "0");
        timeOptions.push(`${hourString}:${minuteString}`);
      }
    }
    return timeOptions;
  };

  return (
    <>
      <div className="weekday-container">
        {weekdays.map((day, i) => (
          <div key={i}>
            <div className={"flex justify-center text-center"}>{day}</div>
            <div
              className={`weekday ${
                selectedDay === i ? "orange-bg" : timeSlots[day] && timeSlots[day].length > 0 ? "green-bg" : ""
              }`}
              onClick={() => handleClick(i)}
            ></div>
          </div>
        ))}
      </div>
      {selectedDay !== undefined && (
        <div className="time-slots">
          <select value={selectedTime} onChange={handleTimeChange} className="time-input">
            <option value="">시간</option>
            {generateTimeOptions().map((timeOption, index) => (
              <option key={index} value={timeOption}>
                {timeOption}
              </option>
            ))}
          </select>
          <button className="add-time-button" onClick={handleAddTime}>
            +
          </button>
        </div>
      )}
      <div className="selected-time-slots">
        {selectedDay !== undefined &&
          timeSlots[weekdays[selectedDay]] &&
          timeSlots[weekdays[selectedDay]].map((time, index) => (
            <div key={index} className="selected-time-slot">
              {time}
              <button className="remove-time-button" onClick={() => handleRemoveTime(weekdays[selectedDay], index)}>
                -
              </button>
            </div>
          ))}
      </div>
    </>
  );
}
