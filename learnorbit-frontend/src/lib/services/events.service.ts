import { get, post } from '../api';

export interface Event {
    id: string | number;
    title: string;
    description: string | null;
    date: string;
    location: string | null;
    image_url: string | null;
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    registration_fields: any[];
    is_paid: boolean;
    price: number;
    qr_code_url: string | null;
    created_at?: string;
}

/**
 * Fetch all public events
 */
export const getAllEvents = async (): Promise<{ success: boolean; events: Event[] }> => {
    // In server components, we might need a full URL if relative calls fail, 
    // but usually the custom 'get' handles it via NEXT_PUBLIC_API_URL.
    return get<{ success: boolean; events: Event[] }>('/events');
};

/**
 * Register for an event
 */
export const registerForEvent = async (data: {
    event_id: string | number;
    form_data: Record<string, any>;
    payment_screenshot_url?: string;
    transaction_id?: string;
}): Promise<{ success: boolean; message?: string }> => {
    return post<{ success: boolean; message?: string }>('/events/register', data);
};
