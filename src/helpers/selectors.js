export function getAppointmentsForDay(state, day) {
  const selectedDay = state.days.filter(eachDay => eachDay.name === day);
  if (selectedDay[0] === undefined) {
    return [];
  }
  const appointmentList = selectedDay[0].appointments;
  const updatedAppointments = [];
  for (let i = 0; i < appointmentList.length; i++) {
    updatedAppointments.push(state.appointments[appointmentList[i]]);
  }
  return updatedAppointments;
}



export function getInterview(state, interview) {
  let interviewerObj;
  if (interview === null) {
    return null;
  }
  for (const interviewerId in state.interviewers) {
    if (Number(interviewerId) === interview.interviewer) {
      interviewerObj = state.interviewers[interviewerId];
    }
  }

  const interviewObj = {
    student: interview.student,
    interviewer: interviewerObj
  }
  
  return interviewObj;
};

//Interviewers
export function getInterviewersForDay(state, day) {
  const selectedDay = state.days.filter(eachDay => eachDay.name === day);
  if (selectedDay[0] === undefined) {
    return [];
  }
  const interviewerList = selectedDay[0].interviewers;
  const updatedInterviewers = [];
  for (let i = 0; i < interviewerList.length; i++) {
    updatedInterviewers.push(state.interviewers[interviewerList[i]]);
  }
  return updatedInterviewers;
}