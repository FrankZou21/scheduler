import React from "react";
import "components/InterviewerListItem.scss";
let classNames = require('classnames');

export default function InterviewerListItem(props) {
  const interviewerName = classNames("interviewers__item", {
    "interviewers__item--selected": props.selected,
  })
  const interviewerImage = classNames("interviewers__item-image", {
    "interviewers__item--selected-image": props.selected,
  })

  if (props.selected) {
    return (
      <li className={interviewerName} onClick={props.setInterviewer}>
        <img
          className={interviewerImage}
          src={props.avatar}
          alt={props.name}
        />
        {props.name}
      </li>
    );
  } else {
    return (
      <li className={interviewerName} onClick={props.setInterviewer}>
        <img
          className={interviewerImage}
          src={props.avatar}
          alt={props.name}
        />
      </li>
    )
  }
}