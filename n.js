// Notification Data
const unreadMessages = [
  { 
    title: "New Message", 
    content: "App Testing...",
    imageUrl: "https://i.ibb.co.com/QbW7FWV/testing-web-app-develop-optimization-icon-software-test-analysis-line-vector-mobile-phone-app-web-ap.jpg" // Example image URL, optional
  },
  { 
    title: "Update Available", 
    content: "A new update is available for your app.", 
    link: "https://spp-test-app.netlify.app/" , // Link for Update available
    imageUrl: "https://i.ibb.co.com/FzPHjBt/app-testing-icon-simple-element-from-vector-34151964.jpg"
  },
{ 
    title: "Powered by ", 
    content: "© olosbd.com", 
   
  }
  
];
const cacheName = "notification-v2";

// Initialize notification badge on load
document.addEventListener("DOMContentLoaded", function() {
  const lastSeenCacheName = localStorage.getItem("notificationCacheName");

  if (unreadMessages.length > 0 && lastSeenCacheName !== cacheName) {
    document.getElementById("badge").textContent = unreadMessages.length;
    document.getElementById("badge").style.display = "flex";
  } else {
    document.getElementById("badge").style.display = "none";
  }
});

// Function to show notification popup with image and link handling
function openPopup() {
  const popupMessagesContainer = document.getElementById("popupMessages");
  popupMessagesContainer.innerHTML = ""; // Clear existing messages

  unreadMessages.forEach(message => {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");

    // Check if there's an image and display it
    if (message.imageUrl) {
      messageDiv.innerHTML = `
        <h3>${message.title}</h3>
        <p>${message.content}</p>
        <img src="${message.imageUrl}" alt="Notification Image" class="message-img">
      `;
    } else {
      messageDiv.innerHTML = `
        <h3>${message.title}</h3>
        <p>${message.content}</p>
      `;
    }

    // Check if there's a link
    if (message.link) {
      messageDiv.innerHTML += `
        <a href="${message.link}" class="notification-link" target="_blank">Go to ${message.title}</a>
      `;
    }

    popupMessagesContainer.appendChild(messageDiv);
  });

  document.getElementById("popup").style.display = "block";
  document.getElementById("badge").style.display = "none";
  localStorage.setItem("notificationCacheName", cacheName);
}

// Function to close notification popup
function closePopup() {
  document.getElementById("popup").style.display = "none";
}

// Attach event listener for notification button
document.getElementById("notificationBtn").addEventListener("click", openPopup);

