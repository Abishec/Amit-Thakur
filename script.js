document.addEventListener('DOMContentLoaded', () => {

    // --- BLOG LOADER ---
    const blogSheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT07wSm0WbPJ8aS4u37kzF3H5RKcrvHl6HyNglXnOgrK4zTuAE4GUWoSKl5p73Td9BWjuVFBvNwDTPl/pub?output=csv';
    const blogContainer = document.getElementById('blog-container');

    fetch(blogSheetUrl + '&t=' + new Date().getTime())
        .then(response => response.text())
        .then(csvText => {
            csvText = csvText.trim();
            const rows = csvText.split('\n').slice(1);
            blogContainer.innerHTML = ''; 

            if (rows.length === 0 || (rows.length === 1 && rows[0].trim() === '')) {
                blogContainer.innerHTML = '<p style="text-align:center; grid-column: 1 / -1;">No blog posts yet. Dr. Amit will be adding content soon!</p>';
                return;
            }
            
            rows.reverse().forEach(row => {
                const columns = row.split(',');
                const postDate = columns[0] ? columns[0].trim() : '';
                const postTitle = columns[1] ? columns[1].trim() : '';
                const postContent = columns[2] ? columns[2].trim().replace(/<br>/g, '<br/>') : '';
                const videoUrl = columns[3] ? columns[3].trim() : '';

                if (!postTitle) return;

                // --- NEW: Create a unique ID for each blog post ---
                const postId = postTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

                const card = document.createElement('div');
                card.className = 'blog-card';
                card.id = postId; // Assign the unique ID to the card

                let videoEmbedHtml = '';
                if (videoUrl) {
                    const videoId = getYouTubeID(videoUrl);
                    if (videoId) {
                        videoEmbedHtml = `<div class="video-container"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe></div>`;
                    }
                }

                // --- NEW: Create a specific URL for this post ---
                const websiteUrl = window.location.origin + window.location.pathname;
                const postUrl = websiteUrl + '#' + postId; // This is the direct link to the blog post
                const shareText = `Check out this health tip from Dr. Amit Kumar Thakur: *${postTitle}*`;

                const shareButtonsHtml = `
                    <div class="share-buttons">
                        <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + postUrl)}" target="_blank" class="share-btn whatsapp"><i class="fab fa-whatsapp"></i> Share</a>
                        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}" target="_blank" class="share-btn facebook"><i class="fab fa-facebook"></i> Share</a>
                        <button class="share-btn copy-link" data-link="${postUrl}"><i class="fas fa-copy"></i> Copy Link</button>
                    </div>
                `;

                card.innerHTML = `
                    ${videoEmbedHtml}
                    <div class="blog-card-content">
                        <h3>${postTitle}</h3>
                        <p class="date">${postDate}</p>
                        <p>${postContent}</p> 
                        ${shareButtonsHtml}
                    </div>
                `;

                blogContainer.appendChild(card);

                const copyButton = card.querySelector('.copy-link');
                copyButton.addEventListener('click', () => {
                    const linkToCopy = copyButton.getAttribute('data-link');
                    navigator.clipboard.writeText(linkToCopy).then(() => {
                        copyButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
                        setTimeout(() => {
                            copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy Link';
                        }, 2000);
                    });
                });
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
        const doctorWhatsAppNumber = '9779708163535';
        const message = `*Free Consultation Request*\n\n*Name:* ${name}\n*Age:* ${age}\n*Health Issue:* ${issue}\n\n_Sent from the website._`;
        const whatsappUrl = `https://wa.me/${doctorWhatsAppNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });

    function getYouTubeID(url) {
        let ID = '';
        if (url) {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            const match = url.match(regExp);
            if (match && match[2].length === 11) { ID = match[2]; }
        }
        return ID;
    }
});
