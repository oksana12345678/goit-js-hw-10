import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const inputDateTimePicker = document.getElementById('datetime-picker');
const btnStart = document.querySelector('[data-start]');
const timerFields = document.querySelectorAll('.timer .value');

let userSelectedDate = null;
let countdownInterval = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
  },
};
flatpickr(inputDateTimePicker, options);

function checkValidData() {
  if (!userSelectedDate || userSelectedDate <= new Date()) {
    iziToast.error({
      title: 'Error',
      message: 'Please choose a date in the future',
      position: 'topRight',
    });
    btnStart.disabled = true;
  } else {
    btnStart.disabled = false;
    iziToast.success({
      title: 'Success',
      message: 'The countdown has started',
      position: 'topRight',
    });
  }
}

function addLeadingZero(value) {
  return value < 10 ? '0' + value : value;
}

function updateTimer() {
  const now = new Date();
  const msDifference = userSelectedDate - now;
  if (msDifference <= 0) {
    clearInterval(countdownInterval);

    timerFields.forEach(field => (field.textContent = '00'));
    return;
  }

  const { days, hours, minutes, seconds } = convertMs(msDifference);
  timerFields[0].textContent = addLeadingZero(days);
  timerFields[1].textContent = addLeadingZero(hours);
  timerFields[2].textContent = addLeadingZero(minutes);
  timerFields[3].textContent = addLeadingZero(seconds);
}

btnStart.addEventListener('click', e => {
  if (userSelectedDate <= new Date()) {
    iziToast.error({
      title: 'Error',
      message: 'Please choose a date in the future',
      position: 'topRight',
    });
    return;
  }
  iziToast.success({
    title: 'Success',
    message: 'The countdown has started',
    position: 'topRight',
  });

  btnStart.disabled = true;
  inputDateTimePicker.disabled = true;
  updateTimer();
  countdownInterval = setInterval(updateTimer, 1000);
});

document.addEventListener('DOMContentLoaded', function () {
  btnStart.disabled = true;
});

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
