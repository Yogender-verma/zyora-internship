const body = document.body;
const themeToggle = document.querySelector('#theme-toggle');
const form = document.querySelector('.contact-form');
const formMessage = document.querySelector('#form-message');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const darkModeEnabled = body.classList.contains('dark-mode');
    themeToggle.textContent = darkModeEnabled ? '☀️ Light Mode' : '🌙 Dark Mode';
    themeToggle.setAttribute('aria-pressed', String(darkModeEnabled));
    console.log('Theme toggled:', darkModeEnabled ? 'dark mode' : 'light mode');
  });
}

function showFieldError(input, message) {
  input.classList.add('is-invalid');
  const error = document.createElement('p');
  error.className = 'form-error';
  error.textContent = message;
  input.parentElement.appendChild(error);
  console.log('Field error:', message);
}

function clearErrors() {
  document.querySelectorAll('.form-error').forEach((error) => error.remove());
  document.querySelectorAll('.is-invalid').forEach((input) => input.classList.remove('is-invalid'));
}

function showFormMessage(message, type) {
  if (!formMessage) return;
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
  console.log(`Form message [${type}]:`, message);
}

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    console.log('Form submitted');

    clearErrors();
    showFormMessage('', '');

    const nameInput = document.querySelector('#name');
    const emailInput = document.querySelector('#email');
    const messageInput = document.querySelector('#message');
    const name = nameInput?.value.trim() || '';
    const email = emailInput?.value.trim() || '';
    const message = messageInput?.value.trim() || '';
    let isValid = true;

    if (!name) {
      showFieldError(nameInput, 'Name is required');
      isValid = false;
    }

    if (!email) {
      showFieldError(emailInput, 'Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      showFieldError(emailInput, 'Enter a valid email');
      isValid = false;
    }

    if (!message) {
      showFieldError(messageInput, 'Message is required');
      isValid = false;
    }

    if (!isValid) {
      showFormMessage('Please fix the highlighted fields and try again.', 'error');
      return;
    }

    showFormMessage('Thanks! Your message has been sent successfully.', 'success');
    form.reset();
    console.log('Form validation passed');
  });
}
