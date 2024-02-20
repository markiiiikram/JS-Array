document.addEventListener("DOMContentLoaded", function() {
    const findButton = document.getElementById("find-button");
    const imageContainer = document.getElementById("imageContainer");
    const emailInput = document.getElementById("emailInput");
    const galleryOpen = document.getElementById("gallery-open");
    const buttonSubmit = document.getElementById("buttonSubmit");
    const buttonSave = document.getElementById("buttonSave");
    const chooseEmailSelect = document.querySelector(".chooseEmail");
    const galleryContainer = document.getElementById("galleryContainer");

    let currentEmail = "";
    let currentImageURL = "";

    // Retrieve emails and images from local storage
    let emailData = JSON.parse(localStorage.getItem("emailData")) || {};

    // Populate chooseEmailSelect with stored emails
    populateChooseEmailSelect();

    // Fetch a random image from Picsum and display it on page load
    fetchAndDisplayRandomImage();

    // Function to fetch a random image from Picsum and display it
    async function fetchAndDisplayRandomImage() {
        try {
            const imageURL = await fetchRandomImage();
            updateImage(imageURL);
            currentImageURL = imageURL;
        } catch (error) {
            console.error("Error fetching random image:", error);
        }
    }

    // Function to fetch a random low-resolution image from Picsum
    async function fetchRandomImage() {
        const response = await fetch("https://picsum.photos/200/300");
        if (!response.ok) {
            throw new Error("Failed to fetch image");
        }
        return response.url;
    }

    // Function to update the displayed image
    function updateImage(imageURL) {
        const imageElement = document.createElement("img");
        imageElement.src = imageURL;
        imageContainer.innerHTML = ""; // Clear previous image
        imageContainer.appendChild(imageElement);
        currentImageURL = imageURL;
    }

    // Event listener for the "Find" button
    findButton.addEventListener("click", async function() {
        fetchAndDisplayRandomImage();
    });

    // Event listener for the "Submit" button
    buttonSubmit.addEventListener("click", function() {
        const email = emailInput.value.trim();
        if (email !== "") {
            addEmailOption(email);
            emailInput.value = ""; // Clear the input field
        }
    });

    // Function to add a new email option to the select element and local storage
    function addEmailOption(email) {
        if (!emailData[email]) {
            emailData[email] = [];
            localStorage.setItem("emailData", JSON.stringify(emailData));
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
            if (selectedEmail === "Choose your Email") {
                alert("Please select an email before saving.");
                return;
            }
            emailData[selectedEmail].push(currentImageURL);
            localStorage.setItem("emailData", JSON.stringify(emailData));
            updateGallery(currentImageURL);
            currentImageURL = "";
        } else {
            alert("Please generate an image before saving.");
        }
    });

    // Function to update the gallery with the saved images
    function updateGallery(imageURL) {
        const imageElement = document.createElement("img");
        imageElement.src = imageURL;
        galleryContainer.appendChild(imageElement);
    }
});
