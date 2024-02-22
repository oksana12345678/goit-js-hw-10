import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const inputDateTimePicker = document.getElementById('datetime-picker');
const btnStart = document.querySelector('[data-start]');

let userSelectedDate = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
    if (selectedDates[0] < new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
      btnStart.disabled = true;
    } else {
      userSelectedDate = selectedDates[0];
      btnStart.disabled = false;
    }
  },
};
flatpickr(inputDateTimePicker, options);


btnStart.addEventListener('click', (e) =>{
 
  if (userSelectedDate === null) {
    iziToast.error({
      title: 'Error',
      message: 'Please choose a date',
    });
    return;
  }
  const date = userSelectedDate.toISOString().split('T')[0];
  const time = userSelectedDate.toISOString().split('T')[1].split('.')[0];
  const data = {
    date: date,
    time: time,
  };
  console.log(data);
  e.preventDefault();
})

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}
