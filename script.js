document.addEventListener('DOMContentLoaded', () => {

    // --- BLOG LOADER ---
    // This is the link to YOUR Google Sheet. Make sure it's "Published to the web" as a CSV.
    const blogSheetUrl = 'https://docs.google.com/spreadsheets/d/12lvQ4-d4zkHGk9FVaB06WC0EG5YpUAfR4sfMYCSWTZw/pub?output=csv';
    const blogContainer = document.getElementById('blog-container');

    fetch(blogSheetUrl)
        .then(response => response.text())
        .then(csvText => {
            const rows = csvText.split('\n').slice(1); // Split into rows and remove header
            blogContainer.innerHTML = ''; // Clear the 'Loading...' message

            if (rows.length === 0 || (rows.length === 1 && rows[0].trim() === '')) {
                blogContainer.innerHTML = '<p>No blog posts yet. Check back soon!</p>';
                return;
            }
            
            rows.reverse().forEach(row => { // Reverse to show latest posts first
                const columns = row.split(',');
                // CSV columns: Date,Title,Content,VideoURL,ImageURL
                const postDate = columns[0] ? columns[0].trim() : '';
                const postTitle = columns[1] ? columns[1].trim() : '';
                const postContent = columns[2] ? columns[2].trim() : '';
                const videoUrl = columns[3] ? columns[3].trim() : '';

                const card = document.createElement('div');
                card.className = 'blog-card';

                let videoEmbedHtml = '';
                if (videoUrl) {
                    // Convert standard YouTube URL to embeddable URL
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
            blogContainer.innerHTML = '<p>Could not load blog posts. Please try again later.</p>';
        });

    // --- WHATSAPP CONSULTATION FORM ---
    const consultationForm = document.getElementById('consultation-form');
    consultationForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('patient-name').value;
        const age = document.getElementById('patient-age').value;
        const issue = document.getElementById('health-issue').value;

        // The doctor's WhatsApp number (country code without '+')
        const doctorWhatsAppNumber = '9779708163535';

        const message = `*Free Consultation Request*\n\n*Name:* ${name}\n*Age:* ${age}\n*Health Issue:* ${issue}\n\n_Sent from the website._`;

        // Create the WhatsApp link
        const whatsappUrl = `https://wa.me/${doctorWhatsAppNumber}?text=${encodeURIComponent(message)}`;

        // Open the link in a new tab
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