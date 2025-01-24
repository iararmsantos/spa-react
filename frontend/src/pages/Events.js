import { Await, useLoaderData } from "react-router-dom";
import EventsList from "../components/EventsList";
import { Suspense } from "react";

function Events() {
  const { events } = useLoaderData();

  // return when using defer
  return (
    <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
      <Await resolve={events}>
        {(loadedEvents) => <EventsList events={loadedEvents} />}
      </Await>
    </Suspense>
  );
  // if (data.isError) {
  //   return <p>{data.message}</p>;
  // }

  // const events = data.events;

  // return (
  //   <>
  //     <EventsList events={events} />
  //   </>
  // );
}

export default Events;

//this code executes in the browser even it is similar with a backend code
//can't use useState because this is not a react component
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

export function loader() {
  return { events: loadEvents() };
}
