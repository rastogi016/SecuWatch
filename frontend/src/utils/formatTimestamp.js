export const getTimestamp = () => {
  const now = new Date();
  return now.toISOString().slice(0, 16).replace("T", "_").replace(":", "-");
};
