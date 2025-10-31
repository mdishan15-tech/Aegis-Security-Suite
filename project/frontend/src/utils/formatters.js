export const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num);
};

export const maskEmail = (email) => {
  const [username, domain] = email.split('@');
  return username.slice(0, 2) + '*'.repeat(username.length - 2) + '@' + domain;
};

export const maskPhone = (phone) => {
  return phone.replace(/\d(?=\d{4})/g, '*');
};