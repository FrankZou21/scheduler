import React, { useState, useEffect } from "react";

import "components/Application.scss";
import DayList from "components/DayList.js"
import Appointment from "components/Appointment/index.js"
import axios from 'axios';
import {getAppointmentsForDay, getInterview} from "helpers/selectors.js";

export default function Application(props) {
  // const [day, setday] = useState("Monday");
  // const [days, setdays] = useState([]);
  const setDay = day => setState({ ...state, day });
  // const setDays = days => setState(prev => ({ ...prev, days }));;
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  useEffect (() => {
    Promise.all([
      axios.get("http://localhost:8001/api/days"),
      axios.get("http://localhost:8001/api/appointments"),
      axios.get("http://localhost:8001/api/interviewers")
    ]).then((all) => {
      // console.log(all[2].data); // first
      // console.log(all[1].data); // second
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}));
    });
  }, []);

const appointments = getAppointmentsForDay(state, state.day);

const schedule = appointments.map((appointment) => {
  const interview = getInterview(state, appointment.interview);

  return (
    <Appointment
      key={appointment.id}
      id={appointment.id}
      time={appointment.time}
      interview={interview}
    />
  );
});

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            // setDay={day => setday(day)}
            // setDay={setday}
            setDay={setDay}
            // setState={setState}
          /></nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {schedule}
      </section>
    </main>

);
}
