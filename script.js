document.addEventListener('DOMContentLoaded', function() {
    // Sidebar functionality
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const closeSidebar = document.querySelector('.close-sidebar');
    const mainContent = document.querySelector('.maincontent');
    const searchInput = document.querySelector('.option input[type="text"]');

    // Function to toggle sidebar
    function toggleSidebar() {
        if (sidebar && mainContent) {
            sidebar.classList.toggle('active');
            document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
            mainContent.style.marginLeft = sidebar.classList.contains('active') ? '340px' : '0';
        }
    }

    // Search functionality
    function filterCards(searchTerm) {
        const allCards = document.querySelectorAll('.card');
        if (!allCards.length) return;

        searchTerm = searchTerm.toLowerCase();
        allCards.forEach(card => {
            const title = card.querySelector('.cardtitle')?.textContent.toLowerCase() || '';
            const artist = card.querySelector('.cardinfo')?.textContent.toLowerCase() || '';
            
            if (title.includes(searchTerm) || artist.includes(searchTerm)) {
                card.style.display = 'block';
                const container = card.closest('.cards-container, .cards1-container, .card-container');
                if (container) {
                    container.style.display = 'grid';
                }
            } else {
                card.style.display = 'none';
                const container = card.closest('.cards-container, .cards1-container, .card-container');
                if (container) {
                    const visibleCards = container.querySelectorAll('.card[style="display: block;"]');
                    if (visibleCards.length === 0) {
                        container.style.display = 'none';
                    }
                }
            }
        });
    }

    // Add search input event listener
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.trim();
            if (searchTerm.length >= 2) {
                filterCards(searchTerm);
            } else {
                const allCards = document.querySelectorAll('.card');
                allCards.forEach(card => {
                    card.style.display = 'block';
                    const container = card.closest('.cards-container, .cards1-container, .card-container');
                    if (container) {
                        container.style.display = 'grid';
                    }
                });
            }
        });
    }

    // Event listeners for sidebar
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
    if (closeSidebar) {
        closeSidebar.addEventListener('click', toggleSidebar);
    }

    // Close sidebar when clicking outside
    document.addEventListener('click', function(e) {
        if (sidebar && sidebar.classList.contains('active') && 
            !sidebar.contains(e.target) && 
            !sidebarToggle.contains(e.target)) {
            toggleSidebar();
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && sidebar && sidebar.classList.contains('active')) {
            toggleSidebar();
        }
    });

    // Audio player functionality
    let currentAudio = null;
    let isPlaying = false;
    let currentSongIndex = 0;
    let songs = [];

    // Initialize songs array based on the current page
    const songCards = document.querySelectorAll('.card');
    const songRows = document.querySelectorAll('.song-row');
    const audioElements = document.querySelectorAll('audio');
    
    if (songCards.length > 0) {
        // Main page with cards
        songs = Array.from(songCards).map(card => {
            const audio = card.querySelector('audio');
            if (!audio) return null;
            return {
                audio: audio,
                title: card.querySelector('.cardtitle')?.textContent || '',
                artist: card.querySelector('.cardinfo')?.textContent || '',
                image: card.querySelector('img')?.src || ''
            };
        }).filter(song => song !== null);
    } else if (songRows.length > 0) {
        // Songs page with rows
        songs = Array.from(songRows).map((row, index) => {
            const audio = audioElements[index];
            if (!audio) return null;
            return {
                audio: audio,
                title: row.querySelector('.song-title')?.textContent || '',
                artist: row.querySelector('.song-artist')?.textContent || '',
                image: row.querySelector('.song-image img')?.src || ''
            };
        }).filter(song => song !== null);
    }

    // Player controls
    const playIcon = document.querySelector('.play-icon');
    const playbar = document.querySelector('.playbar');
    const currentTimeDisplay = document.querySelector('.current-time');
    const totalTimeDisplay = document.querySelector('.total-time');
    const volumeSlider = document.querySelector('.volume-slider');
    const shuffleBtn = document.querySelector('.fa-shuffle');
    const repeatBtn = document.querySelector('.fa-repeat');
    const forwardBtn = document.querySelector('.fa-forward');
    const backwardBtn = document.querySelector('.fa-backward');

    // Add click event listener to play/pause icon
    if (playIcon) {
        playIcon.addEventListener('click', togglePlay);
    }

    // Play/Pause functionality
    function togglePlay() {
        if (!currentAudio && songs.length > 0) {
            currentAudio = songs[0].audio;
            updatePlayerInfo(songs[0]);
        }

        if (currentAudio) {
            if (isPlaying) {
                currentAudio.pause();
                if (playIcon) {
                    playIcon.classList.remove('fa-circle-pause');
                    playIcon.classList.add('fa-circle-play');
                }
                updatePlayButtons();
            } else {
                const playPromise = currentAudio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.error('Error playing audio:', error);
                    });
                }
                if (playIcon) {
                    playIcon.classList.remove('fa-circle-play');
                    playIcon.classList.add('fa-circle-pause');
                }
                updatePlayButtons();
            }
            isPlaying = !isPlaying;
        }
    }

    // Update player information
    function updatePlayerInfo(song) {
        const albumArt = document.querySelector('.album-art');
        const songTitle = document.querySelector('.song-title');
        const artistName = document.querySelector('.artist-name');

        if (albumArt && song.image) albumArt.src = song.image;
        if (songTitle && song.title) songTitle.textContent = song.title;
        if (artistName && song.artist) artistName.textContent = song.artist;
    }

    // Update play buttons
    function updatePlayButtons() {
        if (songCards.length > 0) {
            songCards.forEach((card, i) => {
                const cardPlayButton = card.querySelector('.play-button i');
                if (cardPlayButton) {
                    if (i === currentSongIndex) {
                        if (isPlaying) {
                            cardPlayButton.classList.remove('fa-play');
                            cardPlayButton.classList.add('fa-pause');
                        } else {
                            cardPlayButton.classList.remove('fa-pause');
                            cardPlayButton.classList.add('fa-play');
                        }
                    } else {
                        cardPlayButton.classList.remove('fa-pause');
                        cardPlayButton.classList.add('fa-play');
                    }
                }
            });
        } else if (songRows.length > 0) {
            songRows.forEach((row, i) => {
                const rowPlayButton = row.querySelector('.play-button i');
                if (rowPlayButton) {
                    if (i === currentSongIndex) {
                        if (isPlaying) {
                            rowPlayButton.classList.remove('fa-play');
                            rowPlayButton.classList.add('fa-pause');
                        } else {
                            rowPlayButton.classList.remove('fa-pause');
                            rowPlayButton.classList.add('fa-play');
                        }
                    } else {
                        rowPlayButton.classList.remove('fa-pause');
                        rowPlayButton.classList.add('fa-play');
                    }
                }
            });
        }
    }

    // Volume control
    let currentVolume = 1; // Store current volume level
    if (volumeSlider) {
        // Set initial volume
        volumeSlider.value = 100;
        
        volumeSlider.addEventListener('input', (e) => {
            currentVolume = e.target.value / 100;
            if (currentAudio) {
                currentAudio.volume = currentVolume;
            }
            // Update volume icon based on level
            const volumeIcon = document.querySelector('.controals i');
            if (volumeIcon) {
                if (currentVolume === 0) {
                    volumeIcon.classList.remove('fa-volume-up', 'fa-volume-down');
                    volumeIcon.classList.add('fa-volume-mute');
                } else if (currentVolume < 0.5) {
                    volumeIcon.classList.remove('fa-volume-up', 'fa-volume-mute');
                    volumeIcon.classList.add('fa-volume-down');
                } else {
                    volumeIcon.classList.remove('fa-volume-down', 'fa-volume-mute');
                    volumeIcon.classList.add('fa-volume-up');
                }
            }
        });

        // Add click event to volume icon to toggle mute
        const volumeIcon = document.querySelector('.controals i');
        if (volumeIcon) {
            volumeIcon.addEventListener('click', () => {
                if (currentVolume > 0) {
                    // Store previous volume and mute
                    const previousVolume = currentVolume;
                    currentVolume = 0;
                    volumeSlider.value = 0;
                    if (currentAudio) {
                        currentAudio.volume = 0;
                    }
                    volumeIcon.classList.remove('fa-volume-up', 'fa-volume-down');
                    volumeIcon.classList.add('fa-volume-mute');
                    volumeIcon.dataset.previousVolume = previousVolume;
                } else {
                    // Restore previous volume
                    currentVolume = parseFloat(volumeIcon.dataset.previousVolume || 1);
                    volumeSlider.value = currentVolume * 100;
                    if (currentAudio) {
                        currentAudio.volume = currentVolume;
                    }
                    volumeIcon.classList.remove('fa-volume-mute');
                    if (currentVolume < 0.5) {
                        volumeIcon.classList.add('fa-volume-down');
                    } else {
                        volumeIcon.classList.add('fa-volume-up');
                    }
                }
            });
        }
    }

    // Update volume when playing new songs
    function playSong(songIndex) {
        if (songIndex < 0 || songIndex >= songs.length) {
            console.error('Invalid song index');
            return;
        }

        const song = songs[songIndex];
        const audioElement = song.audio;

        if (!audioElement) {
            console.error('Audio element not found');
            return;
        }

        // Pause current audio if playing
        if (currentAudio && currentAudio !== audioElement) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        // Update current audio
        currentAudio = audioElement;
        currentSongIndex = songIndex;

        // Set volume for new audio
        if (currentAudio) {
            currentAudio.volume = currentVolume;
        }

        // Play the new audio
        const playPromise = audioElement.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                isPlaying = true;
                if (playIcon) {
                    playIcon.classList.remove('fa-circle-play');
                    playIcon.classList.add('fa-circle-pause');
                }
                updatePlayButtons();
            }).catch(error => {
                console.error('Error playing audio:', error);
            });
        }

        // Update player information
        updatePlayerInfo(song);

        // Update play button state
        updatePlayButtons();
    }

    // Update the card click handlers
    document.querySelectorAll('.card').forEach((card, index) => {
        card.setAttribute('data-song-index', index);
        
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.play-button')) {
                if (this.closest('.card-container') || this.closest('.cards1-container')) {
                    // Top 50 songs card or Trending New card - redirect to songs.html
                    window.location.href = 'songs.html';
                } else {
                    // Other cards - play the song
                    playSong(index);
                }
            }
        });

        const playButton = card.querySelector('.play-button');
        if (playButton) {
            playButton.addEventListener('click', function(e) {
                e.stopPropagation();
                if (currentSongIndex === index) {
                    // Toggle play/pause for current song
                    if (currentAudio && !currentAudio.paused) {
                        currentAudio.pause();
                        isPlaying = false;
                        if (playIcon) {
                            playIcon.classList.remove('fa-circle-pause');
                            playIcon.classList.add('fa-circle-play');
                        }
                    } else {
                        currentAudio.play();
                        isPlaying = true;
                        if (playIcon) {
                            playIcon.classList.remove('fa-circle-play');
                            playIcon.classList.add('fa-circle-pause');
                        }
                    }
                    updatePlayButtons();
                } else {
                    // Play new song
                    playSong(index);
                }
            });
        }
    });

    // Update time display
    function updateTimeDisplay() {
        if (currentAudio) {
            const currentTime = Math.floor(currentAudio.currentTime);
            const totalTime = Math.floor(currentAudio.duration);
            
            if (currentTimeDisplay) currentTimeDisplay.textContent = formatTime(currentTime);
            if (totalTimeDisplay) totalTimeDisplay.textContent = formatTime(totalTime);
            
            const progress = (currentTime / totalTime) * 100;
            if (playbar) playbar.value = progress;
        }
    }

    // Format time
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // Playbar functionality
    if (playbar) {
        playbar.addEventListener('input', (e) => {
            if (currentAudio) {
                const time = (e.target.value / 100) * currentAudio.duration;
                currentAudio.currentTime = time;
            }
        });
    }

    // Next/Previous functionality
    function playNext() {
        const nextIndex = (currentSongIndex + 1) % songs.length;
        playSong(nextIndex);
    }

    function playPrevious() {
        const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        playSong(prevIndex);
    }

    if (forwardBtn) {
        forwardBtn.addEventListener('click', playNext);
    }

    if (backwardBtn) {
        backwardBtn.addEventListener('click', playPrevious);
    }

    // Shuffle functionality
    let isShuffled = false;
    if (shuffleBtn) {
        shuffleBtn.addEventListener('click', () => {
            isShuffled = !isShuffled;
            shuffleBtn.style.color = isShuffled ? '#1db954' : '#b3b3b3';
        });
    }

    // Repeat functionality
    let repeatMode = 'none';
    if (repeatBtn) {
        repeatBtn.addEventListener('click', () => {
            switch (repeatMode) {
                case 'none':
                    repeatMode = 'all';
                    repeatBtn.style.color = '#1db954';
                    break;
                case 'all':
                    repeatMode = 'one';
                    repeatBtn.style.color = '#1db954';
                    repeatBtn.classList.add('fa-repeat-1');
                    break;
                case 'one':
                    repeatMode = 'none';
                    repeatBtn.style.color = '#b3b3b3';
                    repeatBtn.classList.remove('fa-repeat-1');
                    break;
            }
        });
    }

    // Audio event listeners
    function setupAudioEventListeners(audio) {
        if (audio) {
            audio.addEventListener('timeupdate', updateTimeDisplay);
            audio.addEventListener('ended', () => {
                if (repeatMode === 'one') {
                    audio.currentTime = 0;
                    const playPromise = audio.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            console.error('Error playing audio:', error);
                        });
                    }
                } else if (repeatMode === 'all' || isShuffled) {
                    playNext();
                } else {
                    isPlaying = false;
                    if (playIcon) {
                        playIcon.classList.remove('fa-circle-pause');
                        playIcon.classList.add('fa-circle-play');
                    }
                    updatePlayButtons();
                }
            });
        }
    }

    // Setup event listeners for all audio elements
    songs.forEach(song => {
        if (song.audio) {
            setupAudioEventListeners(song.audio);
        }
    });

    // Only initialize first song if we have valid songs
    if (songs.length > 0 && songs[0] && songs[0].audio) {
        currentAudio = songs[0].audio;
        updatePlayerInfo(songs[0]);
    }

    // Add click event listeners to song rows
    songRows.forEach((row, index) => {
        row.addEventListener('click', () => {
            playSong(index);
        });
    });

    // Add click event listeners to play buttons in song rows
    songRows.forEach((row, index) => {
        const playButton = row.querySelector('.play-button');
        if (playButton) {
            playButton.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent row click event
                if (currentSongIndex === index) {
                    // Toggle play/pause for current song
                    if (currentAudio && !currentAudio.paused) {
                        currentAudio.pause();
                        playButton.querySelector('i').classList.remove('fa-pause');
                        playButton.querySelector('i').classList.add('fa-play');
                        if (playIcon) {
                            playIcon.classList.remove('fa-circle-pause');
                            playIcon.classList.add('fa-circle-play');
                        }
                    } else {
                        currentAudio.play();
                        playButton.querySelector('i').classList.remove('fa-play');
                        playButton.querySelector('i').classList.add('fa-pause');
                        if (playIcon) {
                            playIcon.classList.remove('fa-circle-play');
                            playIcon.classList.add('fa-circle-pause');
                        }
                    }
                } else {
                    // Play new song
                    playSong(index);
                }
            });
        }
    });

    // Add click event listener to playlist play button
    const playlistPlayButton = document.querySelector('.playlist-actions .play-button');
    if (playlistPlayButton) {
        playlistPlayButton.addEventListener('click', () => {
            if (songs.length > 0) {
                playSong(0);
            }
        });
    }

    // Add click event listener to footer to stop playback
    const footer = document.querySelector('.footer');
    if (footer) {
        footer.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
                isPlaying = false;
                if (playIcon) {
                    playIcon.classList.remove('fa-circle-pause');
                    playIcon.classList.add('fa-circle-play');
                }
                updatePlayButtons();
                // Reset the playbar
                if (playbar) {
                    playbar.value = 0;
                }
                // Reset time display
                if (currentTimeDisplay) {
                    currentTimeDisplay.textContent = '0:00';
                }
            }
        });
    }
});