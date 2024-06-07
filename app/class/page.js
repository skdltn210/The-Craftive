"use client";

import { Map, MapMarker } from "react-kakao-maps-sdk";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import useFetch from "@/hooks/useFetch";

export default function Page() {
  const { data: session } = useSession();
  const router = useRouter();
  const mapRef = useRef(null);

  const [locations, setLocations] = useState([]);
  const [classInfo, setClassInfo] = useState();
  const [mapLocation, setMapLocation] = useState({ center: { lat: 37.631128, lng: 127.078165 }, level: 4 });
  const [searchInput, setSearchInput] = useState("");
  const [searchList, setSearchList] = useState([]);
  const [numPeople, setNumPeople] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState();
  const [selectedTimeError, setSelectedTimeError] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMapLocation({
          center: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          level: 4,
        });
      },
      (error) => console.log(error)
    );
  }, []);

  const locationsData = useFetch("/api/class/locations");
  const reservationsData = useFetch("/api/class/reservedClass");

  useEffect(() => {
    if (locationsData) {
      setLocations(locationsData);
    }
  }, [locationsData]);

  useEffect(() => {
    if (reservationsData) {
      setReservations(reservationsData);
    }
  }, [reservationsData]);

  const sortTimes = (times) => {
    return times.sort((a, b) => {
      return new Date("1970/01/01 " + a) - new Date("1970/01/01 " + b);
    });
  };

  const handleCardClick = (location) => {
    setClassInfo(location);
    setMapLocation({ center: { lat: parseFloat(location.y), lng: parseFloat(location.x) }, level: 4 });

    const today = new Date();
    if (location && location.timeSlots) {
      handleDateChange(today, location.timeSlots);
    } else {
      setAvailableTimes([]);
    }

    if (mapRef.current) {
      mapRef.current.setLevel(4);
    }
  };

  const handleDateChange = (date, timeSlots) => {
    setSelectedDate(date);
    const selectedDay = date.toLocaleDateString("en-US", { weekday: "short" });
    if (timeSlots && timeSlots[selectedDay]) {
      const times = timeSlots[selectedDay];
      setAvailableTimes(times);
    } else {
      setAvailableTimes([]);
    }
  };

  const getSearchData = (e) => {
    setSearchInput(e.target.value.toLowerCase());
    setSearchList([]);
  };

  const handleSearch = () => {
    const filteredLocations = locations.filter((location) => {
      const { name, artistName, address } = location;
      const searchString = searchInput.trim().toLowerCase();
      return (
        name.toLowerCase().includes(searchString) ||
        artistName.toLowerCase().includes(searchString) ||
        address.toLowerCase().includes(searchString)
      );
    });
    setSearchList(filteredLocations);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleNumPeopleClick = (num) => {
    setNumPeople(num);
  };

  const formatDate = (date) => {
    const options = { month: "numeric", day: "numeric", weekday: "short" };
    return new Intl.DateTimeFormat("ko-KR", options).format(date);
  };

  const handleCalendarChange = (date) => {
    handleDateChange(date, classInfo && classInfo.timeSlots);
  };

  const handleReservation = () => {
    if (!selectedTime) {
      setSelectedTimeError(true);
      return;
    }
    if (!session) {
      router.push("login");
      return;
    }

    const reservationInfo = {
      artistName: classInfo.artistName,
      workshopName: classInfo.name,
      address: classInfo.address,
      detailAddress: classInfo.detailAddress,
      date: selectedDate,
      time: selectedTime,
      numPeople: numPeople,
    };

    fetch("/api/class/reservation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reservationInfo),
    })
      .then((response) => {
        if (response.ok) {
          openModal();
        } else {
          console.error("예약 실패:", response.statusText);
        }
      })
      .catch((error) => {
        console.error("예약 요청 실패:", error);
      });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col lg:flex-row lg:flex mt-2">
      <div className="lg:w-1/2 h-auto lg:h-auto">
        <Map
          center={mapLocation.center}
          style={{ width: "100%", height: "120vh" }}
          isPanto={true}
          level={mapLocation.level}
          ref={mapRef}
        >
          {locations.map((location, i) => (
            <MapMarker
              key={i}
              position={{ lat: parseFloat(location.y), lng: parseFloat(location.x) }}
              onClick={() => {
                setClassInfo(location);
                setMapLocation({ center: { lat: parseFloat(location.y), lng: parseFloat(location.x) }, level: 4 });
              }}
            />
          ))}
        </Map>
      </div>
      <div className="lg:w-1/4 lg:p-4 p-4">
        <div className="flex mb-4">
          <input
            type="text"
            className="flex-grow border rounded p-2"
            placeholder="검색"
            onChange={getSearchData}
            onKeyPress={handleKeyPress}
          />
          <button className="border rounded p-2 bg-green-600 text-white" onClick={handleSearch}>
            검색
          </button>
        </div>
        {searchList.length == 0
          ? locations.map((location, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-lg p-4 mb-4 cursor-pointer"
                onClick={() => handleCardClick(location)}
              >
                <h2 className="text-lg font-semibold">{location.name}</h2>
                <p className="text-gray-600">{location.artistName}</p>
              </div>
            ))
          : searchList.map((searchLocation, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-lg p-4 mb-4 cursor-pointer"
                onClick={() => handleCardClick(searchLocation)}
              >
                <h2 className="text-lg font-semibold">{searchLocation.name}</h2>
                <p className="text-gray-600">{searchLocation.artistName}</p>
              </div>
            ))}
      </div>
      <div className="lg:w-1/4 lg:p-4 p-4">
        <div className="h-auto lg:h-full overflow-y-auto">
          {classInfo && (
            <>
              <div className="mb-4">
                <h1 className="text-lg font-bold">{classInfo.name}</h1>
                <p className="text-sm text-gray-600">{classInfo.artistName}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm">{classInfo.description}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm">{classInfo.address}</p>
                <p className="text-sm">{classInfo.detailAddress}</p>
              </div>
              <p className="text-md">인원을 선택해주세요</p>
              <p className="mb-4 text-xs text-gray-400">6명까지 선택 가능합니다</p>
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    className={`flex-grow mx-2 p-2 rounded ${
                      numPeople === num ? "bg-green-600 text-white" : "bg-gray-200"
                    }`}
                    onClick={() => handleNumPeopleClick(num)}
                  >
                    {num}명
                  </button>
                ))}
              </div>
              <div>
                <p className="mb-1">📅 {formatDate(selectedDate)} 시간을 선택해 주세요</p>
                <Calendar
                  onChange={handleCalendarChange}
                  value={selectedDate}
                  minDetail="month"
                  minDate={new Date()}
                  maxDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)}
                  next2Label={null}
                  prev2Label={null}
                  showNeighboringMonth={false}
                />
                {availableTimes.length > 0 ? (
                  <div className="mt-3">
                    <div className="flex flex-wrap -mx-2">
                      {sortTimes(availableTimes).map((time, index) => {
                        const reservationTime = reservations.find((reservation) => {
                          const reservationDate = new Date(reservation.date);
                          return (
                            reservation.time === time &&
                            reservationDate.getFullYear() === selectedDate.getFullYear() &&
                            reservationDate.getMonth() === selectedDate.getMonth() &&
                            reservationDate.getDate() === selectedDate.getDate()
                          );
                        });
                        const isReserved = !!reservationTime;
                        return (
                          <button
                            key={index}
                            type="button"
                            className={`mx-2 my-2 px-4 py-2 rounded-md transition duration-300 ${
                              selectedTime === time
                                ? "bg-green-600 text-white"
                                : isReserved
                                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                                : "bg-gray-200 text-gray-700 hover:bg-green-600 hover:text-white"
                            }`}
                            onClick={() => {
                              if (!isReserved) {
                                setSelectedTime(time);
                                setSelectedTimeError(false);
                              }
                            }}
                            disabled={isReserved}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="mt-3">수업 없음</div>
                )}
                {selectedTimeError && <p className="text-red-500 mt-2">시간을 선택해주세요.</p>}
                <button
                  className="bg-green-600 hover:bg-green-500 rounded-xl px-4 py-2 text-white w-full mt-3"
                  onClick={handleReservation}
                >
                  예약
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md">
            <p className="text-xl font-bold mb-4">예약이 완료되었습니다.</p>
            <button className="bg-green-600 hover:bg-green-500 rounded-md px-4 py-2 text-white" onClick={closeModal}>
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
