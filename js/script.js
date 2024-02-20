document.addEventListener("DOMContentLoaded", function() {
    const imageContainer = document.getElementById("imageContainer");
    const emailInput = document.getElementById("emailInput");
    const chooseEmailSelect = document.querySelector(".chooseEmail");
    const buttonSubmit = document.getElementById("buttonSubmit");
    const buttonSave = document.getElementById("buttonSave");
    const galleryContainer = document.getElementById("galleryContainer");
    const form = document.getElementById("form");
    const alertContainer = document.getElementById("alertContainer");
    const findSpan = document.getElementById("find-button");

    let currentEmail = "";
    let currentImageURL = "";

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

    // Function to fetch a random low-resolution image
    async function fetchRandomImage() {
        // Generate a random image ID within the range of 1 to 1080
        const imageId = getRandomNumberInRange(1, 1080);
        
        // Construct the image URL with the generated image ID
        const imageURL = `https://picsum.photos/id/${imageId}/200/300`;

        // Return the constructed image URL
        return imageURL;
    }

    // Fetch a random image when the page is loaded
    fetchRandomImage().then(imageURL => {
        updateImage(imageURL);
        currentImageURL = imageURL;
    });

    // Event listener for the "Find" span button
    findSpan.addEventListener("click", async function() {
        console.log("Find span clicked");
        try {
            const imageURL = await fetchRandomImage();
            updateImage(imageURL);
            currentImageURL = imageURL;
        } catch (error) {
            console.error("Error fetching random image:", error);
        }
    });

    // Function to add a new email option to the select element and local storage
    function addEmailOption(email) {
        console.log("Submitted email:", email);
        // Check if email format is valid
        const isValidEmail = validateEmail(email);
        if (!isValidEmail) {
            showAlert("Please enter a valid email address.");
            return;
        }

        // Check if email already exists
        if (!emailData[email]) {
            emailData[email] = [];
            localStorage.setItem("emailData", JSON.stringify(emailData));

            // Add email to chooseEmailSelect
            const option = document.createElement("option");
            option.textContent = email;
            chooseEmailSelect.appendChild(option);
        }
    }

    // Event listener for the "Submit" button
    buttonSubmit.addEventListener("click", function() {
        console.log("Submit button clicked");
        const email = emailInput.value.trim();
        addEmailOption(email);
        populateChooseEmailSelect();
    });

    // Manually handle form submission
    form.addEventListener("submit", function(event) {
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
    chooseEmailSelect.addEventListener("change", function() {
        const selectedEmail = chooseEmailSelect.value;
        console.log("Selected email:", selectedEmail);
        // Update the current email
        currentEmail = selectedEmail;
        // Update the gallery for the selected email
        updateGallery(selectedEmail);

        // Enable or disable the save button based on the selected email
        buttonSave.disabled = selectedEmail === "Choose your Email";
    });

    // Function to update the gallery with stored images for a specific email
    function updateGallery(email) {
        console.log("Updating gallery for email:", email);
        const galleryImages = emailData[email] || [];
        galleryContainer.innerHTML = "";
        galleryImages.forEach(imageURL => {
            const img = document.createElement("img");
            img.src = imageURL;
            img.addEventListener("click", function() {
                // Remove the clicked image from the email's gallery
                const index = emailData[email].indexOf(imageURL);
                if (index !== -1) {
                    emailData[email].splice(index, 1);
                    localStorage.setItem("emailData", JSON.stringify(emailData));
                    updateGallery(email);
                }
            });
            galleryContainer.appendChild(img);
        });
    }

    // Event listener for the "Save" button
    buttonSave.addEventListener("click", function() {
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
            }
        } else {
            showAlert("Please generate an image before saving.");
        }
    });

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
        setTimeout(() => {
            alertContainer.textContent = "";
        }, 3000);
    }
});
