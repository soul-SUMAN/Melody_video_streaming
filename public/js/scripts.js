
const backendURL = "https://moodie-melody.onrender.com";
console.log("JavaScript loaded successfully");

// Login form submission
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        console.log('Attempting login with:', { username });
        try {
            const response = await fetch(`${backendURL}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: username, password }),
            });

            if (response.ok) {
                const data = await response.json(); // Assuming backend sends { isAdmin, userId, etc. }
                localStorage.setItem('user', JSON.stringify({ name: username, isAdmin: data.isAdmin })); 
                alert('Login successful');
                // Redirect to the homepage
                window.location.href = 'index.html';

            } else {
                console.warn('Login failed');
                alert('Invalid credentials');
                window.location.href = 'register.html'; // Redirect to register
            }
        } catch (error) {
            console.error('Error during login:', error);
            window.location.href = 'register.html';  // Redirect on error

        }
    });
}

// Register form submission
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        console.log('Attempting registration with:', { username });
        try {
            const response = await fetch(`${backendURL}/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: username, password }),
            });

            if (response.ok) {
                const data = await response.json(); // Expect a JSON object with success message
                console.log(data.message);
                alert('Registration successful');
                window.location.href = 'login.html'; // Redirect to login page

            } else {
                const errorData = await response.json(); // Expect a JSON object with an error message
                console.warn('Registration failed:', errorData.error);
                alert(errorData.error || 'Registration failed');
            }
        } catch (error) {
            console.error('Error during registration:', error);
        }
    });
}

// Admin video upload
const uploadForm = document.getElementById('uploadForm');
if (uploadForm) {
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const loggedInUser = JSON.parse(localStorage.getItem('user'));

        // Restrict access for non-admin users
        if (!loggedInUser || !loggedInUser.isAdmin) {
            alert('You are not an admin. Only admins can upload videos.');
            return;
        }

        const formData = new FormData(uploadForm);  // Create FormData object to handle file upload

        try {
            const response = await fetch(`${backendURL}/videos/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': JSON.stringify(loggedInUser), // Pass user details
                },
                body: formData  // Send the form data and the video file
            });

            if (response.ok) {
                console.log('Video uploaded successfully');
                alert('Video uploaded successfully');
                uploadForm.reset();  // Clear the form after a successful upload
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Error uploading video');
            }
        } catch (error) {
            console.error('Error during video upload:', error);
        }
    });
}

//fatch videos

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const videoList = document.getElementById('video-list');
    const profileInfo = document.getElementById('profile-info');

    // Function to fetch and display videos
    const fetchVideos = async (query = '') => {
        try {
            const endpoint = query
                ? `${backendURL}/videos/search?title=${query}`
                : `${backendURL}/videos/all`;
            const response = await fetch(endpoint);
            if (response.ok) {
                const videos = await response.json();
                videoList.innerHTML = ''; // Clear existing videos
                videos.forEach(video => {
                    const videoItem = document.createElement('div');
                    videoItem.className = 'video-item';

                    const loggedInUser = JSON.parse(localStorage.getItem('user')); // Assuming user info is stored in localStorage

                    videoItem.innerHTML = `
                        <div class="video-card">
                            <div class="main-video">
                                <video controls width="800">
                                    <source src="${backendURL}${video.videoPath}" type="video/mp4">
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                            <div class="video-title-describ">
                                <div class="little-card">
                                    <h2>${video.title}</h2>
                                    <p>${video.description}</p>
                                </div>
                               
                            </div>
                              
                        </div>
                           ${loggedInUser && loggedInUser.isAdmin ? `
                            <button class="delete-btn" data-video-id="${video._id}">Delete</button>
                            ` : ''}
                        
                    `;
                    
                    console.log(video); // this to inspect the video object

                    videoList.appendChild(videoItem);
                });
            } else {
                console.error('Failed to fetch videos');
            }
        } catch (error) {
            console.error('Error fetching videos:', error);
        }
    };

    // Search functionality
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        fetchVideos(query); // Fetch videos based on search query
    });

    // Display all videos on page load
    fetchVideos();

    const usernameSpan = document.getElementById('username');
    const userTypeSmall = document.getElementById('user-type');
    
    const loggedInUser = JSON.parse(localStorage.getItem('user')); // Assuming user info is saved in localStorage
    if (loggedInUser && loggedInUser.name) {
        usernameSpan.textContent = loggedInUser.name; // Set the username
        userTypeSmall.textContent = loggedInUser.isAdmin ? 'Admin' : 'User'; // Set user type
    } else {
        usernameSpan.textContent = 'Guest'; // Default for guests
        userTypeSmall.textContent = ''; // No user type for guests
    }
    
});

document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const videoId = e.target.getAttribute('data-video-id');
        if (confirm('Are you sure you want to delete this video?')) {
             try {
                    // Retrieve logged-in user from localStorage
                    const loggedInUser = JSON.parse(localStorage.getItem('user'));
                    
                    // Check if user is logged in
                    if (!loggedInUser) {
                        alert('You need to log in as an admin to delete videos.');
                        return;
                    }
                const response = await fetch(`${backendURL}/videos/${videoId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': JSON.stringify(loggedInUser), // Pass user details
                    },
                });

                if (response.ok) {
                    alert('Video deleted successfully!');
                    e.target.parentElement.remove(); // Remove the video item from the DOM
                } else {
                    const errorData = await response.json();
                    alert(errorData.message || 'Failed to delete the video.');
                }
            } catch (error) {
                console.error('Error deleting video:', error);
                alert('An error occurred while trying to delete the video.');
            }
        }
    }
});

// document.addEventListener('DOMContentLoaded', () => {
//     const usernameSpan = document.getElementById('username');
//     const userTypeSmall = document.getElementById('user-type');

//     // Retrieve logged-in user from localStorage
//     const loggedInUser = JSON.parse(localStorage.getItem('user'));

//     if (loggedInUser && loggedInUser.name) {
//         usernameSpan.textContent = loggedInUser.name; // Set the username
//         userTypeSmall.textContent = loggedInUser.isAdmin ? 'Admin' : 'User'; // Set user type
//     } else {
//         usernameSpan.textContent = 'Guest'; // Default for guests
//         userTypeSmall.textContent = ''; // No user type for guests
//     }
// });

const logout = () => {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
};
