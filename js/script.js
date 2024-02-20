document.addEventListener("DOMContentLoaded", function() {
    const imageContainer = document.getElementById("imageContainer");
    const emailInput = document.getElementById("emailInput");
    const chooseEmailSelect = document.querySelector(".chooseEmail");
    const buttonSubmit = document.getElementById("buttonSubmit");
    const buttonSave = document.getElementById("buttonSave");
    const galleryContainer = document.getElementById("galleryContainer");

    let currentEmail = "";
    let currentImageURL = "";

    // Retrieve emails and images from local storage
    let emailData = JSON.parse(localStorage.getItem("emailData")) || {};

    // Populate chooseEmailSelect with stored emails
    populateChooseEmailSelect();

    // Function to fetch a random low-resolution image
    async function fetchRandomImage() {
        // Fetch a random low-resolution image from picsum.photos
        const response = await fetch("https://picsum.photos/200/300");
        if (!response.ok) {
            throw new Error("Failed to fetch image");
        }
        const imageURL = response.url;
        return imageURL;
    }

    // Function to update the displayed image
    function updateImage(imageURL) {
        // Create a new image element
        const imageElement = document.createElement("img");
        imageElement.src = imageURL;

        // Clear previous image and add the new one
        imageContainer.innerHTML = "";
        imageContainer.appendChild(imageElement);

        // Update the current image URL
        currentImageURL = imageURL;
    }

    // Fetch a random image when the page is loaded
    fetchRandomImage().then(imageURL => {
        updateImage(imageURL);
        currentImageURL = imageURL;
    });

    // Event listener for the "Find" button
    buttonSubmit.addEventListener("click", async function() {
        const newEmail = emailInput.value.trim();

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
        // Check if email format is valid
        const isValidEmail = validateEmail(email);
        if (!isValidEmail) {
            alert("Please enter a valid email address.");
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

    // Function to populate chooseEmailSelect with stored emails
    function populateChooseEmailSelect() {
        chooseEmailSelect.innerHTML = "";
        for (const email in emailData) {
            const option = document.createElement("option");
            option.textContent = email;
            chooseEmailSelect.appendChild(option);
        }
    }

    // Event listener for the "Save" button
    buttonSave.addEventListener("click", function() {
        if (currentImageURL) {
            const selectedEmail = chooseEmailSelect.value;
            emailData[selectedEmail].push(currentImageURL);
            localStorage.setItem("emailData", JSON.stringify(emailData));
            updateGallery(selectedEmail, currentImageURL);
        } else {
            alert("Please generate an image before saving.");
        }
    });

    // Function to update the gallery with saved images for a specific email
    function updateGallery(email, imageURL) {
        const galleryImages = emailData[email];
        galleryContainer.innerHTML = "";
        galleryImages.forEach(imageURL => {
            const img = document.createElement("img");
            img.src = imageURL;
            galleryContainer.appendChild(img);
        });
    }

    // Function to validate email format
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});
