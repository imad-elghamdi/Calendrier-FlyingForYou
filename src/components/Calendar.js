import React, { useState, useEffect } from 'react';
import { format, startOfMonth, addMonths, subMonths, getDay, isSameMonth, isSameDay } from 'date-fns';
import './calendar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

function MyCalendar({ currentDate, onDateSelect, events }) {
    const [selectedDate, setSelectedDate] = useState('');
    const [displayDate, setDisplayDate] = useState(new Date());

    const handleDateClick = (date) => {
        setSelectedDate(date);
        onDateSelect(date);
    };

    const renderCalendar = () => {
        const firstDayOfMonth = startOfMonth(displayDate);
        // const lastDayOfMonth = endOfMonth(displayDate);
        // const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });
        const firstDayOfWeek = getDay(firstDayOfMonth);

        return (
            <div className="calendar">
                <table>
                    <tbody>
                        {Array.from({ length: 6 }, (_, weekIndex) => (
                            <tr key={weekIndex}>
                                {Array.from({ length: 7 }, (_, dayIndex) => {
                                    const dayNumber = weekIndex * 7 + dayIndex - firstDayOfWeek + 1;
                                    const date = new Date(displayDate.getFullYear(), displayDate.getMonth(), dayNumber);

                                    const isInCurrentMonth = isSameMonth(date, displayDate);

                                    const className = isInCurrentMonth
                                        ? isSameDay(date, selectedDate)
                                            ? 'selected'
                                            : ''
                                        : 'other-month';
                                    console.log("props.events:", events);
                                    const eventsForDate = events && events.filter(event => isSameDay(event.start, date));

                                    return (
                                        <td
                                            key={format(date, 'dd-MM-yyyy')}
                                            onClick={() => handleDateClick(date)}
                                            className={className}
                                        >
                                            {format(date, 'd')}
                                            <ul>
                                                {eventsForDate?.map(event => (
                                                    <li key={event?.title}>{event?.title}</li>
                                                ))}
                                            </ul>
                                        </td>
                                    );

                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const incrementMonth = () => {
        setDisplayDate(addMonths(displayDate, 1));
    };

    const decrementMonth = () => {
        setDisplayDate(subMonths(displayDate, 1));
    };

    useEffect(() => {
        if (currentDate) {
            setDisplayDate(new Date(currentDate));
        }
    }, [currentDate]);

    return (
        <div className="calendar-right">
            <div className="calendar-header">
                <span onClick={decrementMonth} className='left'><FontAwesomeIcon icon={faChevronLeft} /></span>
                <span className="month-transition">{format(displayDate, 'MMMM yyyy')}</span>
                <span onClick={incrementMonth} className='right'><FontAwesomeIcon icon={faChevronRight} /></span>
                <hr className="separator" />
            </div>

            <div id="calendar-container">{renderCalendar()}</div>
        </div>
    );
}

export default MyCalendar;
