// Ensure the DOM is fully loaded before attempting to access elements
document.addEventListener('DOMContentLoaded', (event) => {
  const currentTimeElement = document.getElementById('time');
  const startTimeElement = document.getElementById('start-time');
  const startButton = document.getElementById('start-btn');
  const logButton = document.getElementById('log-btn');
  const stopButton = document.getElementById('stop-btn');
  const logContainer = document.getElementById('log-times-container');
  const alertBackgroundElement = document.getElementById('alert-background');
  const audio = new Audio('beep.wav')
  let incidentTimer = null;
  let alertTimer = null;
  let startTime = null;
  let logTimes = [];
  let alertShown = false;
  let isAudioPlaying = false;

  // Update the current time display
  function updateCurrentTime() {
    const now = new Date();
    currentTimeElement.textContent = now.toLocaleTimeString('en-US', {hour12: false});
  }
  setInterval(updateCurrentTime, 1000);

  // Start the incident timer
    startButton.addEventListener('click', () => {
      if (incidentTimer !== null) {
        clearInterval(incidentTimer);
      }
      startTime = new Date();
      startTimeElement.textContent = `Incident Start: ${startTime.toLocaleTimeString('en-US', {hour12: false})}`;
      console.log(`Time Start: ${startTime}`);
      // Set a flag to ensure the alert is shown only once per 10-minute interval
      incidentTimer = setInterval(() => {
        const now = new Date();
        const minutesPassed = Math.floor((now - startTime) / 60000);
        // Check if 10 minutes have passed
        if (minutesPassed > 0 && minutesPassed % 10 === 0) {
          if (!alertShown) {             
              playAudio()
              // alert('10 minutes have passed!');
              // Instead of showing an alert, change the background color or something of the page and play the audio.
              isAudioPlaying = true;
              alertShown = true; // Set the flag to true after showing the alert
              alertBackgroundElement.className = "bg-danger"
              stopButton.className = "btn btn-outline-dark"
          }
        } else {
          resetAlertTheme()
          alertShown = false;
          isAudioPlaying = false; // Reset the flag if not within the 10-minute interval
        }
      }, 1000); // Check every second
    });

    // Function to request permission to play audio
        function requestAudioPermission() {
          // Check if the browser requires interaction before playing audio
          if (audio.paused && typeof audio.play === 'function') {
          audio.play().then(() => {
              console.log('Audio playback permission granted');
              audio.pause(); // Pause the audio after getting permission
          }).catch(error => {
              console.error('Audio playback permission denied', error);
          });
          }
        }
      
      // Call this function when the user interacts with the page for the first time
      document.addEventListener('click', requestAudioPermission, { once: true });
      
      // Function to play the audio, intended to be called when needed
      function playAudio() {
          if (!audio.paused || audio.currentTime === 0) {
          audio.play().catch(error => {
              console.error('Error playing audio:', error);
          });
          }
      }

      function resetAlertTheme() {
        alertBackgroundElement.className = "";
        stopButton.className = "btn btn-danger";
      }
  // Log the time of the tap
  logButton.addEventListener('click', () => {
      const logTime = new Date();
      logTimes.push({ 
          logTime: logTime
      });  
      
      // Display logTimes in the HTML document
      logContainer.innerHTML = ''; // Clear existing log times
      resetAlertTheme()
      logTimes.forEach(entry => {
        const entryElement = document.createElement('li');
        entryElement.className = 'list-group-item px-5 mx-5';
        entryElement.textContent = `Log Time: ${entry.logTime.toLocaleTimeString()}`;
        entryElement.style.opacity = 0;
        logContainer.appendChild(entryElement);
        
        // Animate the entryElement from opacity 0 to 1
        window.getComputedStyle(entryElement).opacity; // Trigger reflow to ensure the animation starts
        entryElement.style.transition = 'opacity 0.5s ease-in-out';
        entryElement.style.opacity = 1;
      });
    });

  // Stop the incident timer
  stopButton.addEventListener('click', () => {
    incidentTimer = null;
    logTimes = [];
    startTimeElement.innerHTML = ''; // Clear start time
    logContainer.innerHTML = ''; // Clear existing log times
    resetAlertTheme()
  });
});

