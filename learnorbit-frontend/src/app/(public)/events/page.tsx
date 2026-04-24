import { getAllEvents, Event } from "@/lib/services/events.service";
import EventsClient from "@/components/events/EventsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Events | LearnOrbit",
    description: "Join upcoming webinars, workshops, and community meetups at LearnOrbit.",
};

// Next.js will revalidate this page every 60 seconds (ISR)
// This ensures fast loads while keeping data fresh.
export const revalidate = 60;

export default async function EventsPage() {
    let events: Event[] = [];
    
    try {
        const res = await getAllEvents();
        if (res.success) {
            events = res.events || [];
        }
    } catch (error) {
        console.error("Error fetching events in server component:", error);
    }

    return <EventsClient initialEvents={events} />;
}
