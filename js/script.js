////////////////////////////////////////////////////////////
///////////////// DOM Element Retrieval and Initialization
////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", function () {
  const imageContainer = document.getElementById("imageContainer");
  const emailInput = document.getElementById("emailInput");
  const chooseEmailSelect = document.querySelector(".chooseEmail");
  const buttonSubmit = document.getElementById("buttonSubmit");
  const buttonSave = document.getElementById("buttonSave");
  const galleryContainer = document.getElementById("galleryContainer");
  const alertContainer = document.getElementById("alertContainer");

  let currentEmail = "";
  let currentImageURL = "";

  // Hide the save button at the beginning
  buttonSave.style.display = "none";

  ////////////////////////////////////////////////////////////
  ///////////////// Local Storage Handling
  ////////////////////////////////////////////////////////////

  // Retrieve emails and images from local storage
  let emailData = JSON.parse(localStorage.getItem("emailData")) || {};

  // Populate chooseEmailSelect with stored emails
  populateChooseEmailSelect();

  // Function to populate chooseEmailSelect with stored emails
  function populateChooseEmailSelect() {
    // Clear select container
    chooseEmailSelect.innerHTML = "";

    // Add the default "Choose your Email" option
    const defaultOption = document.createElement("option");
    defaultOption.textContent = "Choose your Email";
    chooseEmailSelect.appendChild(defaultOption);

    // Add other email options
    for (const email in emailData) {
      const option = document.createElement("option");
      option.textContent = email;
      chooseEmailSelect.appendChild(option);
    }
  }

  ////////////////////////////////////////////////////////////
  ///////////////// Image Fetching and Display
  ////////////////////////////////////////////////////////////

  // Function to fetch a random low-resolution image
  async function fetchRandomImage() {
    // // Generate a random image ID within the range of 1 to 1080
    const imageId = getRandomNumberInRange(1, 1080);

    // Construct the image URL with the generated image ID
    const imageURL = `https://picsum.photos/seed/${imageId}/900/900`;

    // Return the constructed image URL
    return imageURL;
  }

  // Fetch a random image when the page is loaded
  fetchRandomImage().then((imageURL) => {
    updateImage(imageURL);
    currentImageURL = imageURL;
  });

  // Get the "find" button element
  const findButton = document.getElementById("find-button");

  // Event listener for the "Find" button
  findButton.addEventListener("click", async function () {
    console.log("Find button clicked");
    // Show loading text
    imageContainer.innerHTML = "Loading...";
    try {
      const imageURL = await fetchRandomImage();
      updateImage(imageURL);
      currentImageURL = imageURL;
    } catch (error) {
      console.error("Error fetching random image:", error);
      // If an error occurs, try fetching a new random image
      retryFetchRandomImage();
    }
  });

  // Function to retry fetching a random image
  async function retryFetchRandomImage() {
    try {
      const imageURL = await fetchRandomImage();
      updateImage(imageURL);
      currentImageURL = imageURL;
    } catch (error) {
      console.error("Error retrying to fetch random image:", error);
      showAlert("Failed to load image. Please try again later.");
    }
  }
  ////////////////////////////////////////////////////////////
  ///////////////// Email Handling
  ////////////////////////////////////////////////////////////

  // Function to add a new email option to the select element and local storage
  function addEmailOption(email) {
    console.log("Submitted email:", email);
    // Check if email format is valid
    const isValidEmail = validateEmail(email);
    if (!isValidEmail) {
      showAlert(
        "Please enter a valid email address (e.g., example@example.com)."
      );
      return;
    }

    // Check if email is empty
    if (email.trim() === "") {
      showAlert("Email address cannot be empty.");
      return;
    }

    // Check if email already exists
    if (!emailData[email]) {
      emailData[email] = [];
      localStorage.setItem("emailData", JSON.stringify(emailData));

      // Remove the "Choose your Email" option if it exists
      const chooseEmailOption = chooseEmailSelect.querySelector(
        'option[value="Choose your Email"]'
      );
      if (chooseEmailOption) {
        chooseEmailSelect.removeChild(chooseEmailOption);
      }

      // Add email to chooseEmailSelect
      const option = document.createElement("option");
      option.textContent = email;
      chooseEmailSelect.appendChild(option);
      showAlert(
        "Email has been added successfully. Please select it from the drop down"
      );
      alertContainer.style.backgroundColor = "green";

      // Automatically select the newly added email
      chooseEmailSelect.value = email;
    } else {
      showAlert("Email address already exists.");
      alertContainer.style.backgroundColor = "red";
    }
  }
  // Event listener for the "Submit" button
  buttonSubmit.addEventListener("click", function () {
    console.log("Submit button clicked");
    const email = emailInput.value.trim();
    addEmailOption(email);
    populateChooseEmailSelect();

    // Show the save button after adding or selecting an email
    buttonSave.style.display = "inline-block";
  });

  // Manually handle form submission
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission
  });

  // Function to update the displayed image
  function updateImage(imageURL) {
    console.log("Updating image with URL:", imageURL);
    // Create a new image element
    const imageElement = document.createElement("img");
    imageElement.src = imageURL;

    // Clear previous image and add the new one
    imageContainer.innerHTML = "";
    imageContainer.appendChild(imageElement);

    // Update the current image URL
    currentImageURL = imageURL;
  }

  // Event listener for chooseEmailSelect change
  function updateGallery(email) {
    console.log("Updating gallery for email:", email);
    const galleryImages = emailData[email] || [];
    galleryContainer.innerHTML = "";

    galleryImages.forEach((imageURL) => {
      // Create an anchor element for each image
      const anchor = document.createElement("a");
      anchor.setAttribute("href", imageURL); // Set href attribute to image URL
      anchor.setAttribute("data-lightbox", "email"); // Set data-lightbox attribute to "email"

      // Create the image element
      const img = document.createElement("img");
      img.src = imageURL;
      img.setAttribute("alt", "Gallery Image"); // Set alt attribute

      // Append the image to the anchor
      anchor.appendChild(img);

      // // Create a span element for the icon-x
      // const iconSpan = document.createElement("span");
      // iconSpan.classList.add("icon-x");

      // // Append the icon span to the anchor
      // anchor.appendChild(iconSpan);

      // Append the anchor to the gallery container
      galleryContainer.appendChild(anchor);
    });
  }

  chooseEmailSelect.addEventListener("change", function () {
    const selectedEmail = chooseEmailSelect.value;
    console.log("Selected email:", selectedEmail);
    // Update the current email
    currentEmail = selectedEmail;
    // Update the gallery for the selected email
    updateGallery(selectedEmail);

    // Enable or disable the save button based on the selected email
    buttonSave.style.display =
      selectedEmail === "Choose your Email" ? "none" : "inline-block";
  });

  // Event listener for the "Save" button
  buttonSave.addEventListener("click", function () {
    console.log("Save button clicked");
    if (currentImageURL) {
      if (!emailData[currentEmail]) {
        emailData[currentEmail] = []; // Initialize if it doesn't exist
      }
      // Check if the image URL already exists in the email's gallery
      if (!emailData[currentEmail].includes(currentImageURL)) {
        emailData[currentEmail].push(currentImageURL);
        localStorage.setItem("emailData", JSON.stringify(emailData));
        updateGallery(currentEmail);
      } else {
        showAlert("This image is already saved.");
        alertContainer.style.backgroundColor = "red";
      }
    } else {
      showAlert("Please generate an image before saving.");
      alertContainer.style.backgroundColor = "red";
    }
  });

  ////////////////////////////////////////////////////////////
  ///////////////// Utility Functions
  ////////////////////////////////////////////////////////////

  // Function to generate a random number within a specified range
  function getRandomNumberInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Function to validate email format
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Function to display an alert message
  function showAlert(message) {
    alertContainer.textContent = message;
    alertContainer.classList.remove("hidden"); // Remove the "hidden" class to show the alert container

    // Temporarily change background color to green for "Email has been saved" message
    if (message === "Email has been saved.") {
      alertContainer.style.backgroundColor = "green";
      setTimeout(() => {
        alertContainer.style.backgroundColor = ""; // Reset background color after 5 seconds
      }, 5000);
    }

    setTimeout(() => {
      alertContainer.classList.add("hidden"); // Add the "hidden" class to hide the alert container after 5 seconds
    }, 5000);
  }
});
