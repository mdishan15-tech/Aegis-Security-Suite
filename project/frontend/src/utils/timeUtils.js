export const formatUTCDate = (date) => {
  return new Date(date).toISOString().replace('T', ' ').substr(0, 19);
};

export const getCurrentUTCTime = () => {
  return new Date().toISOString().replace('T', ' ').substr(0, 19);
};

export const getRelativeTime = (timestamp) => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
  return `${Math.floor(diffMins / 1440)}d ago`;
};