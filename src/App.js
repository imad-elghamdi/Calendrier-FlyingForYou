import './App.css';
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import React, { useState, useEffect, useRef } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import MyCalendar from './components/Calendar';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import fr from "date-fns/locale/fr";
import Clock from './components/clock';

registerLocale("fr", fr);
setDefaultLocale("fr");

const locales = {
    "fr-FR": require("date-fns/locale/fr")
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
})

const events = [
    {
        title: "",
        allDay: true,
        start: new Date(2023, 10, 0),
        end: new Date(2023, 10, 0)
    },
]

function App() {
    const [newEvent, setNewEvent] = useState({ title: "", start: new Date(), end: new Date() });
    const [eventsList, setEventsList] = useState(events);
    const [startTime, setStartTime] = useState("00:00");
    const [endTime, setEndTime] = useState("00:00");
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    const formRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (formRef.current && !formRef.current.contains(event.target)) {
                // Clic en dehors du formulaire, masquer le formulaire
                setIsFormVisible(false);
            }
        }

        // Ajouter le gestionnaire d'événements au document lorsque le formulaire est visible
        if (isFormVisible) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            // Retirer le gestionnaire d'événements lorsque le formulaire n'est pas visible
            document.removeEventListener("mousedown", handleClickOutside);
        }

        // Nettoyer le gestionnaire d'événements lors du démontage du composant
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isFormVisible]);

    function handleAddEvent() {
        const startTimeDate = new Date(newEvent.start);
        const [startHour, startMinute] = startTime.split(":").map(Number);
        startTimeDate.setHours(startHour);
        startTimeDate.setMinutes(startMinute);

        const endTimeDate = new Date(newEvent.end);
        const [endHour, endMinute] = endTime.split(":").map(Number);
        endTimeDate.setHours(endHour);
        endTimeDate.setMinutes(endMinute);

        const newEventWithTime = {
            title: `${newEvent.title} - ${newEvent.calendarText}`,
            start: startTimeDate,
            end: endTimeDate
        };

        const updatedEventsList = [...eventsList, newEventWithTime];
        setEventsList(updatedEventsList);
        setNewEvent({ title: "", start: new Date(), end: new Date() });
        setStartTime("00:00");
        setEndTime("00:00");
        setIsFormVisible(false); // Masquer le formulaire après l'ajout de l'événement
    }

    

    

    function handleDeleteEvent(eventToDelete) {
        const updatedEventsList = eventsList.filter(event => event !== eventToDelete);
        setEventsList(updatedEventsList);
    }
    return (
        <div className="App">
            <MyCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500, margin: "50px" }}
                onDateSelect={setSelectedDate}
            />

            <div>
                <button className='add-button' onClick={() => setIsFormVisible(true)}>+</button>
            </div>
            {isFormVisible && <div className="overlay"></div>}

            {/* Affichage du formulaire si isFormVisible est true */}
            {isFormVisible && (
                <div className="form-container">
                    <form ref={formRef}>
                        <div className="form-title">Add Title</div>
                        <div className="form-separator"></div>

                        <div className="form-row">
                            <div className="form-date-time">
                                <span className="form-icon">📅</span>
                                <DatePicker
                                    locale="fr"
                                    placeholderText="Start Date"
                                    selected={newEvent.start}
                                    onChange={(start) => setNewEvent({ ...newEvent, start })}
                                    className="form-input form"
                                />
                            </div>

                            <div className="form-date-time">
                                <DatePicker
                                    locale="fr"
                                    placeholderText="End Date"
                                    selected={newEvent.end}
                                    onChange={(end) => setNewEvent({ ...newEvent, end })}
                                    className="form-input form form2"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-date-time">
                                <span className="form-icon1">🕒</span>
                                <Clock
                                    selectedTime={newEvent.start}
                                    onSelectTime={(hour, minute) => {
                                        setStartTime(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
                                    }}
                                />
                                <select
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="form-input form"
                                >
                                    {Array.from({ length: 24 }, (_, index) => (
                                        <option key={index} value={`${index.toString().padStart(2, '0')}:00`}>
                                            {`${index.toString().padStart(2, '0')}:00`}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-date-time">
                                <select
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="form-input form2"
                                >
                                    {Array.from({ length: 24 }, (_, index) => (
                                        <option key={index} value={`${index.toString().padStart(2, '0')}:00`}>
                                            {`${index.toString().padStart(2, '0')}:00`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <textarea
                                name="comments"
                                value={newEvent.calendarText}
                                onChange={(e) => setNewEvent({ ...newEvent, comments: e.target.value })}
                                placeholder="Add Comments"
                                className="form-input textarea"
                            />
                        </div>
                        <button className="form-button" onClick={handleAddEvent}>
                            Add
                        </button>
                    </form>
                </div>


            )}

            <Calendar
                localizer={localizer}
                events={eventsList}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500, margin: "50px" }}
                defaultDate={new Date()}
                date={selectedDate}
                view="day"
                onView={() => { }}
                toolbar={true}
                components={{
                    event: ({ event }) => (
                        <div>
                            {event.title}
                            <button
                                className="event-delete-button"
                                onClick={() => handleDeleteEvent(event)}
                            >
                                X
                            </button>
                        </div>
                    ),
                    toolbar: ({ label }) => (
                        <div className="current-date">
                            {localizer.format(selectedDate, "dd MMMM", { locale: locales["fr-FR"] })}
                        </div>
                    ),
                }}
            />
        </div>
    );

}

export default App;
