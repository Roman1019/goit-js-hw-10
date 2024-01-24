import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const startButton = document.querySelector('[data-start]');
let timerActive = false;
let timerIntervalId;
const input = document.querySelector('#datetime-picker');
let endTime;
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const userSelectedDate = selectedDates[0];
    const now = new Date();

    if (userSelectedDate <= now) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
      endTime = userSelectedDate; //Оновлюємо endTime з обраною датою
    }
  },
};

const datePicker = flatpickr(input, options);

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

function updateTimer() {
  const now = new Date();
  const userSelectedDate = endTime;
  const timeDiff = userSelectedDate - now;

  if (timeDiff <= 0) {
    clearInterval(timerIntervalId);
    iziToast.success({
      title: 'Success',
      message: 'Timer reached zero!',
    });
    startButton.disabled = false;
    input.disabled = false;
    timerActive = false; // Додаємо скидання прапорця
    return;
  }

  const { days, hours, minutes, seconds } = convertMs(timeDiff);
  document.querySelector('[data-days]').textContent = addLeadingZero(days);
  document.querySelector('[data-hours]').textContent = addLeadingZero(hours);
  document.querySelector('[data-minutes]').textContent =
    addLeadingZero(minutes);
  document.querySelector('[data-seconds]').textContent =
    addLeadingZero(seconds);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

startButton.addEventListener('click', function () {
  if (!timerActive && endTime && endTime > new Date()) {
    input.disabled = true;
    timerIntervalId = setInterval(updateTimer, 1000);
    this.disabled = true;
    timerActive = true;
  } else if (!endTime || endTime <= new Date()) {
    iziToast.error({
      title: 'Error',
      message: 'Please choose a valid future date before starting the timer.',
    });
  } else {
    console.log('Timer is already active.');
  }
});
