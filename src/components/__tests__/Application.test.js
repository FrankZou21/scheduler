import React from "react";
import axios from "axios";

import { render, cleanup, waitForElement, fireEvent, getByText, prettyDOM, getAllByTestId, 
getByAltText, getByPlaceholderText, queryByText} from "@testing-library/react";


import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);
    return waitForElement(() => getByText("Monday"))
      .then(() => {
        fireEvent.click(getByText("Tuesday"));
        expect(getByText("Leopold Silvers")).toBeInTheDocument();
      })
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container, debug } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"))
    const appointments = getAllByTestId(container, "appointment")
    const appointment = appointments[0];
    fireEvent.click(getByAltText(appointment, "Add"))
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"))
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByAltText(appointment, "Loading")).toBeInTheDocument();
    await waitForElement(() => queryByText(appointment, "Lydia Miller-Jones"));
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment")
    const appointment = appointments[1];
    fireEvent.click(getByAltText(appointment, "Delete"))
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();
    fireEvent.click(getByText(appointment, "Confirm"))
    expect(getByAltText(appointment, "Loading")).toBeInTheDocument();
    await waitForElement(() => getByAltText(appointment, "Add"));
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment")
    const appointment = appointments[1];
    fireEvent.click(getByAltText(appointment, "Edit"))
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"))
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Frank Zou" }
    });
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByAltText(appointment, "Loading")).toBeInTheDocument();
    await waitForElement(() => queryByText(appointment, "Frank Zou"));
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"))
    const appointments = getAllByTestId(container, "appointment")
    const appointment = appointments[0];
    fireEvent.click(getByAltText(appointment, "Add"))
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"))
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    axios.put.mockRejectedValueOnce();
    fireEvent.click(getByText(appointment, "Save"));
    await waitForElement(() => queryByText(appointment, "Error"));
    expect(queryByText(appointment, "Error")).toBeInTheDocument();
    fireEvent.click(getByAltText(appointment, "Close"));

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  })

  it("shows the delete error when failing to delete an existing appointment", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"))
    const appointments = getAllByTestId(container, "appointment")
    const appointment = appointments[1];
    fireEvent.click(getByAltText(appointment, "Delete"))
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();
    axios.delete.mockRejectedValueOnce();
    fireEvent.click(getByText(appointment, "Confirm"))
    await waitForElement(() => queryByText(appointment, "Error"));
    expect(queryByText(appointment, "Error")).toBeInTheDocument();
    fireEvent.click(getByAltText(appointment, "Close"));
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  })
})
