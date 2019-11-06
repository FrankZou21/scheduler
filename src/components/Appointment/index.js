import React from "react";

import Header from "components/Appointment/Header.js";
import Show from "components/Appointment/Show.js";
import Empty from "components/Appointment/Empty.js";
import Form from "components/Appointment/Form.js";
import Status from "components/Appointment/Status.js";
import Confirm from "components/Appointment/Confirm.js";
import Error from "components/Appointment/Error.js";

import "components/Appointment/styles.scss";
import useVisualMode from "hooks/useVisualMode.js";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const CONFIRM = "CONFIRM";
  const ERROR = "ERROR";
  const DELETING = "DELETING";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id, interview)
      .then((err) => {
        transition(SHOW);
      })
      .catch((err) => {
        transition(ERROR, true);
      })
  }

  function deleting() {
    transition(DELETING, true);
    props.cancelInterview(props.id)
      .then(() => {
        transition(EMPTY);
      })
      .catch((err) => {
        transition(ERROR, true);
      })
  }

  let formInput = "";
  if (props.interview) {
    formInput = props.interview.student;
  }



  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />

      {mode === EMPTY && <Empty onAdd={() => { transition(CREATE) }} />}

      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => {
            transition(CONFIRM)
          }}
          onEdit={() => {
            transition(CREATE)
          }}
        />
      )}

      {mode === CREATE &&
        <Form
          name={formInput}
          interviewers={props.interviewers}
          interviewer={""}
          onSave={(name, interviewer) => {
            save(name, interviewer)
          }}
          onCancel={() => { back() }}
        />}

      {mode === SAVING && (
        <Status
        message={"Saving"}
        />
      )}

      {mode === DELETING && (
        <Status
        message={"Deleting"}
        />
      )}

      {mode === CONFIRM &&
        <Confirm
          message={"Are you sure you would like to delete?"}
          onConfirm={() => {
            deleting()
          }}
          onCancel={() => { back() }}
        />}

      {mode === ERROR && (
        <Error
        onClose={() => {
          back();
        }}
        />
      )}

    </article>
  );
}
