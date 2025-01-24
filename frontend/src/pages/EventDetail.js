import React, { Suspense } from "react";
import EventItem from "../components/EventItem";
import { Await, redirect, useRouteLoaderData } from "react-router-dom";
import EventsList from "../components/EventsList";

const EventDetail = () => {
  // Use the loader data directly (promises)
  const { event, events } = useRouteLoaderData("event-detail");
  console.log("🚀 ~ EventDetail ~ event:", event);

  return (
    <>
      {/* Suspense for the event */}
      <Suspense
        fallback={
          <p style={{ textAlign: "center" }}>Loading event details...</p>
        }
      >
        <Await resolve={event}>
          {(loadedEvent) => <EventItem event={loadedEvent} />}
        </Await>
      </Suspense>

      {/* Suspense for the list of events */}
      <Suspense
        fallback={<p style={{ textAlign: "center" }}>Loading events list...</p>}
      >
        <Await resolve={events}>
          {(loadedEvents) => <EventsList events={loadedEvents} />}
        </Await>
      </Suspense>
    </>
  );
};

export default EventDetail;

async function loadEvent(id) {
  const response = await fetch(`http://localhost:8080/events/${id}`);

  if (!response.ok) {
    throw new Response(
      JSON.stringify({
        message: "Could  not fetch details for selected event.",
        status: 500,
      })
    );
  } else {
    const responseData = await response.json();
    console.log("🚀 ~ loadEvent ~ responseData:", responseData);
    return responseData.event;
  }
}

async function loadEvents() {
  const response = await fetch("http://localhost:8080/events");

  if (!response.ok) {
    // return { isError: true, message: "Could not fetch events." };
    //it renders the closest error element in the routes
    //response allows to use status property
    throw new Response(
      JSON.stringify({
        message: "Could  not fetch events.",
        status: 500,
      })
    );
  }
  const responseData = await response.json();
  return responseData.events;
}

//react router call the function and pass an object
export function loader({ params }) {
  const id = params.eventId;
  return {
    event: loadEvent(id), // This returns a promise
    events: loadEvents(), // This also returns a promise
  };
}

export async function action({ params, request }) {
  const eventId = params.eventId;

  const response = await fetch("http://localhost:8080/events/" + eventId, {
    method: request.method,
  });

  if (!response.ok) {
    throw new Response(
      JSON.stringify({
        message: "Could  not delete event.",
        status: 500,
      })
    );
  }

  return redirect("/events");
}
