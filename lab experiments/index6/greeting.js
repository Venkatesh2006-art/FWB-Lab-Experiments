const form = document.getElementById('greeting-form');
const messageDiv = document.getElementById('greeting-message');

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const mood = document.getElementById('mood').value;

  if (!name || !mood) {
    alert("Please enter your name and select your mood.");
    return;
  }

  // Get current hour
  const hour = new Date().getHours();
  let timeGreeting = '';

  if (hour < 12) {
    timeGreeting = 'Good Morning';
  } else if (hour < 18) {
    timeGreeting = 'Good Afternoon';
  } else {
    timeGreeting = 'Good Evening';
  }

  // Set dynamic message
  const moodText = `You seem ${mood}!`;
  messageDiv.textContent = `${timeGreeting}, ${name}! ${moodText}`;

  // Apply mood class for color
  messageDiv.className = `show ${mood}`;
});
