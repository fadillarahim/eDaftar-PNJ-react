export const formatDateWithoutTime = (dateString) => {
  const date = new Date(dateString);
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const formattedDate = `${date.getFullYear()}-${
    months[date.getMonth()]
  }-${date.getDate()}`;
  return formattedDate;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  // Ambil informasi tanggal
  const formattedDate = `${date.getFullYear()}-${months[date.getMonth()]}-${date.getDate()}`;

  // Ambil informasi waktu
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  // Gabungkan informasi tanggal dan waktu
  const formattedDateTime = `${formattedDate} ${hours}:${minutes}:${seconds}`;

  // Return hasil gabungan
  return formattedDateTime;
};
