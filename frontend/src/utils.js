export const normalizeTel = (tel) => {
  return tel.replace(/\D/g, '');
}

export const formatTel = (tel) => {
  if (!tel) return '';
  return `(${tel.slice(0, 2)}) ${tel.slice(2, 7)}-${tel.slice(7)}`;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
};
