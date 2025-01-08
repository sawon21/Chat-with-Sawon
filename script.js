// Firebase Configuration
var firebaseConfig = {
    apiKey: "AIzaSyBUec5oAEwTE8GZ-pdmr5Rg_54tLITAZHs",
    authDomain: "chat-advance-3c85f.firebaseapp.com",
    databaseURL: "https://chat-advance-3c85f-default-rtdb.firebaseio.com",
    projectId: "chat-advance-3c85f",
    storageBucket: "chat-advance-3c85f.appspot.com",
    messagingSenderId: "42300338182",
    appId: "1:42300338182:web:566cc235c995a371619387"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

// DOM Elements
const signUpPage = document.getElementById("signUpPage");
const chatPage = document.getElementById("chatPage");
const signUpForm = document.getElementById("signUpForm");
const userNameInput = document.getElementById("userName");
const messagesContainer = document.getElementById("messages");
const userMessageInput = document.getElementById("userMessage");
const sendUserMessageButton = document.getElementById("sendUserMessage");

// Global Variables
const adminId = "admin"; // Admin's unique ID
const adminName = "Mehedi"; // Admin's display name
let currentUserName = '';
let currentUserId;

// Check if User is Already Logged In
window.onload = function () {
    if (localStorage.getItem('userId')) {
        currentUserId = localStorage.getItem('userId');
        currentUserName = localStorage.getItem('userName');
        signUpPage.style.display = "none";
        chatPage.style.display = "block";
        document.getElementById("welcomeName").textContent = currentUserName;
        loadChat();
        sendAutoMessages(); // Send Auto Messages (Welcome, Connect Message)
    } else {
        signUpPage.style.display = "block";
        chatPage.style.display = "none";
    }
};

// Sign Up User
signUpForm.addEventListener("submit", function (event) {
    event.preventDefault();
    currentUserName = userNameInput.value.trim();
    if (currentUserName !== "") {
        createUserAccount(currentUserName);
    }
});

// Create User in Firebase
function createUserAccount(name) {
    const newUserId = database.ref().child('users').push().key;
    const userData = {
        name: name,
        firstTimeLogin: true // Mark as first time login
    };

    database.ref('users/' + newUserId).set(userData).then(function () {
        currentUserId = newUserId;
        localStorage.setItem('userId', newUserId);
        localStorage.setItem('userName', name);
        signUpPage.style.display = "none";
        chatPage.style.display = "block";
        document.getElementById("welcomeName").textContent = name;
        loadChat();
        sendAutoMessages(); // Send Auto Messages on first login
    });
}

// Function to send auto messages (welcome and connection attempt)
function sendAutoMessages() {
    // Check if the user is logging in for the first time
    const userRef = database.ref('users/' + currentUserId);
    userRef.once('value', function(snapshot) {
        const userData = snapshot.val();
        if (userData && userData.firstTimeLogin) {
            // Send First Message: Welcome Message from Bot
            const welcomeMessage = `Welcome, ${currentUserName}! Do you want to have a conversation?`;
            sendMessageToFirebase(welcomeMessage, 'bot'); // Send from bot

            // Send Second Message: Notification from Bot about trying to connect Mehedi
            const secondMessage = "We are trying to connect Mehedi Al Hasan Sawon, please wait...";
            sendMessageToFirebase(secondMessage, 'bot'); // Send from bot

            // Mark the First Time Login as Done (to prevent future auto messages)
            userRef.update({ firstTimeLogin: false });

            // Notify Admin that User is Ready (Admin gets notification but no message sent to user directly)
            const adminNotification = `${currentUserName}! Thank you for join us`;
            const timestamp = new Date().toLocaleString();
            const messageData = {
                senderId: "bot", // Mark as bot's message
                senderName: "Bot",
                text: adminNotification,
                timestamp: timestamp
            };

            // Send Notification to Admin (This message doesn't go to the user)
            database.ref("messages/" + adminId + "/" + currentUserId).push(messageData);
        }
    });
}

// Function to send message to Firebase with a sender type (either user or bot)
function sendMessageToFirebase(messageText, senderType = 'user') {
    const timestamp = new Date().toLocaleString(); // Generate Timestamp
    const messageData = {
        senderId: senderType === 'bot' ? 'bot' : currentUserId, // Set bot as sender for bot messages
        senderName: senderType === 'bot' ? 'Bot' : currentUserName, // Show "Bot" as sender for bot messages
        text: messageText,
        timestamp: timestamp
    };

    // Send Message to Admin-User Chat
    database.ref("messages/" + adminId + "/" + currentUserId).push(messageData);
    // Mirror Message in User-Admin Chat
    database.ref("messages/" + currentUserId + "/" + adminId).push(messageData);
}

// Load Chat Between User and Admin
function loadChat() {
    document.getElementById("chatArea").style.display = "block"; // Show Chat Area
    loadMessages(); // Load Existing Messages
}

// Load Messages from Firebase
function loadMessages() {
    database.ref("messages/" + adminId + "/" + currentUserId).on("child_added", function (snapshot) {
        const messageData = snapshot.val();
        const messageKey = snapshot.key;

        // Create Message Container
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");

        // Add Sender's Name with Logo for Admin and Bot
        const senderNameContainer = document.createElement("div");
        senderNameContainer.style.display = "flex";
        senderNameContainer.style.alignItems = "center";
        senderNameContainer.style.marginBottom = "5px";

        // Display Admin Name and Bot Name only
        const senderName = document.createElement("div");
        senderName.style.fontWeight = "bold";
        senderName.style.color = "yellow";
        senderName.style.marginRight = "10px"; // Space between logo and name

        // Only show Admin's name or Bot's name, not the User's name
        if (messageData.senderId === adminId) {
            senderName.textContent = "Mehedi Al Hasan Sawon";  // Admin Name
        } else if (messageData.senderId === 'bot') {
            senderName.textContent = "Bot";  // Bot Name
        }

        const senderLogo = document.createElement("img");

        // Display Logo only for Admin's Messages
        if (messageData.senderId === adminId) {
            senderLogo.src = "verify.png"; // Path to your admin's logo
            senderLogo.style.width = "20px"; // Set the size of the logo
            senderLogo.style.height = "20px"; // Set the size of the logo
            senderLogo.style.borderRadius = "50%"; // Optional: make the logo round
        }

        // Append logo and name
        senderNameContainer.appendChild(senderLogo);
        senderNameContainer.appendChild(senderName);

        // Add Message Content
        const messageContent = document.createElement("span");
        messageContent.textContent = messageData.text;

        // Add Timestamp
        const messageTimestamp = document.createElement("div");
        messageTimestamp.style.fontSize = "0.4em";
        messageTimestamp.style.color = "#888";
        messageTimestamp.textContent = messageData.timestamp;

        // Append Elements to Message Container
        messageElement.appendChild(senderNameContainer);
        messageElement.appendChild(messageContent);
        messageElement.appendChild(messageTimestamp);

        // Add Action Buttons for User's Messages (Optional, but will not be shown for Bot/Admin)
        if (messageData.senderId === currentUserId) {
            const actionsContainer = document.createElement("span");
            actionsContainer.style.float = "right";

            // Edit Button
            const editButton = document.createElement("button");
            editButton.classList.add("btn", "btn-sm", "btn-warning", "ms-2");
            editButton.innerHTML = `<i class="fas fa-edit"></i>`;
            editButton.addEventListener("click", function () {
                editMessage(messageKey, messageData.text);
            });

            // Delete Button
            const deleteButton = document.createElement("button");
            deleteButton.classList.add("btn", "btn-sm", "btn-danger");
            deleteButton.innerHTML = `<i class="fas fa-trash"></i>`;
            deleteButton.addEventListener("click", function () {
                deleteMessage(messageKey);
            });

            // Append Buttons to Actions Container
            actionsContainer.appendChild(editButton);
            actionsContainer.appendChild(deleteButton);
            messageElement.appendChild(actionsContainer);
        }

        messagesContainer.appendChild(messageElement); // Add Message to Chat
        messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to Latest Message
    });
}
// Send User Message
sendUserMessageButton.addEventListener("click", function () {
    const messageText = userMessageInput.value.trim();
    if (messageText !== "") {
        sendMessageToFirebase(messageText, 'user');
        userMessageInput.value = ""; // Clear Input Field
    }
});

// Edit a Message
function editMessage(messageKey, currentText) {
    const newMessage = prompt("Edit your message:", currentText);
    if (newMessage !== null && newMessage.trim() !== "") {
        database.ref("messages/" + adminId + "/" + currentUserId + "/" + messageKey).update({
            text: newMessage
        });
        database.ref("messages/" + currentUserId + "/" + adminId + "/" + messageKey).update({
            text: newMessage
        });
    }
}

// Delete a Message
function deleteMessage(messageKey) {
    if (confirm("Are you sure you want to delete this message?")) {
        database.ref("messages/" + adminId + "/" + currentUserId + "/" + messageKey).remove();
        database.ref("messages/" + currentUserId + "/" + adminId + "/" + messageKey).remove();
    }
}// Auto Scroll to Latest Messages on New Message
messagesContainer.addEventListener("DOMNodeInserted", function () {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
});

// Function to Logout User
function logoutUser() {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    window.location.reload();
}

// Handle Logout Action
const logoutButton = document.getElementById("logoutButton");
logoutButton.addEventListener("click", logoutUser);