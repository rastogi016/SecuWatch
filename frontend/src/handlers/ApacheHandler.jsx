import ApacheLogCard from '../logCards/ApacheLogCard'

const ApacheHandler = ({ alerts}) => {
  return (
    <div className="mt-6 pb-20 font-jetBrains_mono">
      {alerts.length === 0 ? (
        <p className="text-gray-500 text-sm">No alerts yet....</p>
      ) : (
        alerts.map((alert, idx) => <ApacheLogCard key={idx} alert={alert} />)
      )}
    </div>
  );
};

export default ApacheHandler;