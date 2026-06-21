// Mobile nav toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
menuToggle.addEventListener('click', () => navMenu.classList.toggle('show'));
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navMenu.classList.remove('show'));
});

// Menu tab switching
const tabs = document.querySelectorAll('.menu-tab');
const sections = document.querySelectorAll('.menu-section');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    sections.forEach(s => s.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

// Header shrink on scroll
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  header.style.padding = window.scrollY > 50 ? '8px 5%' : '14px 5%';
});

// Reservation form -> sends to backend (server/server.js) at /api/reserve
const reservationForm = document.getElementById('reservationForm');
if (reservationForm) {
  reservationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const statusEl = document.getElementById('formStatus');
    const submitBtn = reservationForm.querySelector('button[type="submit"]');

    const data = {
      name: reservationForm.name.value,
      email: reservationForm.email.value,
      phone: reservationForm.phone.value,
      datetime: reservationForm.datetime.value,
      notes: reservationForm.notes.value
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    statusEl.textContent = '';

    try {
      const res = await fetch('http://localhost:5000/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();

      if (res.ok) {
        statusEl.style.color = 'green';
        statusEl.textContent = 'Thank you! Your reservation request has been sent.';
        reservationForm.reset();
      } else {
        statusEl.style.color = 'red';
        statusEl.textContent = result.error || 'Something went wrong. Please try again.';
      }
    } catch (err) {
      statusEl.style.color = 'red';
      statusEl.textContent = 'Could not reach server. Is the backend running on port 5000?';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Confirm Reservation';
    }
  });
}