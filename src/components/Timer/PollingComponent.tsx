import { useState, useEffect } from 'react';
import StopWatch from './Stopwatch';
import Status from '../Status';

interface PollingComponentProps {
    isAdmin: boolean,
}

const PollingComponent: React.FC<PollingComponentProps> = ({ isAdmin })  => {
    const [activityStatus, setActivityStatus] = useState("NOT_STARTED");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://127.0.0.1:8000/api/poll/15', { method: "GET" }); // Adjust the URL as needed
                if (response.ok) { // Check if the response is ok (status in the range 200-299)
                    const jsonData = await response.json(); // Parse JSON activityStatus from the response
                    setActivityStatus(jsonData);
                }
                setTimeout(fetchData, 1000); // Retry after a short delay even if the request was successful
            } catch (error) {
                console.error('Polling error:', error);
                setTimeout(fetchData, 1000); // Retry after a longer delay if the request failed
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <Status activityStatus={activityStatus} />
            <StopWatch isAdmin={isAdmin} activityStatus={activityStatus} />
        </div>
    );
};

export default PollingComponent;
