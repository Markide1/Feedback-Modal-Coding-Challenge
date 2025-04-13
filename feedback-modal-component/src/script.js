// Wait for DOM to be fully loaded before running our code
document.addEventListener('DOMContentLoaded', function () {

  // Get all DOM elements
  const openModalBtn = document.getElementById('openModalBtn');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const cancelBtn = document.getElementById('cancelBtn');
  const submitBtn = document.getElementById('submitBtn');
  const ratingOptions = document.querySelectorAll('.rating-option');

  // Variable to store which rating user selects
  let selectedRating = null;

  // Event Listeners - connect buttons to functions
  openModalBtn.addEventListener('click', openModal);
  modalClose.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);

  // Close modal if user clicks outside the modal box
  modalOverlay.addEventListener('click', function (e) {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  submitBtn.addEventListener('click', submitFeedback);

  // Set up click handlers for all rating options
  ratingOptions.forEach(option => {
    option.addEventListener('click', function () {
      // First remove selected class from all options
      ratingOptions.forEach(opt => opt.classList.remove('selected'));

      // Then add selected class to the one that was clicked
      this.classList.add('selected');

      // Save the selected rating value
      selectedRating = parseInt(this.getAttribute('data-value'));
      console.log(`Rating selected: ${selectedRating}`);
    });
  });

  // Function to open the modal
  function openModal() {
    modalOverlay.classList.add('active');

    // Reset any previous selection
    ratingOptions.forEach(opt => opt.classList.remove('selected'));
    selectedRating = null;
  }

  // Function to close the modal
  function closeModal() {
    modalOverlay.classList.remove('active');
  }

  // Function to handle when user submits their feedback
  function submitFeedback() {
    // Check if a rating was selected
    if (selectedRating === null) {
      alert('Please select a rating before submitting.');
      return;
    }

    // Get current date and time
    const now = new Date();

    // Format the date as YYYY-MM-DD
    const date = now.toISOString().split('T')[0];

    // Format the time as HH:MM:SS
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const time = `${hours}:${minutes}:${seconds}`;

    // Create feedback data object with time
    const feedbackData = {
      rating: selectedRating,
      date: date,
      time: time,
      timestamp: now.getTime() // Store milliseconds for sorting/filtering later
    };

    // Save feedback to localStorage
    saveFeedbackToStorage(feedbackData);

    // Thank the user
    alert(`Thank you for your feedback! You rated: ${selectedRating}/10`);

    // Close the modal
    closeModal();
  }

  // Function to save feedback to localStorage
  function saveFeedbackToStorage(data) {
    try {
      // Try to get existing feedback from localStorage
      let allFeedback = [];

      // If there's already feedback stored, get it
      const storedFeedback = localStorage.getItem('feedbackData');
      if (storedFeedback) {
        allFeedback = JSON.parse(storedFeedback);
      }

      // Add new feedback to the array
      allFeedback.push(data);

      // Save back to localStorage
      localStorage.setItem('feedbackData', JSON.stringify(allFeedback));

      // Log to console for debugging
      console.log('Feedback saved:', data);
      console.log('All feedback:', allFeedback);
    } catch (error) {
      // In case localStorage isn't available or has errors
      console.error('Error saving feedback:', error);
    }
  }
});