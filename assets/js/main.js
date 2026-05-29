/* ==========================================================================
   Delhi Chaap Express - Main JavaScript
   Features: 3D Tilts, Smooth Scroll Anim, Custom Cursor, Gallery & Lightbox, Form Validation
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Custom Cursor Trailing Effect
    const cursor = document.querySelector(".custom-cursor");
    const follower = document.querySelector(".custom-cursor-follower");
    
    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;

    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Instant cursor movement
        if(cursor) {
            cursor.style.left = mouseX + "px";
            cursor.style.top = mouseY + "px";
        }
    });

    // Follower smooth trailing
    function updateFollower() {
        // Linear interpolation for smooth lag
        followerX += (mouseX - followerX) * 0.12;
        followerY += (mouseY - followerY) * 0.12;

        if (follower) {
            follower.style.left = followerX + "px";
            follower.style.top = followerY + "px";
        }
        requestAnimationFrame(updateFollower);
    }
    updateFollower();

    // Hover state handles for cursor
    const interactiveElements = document.querySelectorAll("a, button, input, select, textarea, .gallery-item, .filter-btn");
    interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", () => {
            document.body.classList.add("hovering-link");
        });
        el.addEventListener("mouseleave", () => {
            document.body.classList.remove("hovering-link");
        });
    });


    // 2. Parallax Glowing Background Orbs
    document.addEventListener("mousemove", (e) => {
        const glowGreen = document.querySelector(".glow-green");
        const glowYellow = document.querySelector(".glow-yellow");
        
        const moveX = (e.clientX - window.innerWidth / 2) * 0.03;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.03;
        
        if (glowGreen) glowGreen.style.transform = `translate(${moveX}px, ${moveY}px)`;
        if (glowYellow) glowYellow.style.transform = `translate(${-moveX}px, ${-moveY}px)`;
    });


    // 3. Mobile Navigation Drawer
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const mobileNav = document.getElementById("mobile-nav");

    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener("click", () => {
            mobileNav.classList.toggle("active");
            const icon = mobileMenuBtn.querySelector("i");
            if (mobileNav.classList.contains("active")) {
                icon.className = "fa-solid fa-xmark";
            } else {
                icon.className = "fa-solid fa-bars-staggered";
            }
        });

        // Close menu when link is clicked
        const mobileLinks = mobileNav.querySelectorAll("a");
        mobileLinks.forEach((link) => {
            link.addEventListener("click", () => {
                mobileNav.classList.remove("active");
                mobileMenuBtn.querySelector("i").className = "fa-solid fa-bars-staggered";
            });
        });
    }


    // 4. Navbar scroll state styling
    const navbar = document.querySelector(".navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });


    // 5. 3D Card Tilt Animation
    const tiltElements = document.querySelectorAll(".plan-card-3d, #hero-3d-card, .founder-frame");
    
    tiltElements.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            
            // Mouse position relative to element
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Normalized values (-0.5 to 0.5)
            const xc = x / rect.width - 0.5;
            const yc = y / rect.height - 0.5;
            
            // Maximum tilt angle (degrees)
            const maxTilt = 15;
            
            // Calculate tilts: moving mouse right rotates on Y axis, moving up/down rotates X
            const tiltY = xc * maxTilt;
            const tiltX = -yc * maxTilt;
            
            // Apply 3D perspective rotation
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener("mouseleave", () => {
            // Smoothly snap back to origin
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.transition = "transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)";
        });
        
        card.addEventListener("mouseenter", () => {
            // Remove transitions during tracking for snappier responses
            card.style.transition = "none";
        });
    });


    // 6. Pre-select Franchise dropdown model
    const planButtons = document.querySelectorAll(".plan-btn");
    const dropdownSelect = document.getElementById("form-plan");

    planButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const selectedPlan = btn.getAttribute("data-plan");
            if (dropdownSelect && selectedPlan) {
                // Find matching option
                for (let i = 0; i < dropdownSelect.options.length; i++) {
                    if (dropdownSelect.options[i].value.includes(selectedPlan) || selectedPlan.includes(dropdownSelect.options[i].value)) {
                        dropdownSelect.selectedIndex = i;
                        break;
                    }
                }
            }
        });
    });


    // 7. Interactive Gallery Filter
    const filterButtons = document.querySelectorAll(".filter-btn");
    const galleryItems = document.querySelectorAll(".gallery-item");

    filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            // Remove active class
            filterButtons.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");

            const filterValue = btn.getAttribute("data-filter");

            galleryItems.forEach((item) => {
                const category = item.getAttribute("data-category");
                
                if (filterValue === "all" || category === filterValue) {
                    item.style.display = "block";
                    // Brief delay to trigger transition scale
                    setTimeout(() => {
                        item.style.opacity = "1";
                        item.style.transform = "scale(1)";
                    }, 50);
                } else {
                    item.style.opacity = "0";
                    item.style.transform = "scale(0.8)";
                    setTimeout(() => {
                        item.style.display = "none";
                    }, 400); // matching CSS transitions duration
                }
            });
        });
    });


    // 8. Lightbox Overlay for Gallery
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxClose = document.getElementById("lightbox-close");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const lightboxPrev = document.getElementById("lightbox-prev");
    const lightboxNext = document.getElementById("lightbox-next");

    let activeGalleryIndex = 0;
    // Keep array of currently visible gallery items
    let visibleItemsArray = [];

    function updateLightboxImage() {
        if(visibleItemsArray.length === 0) return;
        const currentItem = visibleItemsArray[activeGalleryIndex];
        const img = currentItem.querySelector("img");
        const heading = currentItem.querySelector("h4").innerText;
        const desc = currentItem.querySelector("p").innerText;
        
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.innerHTML = `<strong>${heading}</strong> - ${desc}`;
    }

    galleryItems.forEach((item) => {
        item.addEventListener("click", () => {
            // Populate visible items
            visibleItemsArray = Array.from(galleryItems).filter(i => i.style.display !== "none");
            activeGalleryIndex = visibleItemsArray.indexOf(item);
            
            updateLightboxImage();
            lightbox.classList.add("active");
            document.body.style.overflow = "hidden"; // disable scroll
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener("click", () => {
            lightbox.classList.remove("active");
            document.body.style.overflow = "auto";
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener("click", () => {
            activeGalleryIndex = (activeGalleryIndex + 1) % visibleItemsArray.length;
            updateLightboxImage();
        });
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener("click", () => {
            activeGalleryIndex = (activeGalleryIndex - 1 + visibleItemsArray.length) % visibleItemsArray.length;
            updateLightboxImage();
        });
    }

    // Keyboard controls for lightbox
    document.addEventListener("keydown", (e) => {
        if (lightbox && lightbox.classList.contains("active")) {
            if (e.key === "Escape") {
                lightbox.classList.remove("active");
                document.body.style.overflow = "auto";
            } else if (e.key === "ArrowRight") {
                activeGalleryIndex = (activeGalleryIndex + 1) % visibleItemsArray.length;
                updateLightboxImage();
            } else if (e.key === "ArrowLeft") {
                activeGalleryIndex = (activeGalleryIndex - 1 + visibleItemsArray.length) % visibleItemsArray.length;
                updateLightboxImage();
            }
        }
    });

    // Close lightbox on clicking dark background
    if (lightbox) {
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove("active");
                document.body.style.overflow = "auto";
            }
        });
    }


    // 9. GSAP Entry and Scroll Animations
    if (typeof gsap !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);

        // Load Animations (Hero Section)
        const loadTimeline = gsap.timeline();
        loadTimeline.from(".navbar", {
            y: -50,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        })
        .from(".hero-content .badge", {
            x: -30,
            opacity: 0,
            duration: 0.5,
            ease: "power2.out"
        }, "-=0.3")
        .from(".hero-title", {
            y: 30,
            opacity: 0,
            duration: 0.7,
            ease: "power3.out"
        }, "-=0.3")
        .from(".hero-description", {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out"
        }, "-=0.4")
        .from(".hero-ctas", {
            y: 20,
            opacity: 0,
            duration: 0.5,
            ease: "power2.out"
        }, "-=0.4")
        .from(".hero-stats", {
            opacity: 0,
            duration: 0.6,
            ease: "power2.out"
        }, "-=0.3")
        .from(".visual-3d-wrapper", {
            scale: 0.8,
            opacity: 0,
            duration: 1,
            ease: "back.out(1.5)"
        }, "-=1.0");

        // Scroll Revelations: About Section Icons & Headers
        gsap.from(".about-section .section-header", {
            scrollTrigger: {
                trigger: ".about-section",
                start: "top 80%",
                toggleActions: "play none none none"
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        });

        gsap.from(".feature-card", {
            scrollTrigger: {
                trigger: ".features-grid",
                start: "top 80%",
                toggleActions: "play none none none"
            },
            y: 50,
            opacity: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: "power3.out"
        });

        // Franchise Plans Scroll Reveal
        gsap.from(".franchise-section .section-header", {
            scrollTrigger: {
                trigger: ".franchise-section",
                start: "top 80%",
                toggleActions: "play none none none"
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        });

        gsap.from(".plan-card-3d", {
            scrollTrigger: {
                trigger: ".plans-container",
                start: "top 75%",
                toggleActions: "play none none none"
            },
            y: 60,
            opacity: 0,
            stagger: 0.25,
            duration: 1,
            ease: "power4.out"
        });

        // Gallery Items Scroll Reveal
        gsap.from(".gallery-section .section-header", {
            scrollTrigger: {
                trigger: ".gallery-section",
                start: "top 80%",
                toggleActions: "play none none none"
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        });

        gsap.from(".gallery-item", {
            scrollTrigger: {
                trigger: ".gallery-grid",
                start: "top 85%",
                toggleActions: "play none none none"
            },
            scale: 0.9,
            opacity: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: "power2.out"
        });

        // Founder Profile Scroll Reveal
        gsap.from(".founder-frame", {
            scrollTrigger: {
                trigger: ".founder-section",
                start: "top 70%",
                toggleActions: "play none none none"
            },
            x: -50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });

        gsap.from(".founder-content-area", {
            scrollTrigger: {
                trigger: ".founder-section",
                start: "top 70%",
                toggleActions: "play none none none"
            },
            x: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });

        // Inquiry Contact Grid Scroll Reveal
        gsap.from(".contact-info-area", {
            scrollTrigger: {
                trigger: ".contact-section",
                start: "top 75%",
                toggleActions: "play none none none"
            },
            x: -40,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        });

        gsap.from(".contact-form-area", {
            scrollTrigger: {
                trigger: ".contact-section",
                start: "top 75%",
                toggleActions: "play none none none"
            },
            x: 40,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        });
    }


    // 10. Form Submission Mock Handling
    const inquiryForm = document.getElementById("inquiry-form");
    const formSuccess = document.getElementById("form-success");
    const submitBtn = document.getElementById("submit-btn");
    const resetFormBtn = document.getElementById("reset-form-btn");

    if (inquiryForm && formSuccess && submitBtn) {
        inquiryForm.addEventListener("submit", (e) => {
            e.preventDefault(); // stop browser reload
            
            // Add loading state
            submitBtn.classList.add("loading");
            const btnSpan = submitBtn.querySelector("span");
            const btnIcon = submitBtn.querySelector("i");
            
            const originalText = btnSpan.innerText;
            btnSpan.innerText = "Submitting...";
            btnIcon.className = "fa-solid fa-circle-notch fa-spin";

            // Mock network call (1.5 seconds)
            setTimeout(() => {
                // Reset submit button state
                submitBtn.classList.remove("loading");
                btnSpan.innerText = originalText;
                btnIcon.className = "fa-solid fa-paper-plane";

                // Fade out form and fade in success card
                inquiryForm.style.display = "none";
                formSuccess.style.display = "flex";
                
                setTimeout(() => {
                    formSuccess.classList.add("active");
                }, 50);

                // Log form values to console for validation representation
                console.log("Inquiry Submitted successfully:");
                console.log("Name:", document.getElementById("form-name").value);
                console.log("Phone:", document.getElementById("form-phone").value);
                console.log("Email:", document.getElementById("form-email").value);
                console.log("City:", document.getElementById("form-city").value);
                console.log("Model:", document.getElementById("form-plan").value);
                console.log("Message:", document.getElementById("form-message").value);
                
                // Reset form values
                inquiryForm.reset();
            }, 1500);
        });
    }

    if (resetFormBtn && inquiryForm && formSuccess) {
        resetFormBtn.addEventListener("click", () => {
            formSuccess.classList.remove("active");
            setTimeout(() => {
                formSuccess.style.display = "none";
                inquiryForm.style.display = "block";
            }, 400);
        });
    }
});
