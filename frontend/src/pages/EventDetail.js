import React from "react";
import EventItem from "../components/EventItem";
import { useRouteLoaderData } from "react-router-dom";

const EventDetail = () => {
  const data = useRouteLoaderData("event-detail");

  return <EventItem event={data.event} />;
};

export default EventDetail;

//react router call the function and pass an object
export async function loader({ request, params }) {
  const id = params.eventId;

  const response = await fetch(`http://localhost:8080/events/${id}`);

  if (!response.ok) {
    throw new Response(
      JSON.stringify({
        message: "Could  not fetch details for selected event.",
        status: 500,
      })
    );
  } else {
    return response;
  }
}
