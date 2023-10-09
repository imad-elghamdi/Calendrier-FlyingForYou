import React, { useState } from 'react';

const Clock = ({ selectedTime, onSelectTime }) => {
    const [hour, setHour] = useState(selectedTime.getHours());
    const [minute, setMinute] = useState(selectedTime.getMinutes());

    const handleHourChange = (newHour) => {
        setHour(newHour);
        onSelectTime(newHour, minute);
    };

    const handleMinuteChange = (newMinute) => {
        setMinute(newMinute);
        onSelectTime(hour, newMinute);
    };
    const handleClockClick = (event) => {
        const clockRect = event.target.getBoundingClientRect();
        const centerX = clockRect.left + clockRect.width / 2;
        const centerY = clockRect.top + clockRect.height / 2;
        const clickX = event.clientX - centerX;
        const clickY = event.clientY - centerY;
        const angle = Math.atan2(clickY, clickX);

        const totalMinutes = (angle * 180) / Math.PI / 6;
        const newHour = Math.floor(totalMinutes / 60);
        const newMinute = Math.round(totalMinutes % 60);


        handleHourChange(newHour);
        handleMinuteChange(newMinute);
    };
    return (
        <div className="clock-picker">
            {/* Affichez votre horloge ronde personnalisée ici */}
            {/* Vous pouvez utiliser des éléments SVG pour créer l'horloge */}
            {/* Ajoutez des gestionnaires d'événements pour sélectionner l'heure et les minutes */}
            <svg
        onClick={handleClockClick}
        className="clock-svg"
        viewBox="-50 -50 100 100"
        >
        <circle cx="0" cy="0" r="40" fill="none" stroke="black" strokeWidth="4" />
        <line x1="0" y1="0" x2="0" y2="100" stroke="black" strokeWidth="4" />
        <line x1="0" y1="100" x2="100" y2="100" stroke="black" strokeWidth="4" />
        <line x1="100" y1="100" x2="100" y2="0" stroke="black" strokeWidth="4" />
        </svg>
        </div>
    );
};

export default Clock;
