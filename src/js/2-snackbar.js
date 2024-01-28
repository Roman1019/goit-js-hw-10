import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const delayInput = form.querySelector('input[name="delay"]');
const stateInputs = form.querySelectorAll('input[name="state"]');
form.addEventListener('submit', function (event) {
  event.preventDefault();
  const selectedState = Array.from(stateInputs).find(input => input.checked);

  const delay = parseInt(delayInput.value, 10);

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (selectedState.value === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });

  promise
    .then(delay => {
      iziToast.success({
        title: 'Success',
        message: `✅ Fulfilled promise in ${delay}ms`,
      });
    })
    .catch(delay => {
      iziToast.error({
        title: 'Error',
        message: `❌ Rejected promise in ${delay}ms`,
      });
    })
    .finally(() => event.currentTarget.reset());
});
