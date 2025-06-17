document.addEventListener('DOMContentLoaded', () => {

    // --- BLOG LOADER ---
    // THIS IS THE CORRECT, UPDATED LINK FOR YOUR GOOGLE SHEET.
    const blogSheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT07wSm0WbPJ8aS4u37kzF3H5RKcrvHl6HyNglXnOgrK4zTuAE4GUWoSKl5p73Td9BWjuVFBvNwDTPl/pub?output=csv';
    const blogContainer = document.getElementById('blog-container');

    // Simple fetch function to bypass aggressive caching
    fetch(blogSheetUrl + '&t=' + new Date().getTime())
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(csvText => {
            // Trim whitespace from the text to handle empty files properly
            csvText = csvText.trim();
            const rows = csvText.split('\n').slice(1); // Split into rows and remove header
            blogContainer.innerHTML = ''; // Clear the 'Loading...' message

            if (rows.length === 0 || (rows.length === 1 && rows[0].trim() === '')) {
                blogContainer.innerHTML = '<p style="text-align:center; grid-column: 1 / -1;">No blog posts yet. Dr. Amit will be adding content soon!</p>';
                return;
            }
            
            rows.reverse().forEach(row => { // Reverse to show latest posts first
                // A more robust way to handle commas inside content
                const columns = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g).map(col => col.replace(/"/g, ''));
                
                const postDate = columns[0] ? columns[0].trim() : '';
                const postTitle = columns[1] ? columns[1].trim() : '';
                const postContent = columns[2] ? columns[2].trim() : '';
                const videoUrl = columns[3] ? columns[3].trim() : '';

                if (!postTitle) return; // Skip empty rows

                const card = document.createElement('div');
                card.className = 'blog-card';

                let videoEmbedHtml = '';
                if (videoUrl) {
                    const videoId = getYouTubeID(videoUrl);
                    if (videoId) {
                        videoEmbedHtml = `
                            <div class="video-container">
                                <iframe src="https://www.youtube.com/embed/${videoId}" 
                                        frameborder="0" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        allowfullscreen></iframe>
                            </div>
                        `;
                    }
                }

                card.innerHTML = `
                    ${videoEmbedHtml}
                    <div class="blog-card-content">
                        <h3>${postTitle}</h3>
                        <p class="date">${postDate}</p>
                        <p>${postContent}</p>
                    </div>
                `;
                blogContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error fetching blog posts:', error);
            blogContainer.innerHTML = '<p style="text-align:center; grid-column: 1 / -1;">Could not load blog posts at the moment. Please try again later.</p>';
        });

    // --- WHATSAPP CONSULTATION FORM ---
    const consultationForm = document.getElementById('consultation-form');
    consultationForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('patient-name').value;
        const age = document.getElementById('patient-age').value;
        const issue = document.getElementById('health-issue').value;
        const doctorWhatsAppNumber = '9779708163535';
        const message = `*Free Consultation Request*\n\n*Name:* ${name}\n*Age:* ${age}\n*Health Issue:* ${issue}\n\n_Sent from the website._`;
        const whatsappUrl = `https://wa.me/${doctorWhatsAppNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });

    // Helper function to extract YouTube video ID from various URL formats
    function getYouTubeID(url) {
        let ID = '';
        url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
        if (url[2] !== undefined) {
            ID = url[2].split(/[^0-9a-z_\-]/i);
            ID = ID[0];
        } else {
            ID = url;
        }
        return ID;
    }
});
