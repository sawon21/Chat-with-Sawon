        // Default Configuration
        let CACHE_NAME = "smart_review_cache_v05"; // Default cache name
        const DEFAULT_REVIEWS = [
        
            { name: "Abu Rayhan Rahad", gender: "male", date: "01 Nov 2024", text: "Website টা পুরাই আগুন 🔥 🔥 🔥" },
{ name: "Emon", gender: "male", date: "03 Nov 2024", text: "Admission সময়ের সবচেয়ে গুরুত্বপূর্ণ বিষয়। ধন্যবাদ 😊" }

        ];

        // DOM Elements
        const reviewIcon = document.getElementById("review-icon");
        const reviewBox = document.getElementById("review-box");
        const reviewBadge = document.getElementById("review-badge");
        const reviewsContainer = document.getElementById("reviews");

        // Helper Functions
        const saveToCache = (key, value) => localStorage.setItem(key, JSON.stringify(value));
        const getFromCache = (key) => JSON.parse(localStorage.getItem(key)) || null;
        const updateBadge = (count) => (reviewBadge.textContent = count);
        const renderReviews = (reviews) => {
            reviewsContainer.innerHTML = "";
            reviews.forEach(({ name, gender, date, text }) => {
                // Determine gender icon
                const genderIcon = gender === "male" ? "male" : "female";
                reviewsContainer.innerHTML += `
                    <div class="review">
                        <div class="review-name"><span class="material-icons">${genderIcon}</span>${name}</div>
                        <div class="review-date">${date}</div>
                        <div class="review-text">${text}</div>
                    </div>`;
            });
        };

        // Cache Management
        const checkCache = () => {
            const currentCache = localStorage.getItem("active_cache_name");
            if (currentCache && currentCache !== CACHE_NAME) {
                // New cache detected, clear old cache and update
                localStorage.clear();
                saveToCache(CACHE_NAME, { reviews: DEFAULT_REVIEWS, badgeCount: DEFAULT_REVIEWS.length });
                localStorage.setItem("active_cache_name", CACHE_NAME);
            } else if (!currentCache) {
                // Initialize cache
                saveToCache(CACHE_NAME, { reviews: DEFAULT_REVIEWS, badgeCount: DEFAULT_REVIEWS.length });
                localStorage.setItem("active_cache_name", CACHE_NAME);
            }
        };

        // Initialize Reviews
        const initializeReviews = () => {
            checkCache();
            const data = getFromCache(CACHE_NAME);
            renderReviews(data.reviews);
            updateBadge(data.badgeCount);
        };

        // Toggle Review Box
        reviewIcon.addEventListener("click", () => {
            reviewBox.style.display = reviewBox.style.display === "flex" ? "none" : "flex";

            if (reviewBox.style.display === "flex") {
                const data = getFromCache(CACHE_NAME);
                if (data) {
                    data.badgeCount = 0;
                    saveToCache(CACHE_NAME, data);
                    updateBadge(0);
                }
            }
        });

        // Close Review Box on Outside Click
        document.addEventListener("click", (e) => {
            if (!reviewBox.contains(e.target) && !reviewIcon.contains(e.target)) {
                reviewBox.style.display = "none";
            }
        });

        // Change Cache Name Dynamically
        const updateCacheName = (newName) => {
            CACHE_NAME = newName;
            checkCache(); // Automatically handles the transition
            initializeReviews(); // Reload reviews with the new cache
        };

        // Initialize System
        initializeReviews();

        // Example: Uncomment to test cache name change
        // updateCacheName("smart_review_cache_v2");
