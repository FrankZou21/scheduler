import React, { useState, useEffect } from "react";

import "components/Application.scss";
import DayList from "components/DayList.js"
import Appointment from "components/Appointment/index.js"
import axios from 'axios';


const appointments = [
  {
    id: 1,
    time: "12pm",
  },
  {
    id: 2,
    time: "1pm",
    interview: {
      student: "Lydia Miller-Jones",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  },
  {
    id: 3,
    time: "2pm",
    interview: {
      student: "Jason Ja",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  },
  {
    id: 4,
    time: "3pm",
    interview: {
      student: "Andy Ko",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  },
  {
    id: 5,
    time: "4pm",
    interview: {
      student: "Frank Zou",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  },
];



// const [term, setTerm] = useState("");
//   const [results, setResults] = useState([]);

//   useEffect (() => {
//     axios.get(`https://itunes.apple.com/search?term=${term}&country=CA&media=music&entity=album&attribute=artistTerm`)
//       .then((response) => {
//         setResults(response.data.results);
//       })
//   }, [term])



export default function Application(props) {
  const [day, setday] = useState("Monday");
  const [days, setdays] = useState([]);

  useEffect (() => {
    axios.get("http://localhost:8001/api/days")
      .then((response) => {
        setdays(response.data);
      })
  }, []);

  const Appointments = appointments.map((Appointmentt) => {    
    return (
      <Appointment key={Appointmentt.id} {...Appointmentt} />
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
            days={days}
            day={day}
            // setDay={day => setday(day)}
            setDay={setday}
          /></nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {Appointments}
        <Appointment key="last" time="5pm" />
      </section>
    </main>

  );
}
