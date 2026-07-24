const body = document.body;
const themeToggle = document.querySelector('#theme-toggle');
const form = document.querySelector('.contact-form');
const formMessage = document.querySelector('#form-message');
const apiStatus = document.querySelector('#api-status');
const apiContent = document.querySelector('#api-content');
const refreshButton = document.querySelector('#refresh-data');

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

async function fetchWeatherData() {
  if (apiStatus) {
    apiStatus.textContent = 'Loading…';
  }

  if (apiContent) {
    apiContent.innerHTML = '';
  }

  try {
    const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&daily=temperature_2m_max,temperature_2m_min&timezone=auto');

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    const daily = data?.daily;

    if (!daily?.time?.length || !daily?.temperature_2m_max?.length || !daily?.temperature_2m_min?.length) {
      throw new Error('Unexpected API format');
    }

    const firstDay = daily.time[0];
    const maxTemp = daily.temperature_2m_max[0];
    const minTemp = daily.temperature_2m_min[0];

    if (apiStatus) {
      apiStatus.textContent = `Forecast for ${firstDay}`;
    }

    if (apiContent) {
      apiContent.innerHTML = `
        <div class="api-card">
          <p class="api-label">Today's temperature</p>
          <div class="temperature-row">
            <span class="temp-chip">Max ${maxTemp}°C</span>
            <span class="temp-chip">Min ${minTemp}°C</span>
          </div>
          <p class="api-meta">Location: Berlin, Germany</p>
        </div>
      `;
    }
  } catch (error) {
    console.error('Weather fetch failed:', error);

    if (apiStatus) {
      apiStatus.textContent = "Couldn't fetch data";
    }

    if (apiContent) {
      apiContent.innerHTML = '<p class="api-error">Please try again in a moment.</p>';
    }
  }
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

if (refreshButton) {
  refreshButton.addEventListener('click', () => {
    fetchWeatherData();
  });
}

fetchWeatherData();

