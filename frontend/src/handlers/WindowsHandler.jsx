import WindowsLogCard from '../logCards/WindowsLogCard'

const WindowsHandler = ({ alerts, onStatusUpdate }) => {
  // Only show alerts with required fields
  const validAlerts = alerts.filter(
    alert => alert && alert.alert_id && alert.generated_at
  );

  return (
    <div className="mt-6 pb-20 font-jetBrains_mono">
      {validAlerts.length === 0 ? (
        <p className="text-gray-500 text-sm">No alerts yet....</p>
      ) : (
        validAlerts.map((alert) => (
          <WindowsLogCard
            key={alert.alert_id}
            alert={alert}
            onStatusUpdate={onStatusUpdate}
          />
        ))
      )}
    </div>
  );
};

export default WindowsHandler;