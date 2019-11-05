import React, { useState, useEffect, useReducer } from "react";
import axios from 'axios';
import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW,
  UPDATE_SPOT
} from "reducers/application";

export default function useApplicationData() {



const [state, dispatch] = useReducer(reducer, {
  day: "Monday",
  days: [],
  appointments: {},
  interviewers: {}
});

const setDay = day => dispatch({type:SET_DAY, value: day});

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8001/api/days"),
      axios.get("http://localhost:8001/api/appointments"),
      axios.get("http://localhost:8001/api/interviewers")
    ]).then((all) => {
      dispatch({ type:SET_APPLICATION_DATA, value: all})
    });
  }, []);

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.put(`http://localhost:8001/api/appointments/${id}`, appointment)
      .then(() => {
        dispatch({type:SET_INTERVIEW, value: appointments});
        const dayId = findDayId(state.day)
        let updatedSpots = 0;
        if (state.appointments[id].interview) {
          updatedSpots = state.days[dayId].spots;
        } else {
          updatedSpots = state.days[dayId].spots - 1;
        }
        const day = {
          ...state.days[dayId],
           spots:updatedSpots
        }
        const days = [
          ...state.days,
        ]
        days[dayId] = day
        dispatch({type:UPDATE_SPOT, value:days});
      })
  }

  function cancelInterview(appointmentId) {
    const appointment = {
      ...state.appointments[appointmentId],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [appointmentId]: appointment
    };

    return axios.delete(`http://localhost:8001/api/appointments/${appointmentId}`)
      .then(() => {
        dispatch({type:SET_INTERVIEW, value: appointments});
        const dayId = findDayId(state.day)
        const updatedSpots = state.days[dayId].spots + 1
        const day = {
          ...state.days[dayId],
           spots:updatedSpots
        }
        const days = [
          ...state.days,
        ]
        days[dayId] = day
        dispatch({type:UPDATE_SPOT, value:days});
      })
  }

  function findDayId(dayValue) {
    if (dayValue === "Monday") {
      return 0;
    } else if (dayValue === "Tuesday") {
      return 1;
    } else if (dayValue === "Wednesday") {
      return 2;
    } else if (dayValue === "Thursday") {
      return 3;
    } else if (dayValue === "Friday") {
      return 4;
    }
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}