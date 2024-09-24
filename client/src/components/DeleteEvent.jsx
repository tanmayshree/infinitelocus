import React from 'react';
import { useNavigate } from 'react-router-dom';

const DeleteEvent = ({ eventId, events, setEvents }) => {

      const handleDelete = async () => {
            const confirmed = window.confirm('Are you sure you want to delete this event?');
            if (confirmed) {
                  const response = await fetch(`/api/events/${eventId}`, {
                        method: 'DELETE',
                        headers: {
                              'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                  });

                  if (response.ok) {
                        setEvents(events.filter((event) => event._id !== eventId))
                  } else {
                        console.log('Failed to delete event');
                  }
            }
      };

      return <button onClick={handleDelete}>Delete</button>;
};

export default DeleteEvent;
