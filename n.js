// Notification Data
const unreadMessages = [
  { 
    title: "BUP", 
    content: "BUP | Model Test + Question Bank | মাত্র ৯৯ টাকায় ",
            link: "https://chorcha.net/landing/biplobi-bup-24?_promo=dgcc20&affiliate=SU-PpAF-XFtcSqsO" ,  // Link for Update available
    imageUrl: "https://i.ibb.co.com/NyBcWgH/PAYL1-Mk-DGzuie-Kyoili-Vq.webp" // Example image URL, optional

  },
  { 
    title: "Science Department  ", 
    content: "ইঞ্জিনিয়ারিং + মেডিকেল+ ভার্সিটি 'ক' প্যাকেজ!", 
    link: "https://chorcha.net/landing/biplobi-24-admission?_promo=dgcc20&affiliate=SU-PpAF-XFtcSqsO" , // Link for Update available
    imageUrl: "https://i.ibb.co.com/0Gr3hCM/1732345057581.jpg"
  },
    { 
    title: "Arts Department", 
    content: " ২৬ টি ভার্সিটির যেকোনো ১টি হতে পারে তোমার ক্যাম্পাস!শুধু বাংলা, ইংলিশ ও সাধারণ জ্ঞান পড়েই", 
    link: "https://chorcha.net/landing/biplobi-24-b-unit?_promo=dgcc20&affiliate=SU-PpAF-XFtcSqsO" , // Link for Update available
    imageUrl: "https://i.ibb.co.com/F4BZp07/HEf-Hig-YB-LUsvf-E8-R7e-Qt.webp"
  },
    { 
    title: "Commerce Department", 
    content: "কমার্সের শিক্ষার্থীরা এডমিশনে সেরা হতে চাও? ১ প্যাকেজেই BBA+Varsity C+ IBA+ বিভাগ পরিবর্তন", 
    link: "https://chorcha.net/landing/biplobi-24-c-unit?_promo=dgcc20&affiliate=SU-PpAF-XFtcSqsO" , // Link for Update available
    imageUrl: "https://i.ibb.co.com/BrzjBCf/k-Mhl6h5q-VCzq-LEIZn-LVp-F.webp"
  },
{ 
    title: "Powered by ", 
    content: "© olosbd.com"

  }

];
const cacheName = "notification-v06";

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
        <a href="${message.link}" class="notification-link" target="_blank">চর্চা শুরু করো ☞  ${message.title}</a>
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