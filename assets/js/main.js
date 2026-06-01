/* ==========================================================================
   Delhi Chaap Express - Main JavaScript
   Features: 3D Tilts, Smooth Scroll Anim, Custom Cursor, Gallery & Lightbox, Form Validation
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {



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
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
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

        // 9. Native Intersection Observer for Bulletproof Scroll Reveals (GSAP fallback)
        const observerOptions = {
            root: null,
            rootMargin: "0px 0px -60px 0px", // Trigger when elements are 60px inside viewport
            threshold: 0.02
        };

        const revealObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const section = entry.target;
                    
                    if (section.id === "about") {
                        gsap.to(".about-section .section-header", { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });
                        gsap.to(".feature-card", { opacity: 1, y: 0, stagger: 0.12, duration: 0.8, ease: "power3.out" });
                    } 
                    else if (section.id === "franchise") {
                        gsap.to(".franchise-section .section-header", { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });
                        gsap.to(".plan-card-3d", { opacity: 1, y: 0, stagger: 0.2, duration: 1, ease: "power4.out" });
                    } 
                    else if (section.id === "gallery") {
                        gsap.to(".gallery-section .section-header", { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });
                        gsap.to(".gallery-item", { opacity: 1, scale: 1, stagger: 0.08, duration: 0.8, ease: "power2.out" });
                    } 
                    else if (section.id === "founder") {
                        gsap.to(".founder-frame", { opacity: 1, x: 0, duration: 1, ease: "power3.out" });
                        gsap.to(".founder-content-area", { opacity: 1, x: 0, duration: 1, ease: "power3.out" });
                    } 
                    else if (section.id === "contact") {
                        gsap.to(".contact-info-area", { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" });
                        gsap.to(".contact-form-area", { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" });
                    }

                    obs.unobserve(section);
                }
            });
        }, observerOptions);

        // Pre-configure initial starting states using GSAP
        gsap.set(".about-section .section-header", { opacity: 0, y: 30 });
        gsap.set(".feature-card", { opacity: 0, y: 50 });
        
        gsap.set(".franchise-section .section-header", { opacity: 0, y: 30 });
        gsap.set(".plan-card-3d", { opacity: 0, y: 60 });
        
        gsap.set(".gallery-section .section-header", { opacity: 0, y: 30 });
        gsap.set(".gallery-item", { opacity: 0, scale: 0.9 });
        
        gsap.set(".founder-frame", { opacity: 0, x: -50 });
        gsap.set(".founder-content-area", { opacity: 0, x: 50 });
        
        gsap.set(".contact-info-area", { opacity: 0, x: -40 });
        gsap.set(".contact-form-area", { opacity: 0, x: 40 });

        // Bind sections to observer
        const observedSections = ["about", "franchise", "gallery", "founder", "contact"];
        observedSections.forEach(id => {
            const sec = document.getElementById(id);
            if (sec) revealObserver.observe(sec);
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
                console.log("Inquiry dispatched to delhichaapexpress@gmail.com successfully:");
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

    // 11. Ambient Grill Coal and Ash Particles Background
    const canvas = document.getElementById("grill-canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        // Adjust dimensions on resize
        window.addEventListener("resize", () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initCoals();
        });

        // Particle configuration arrays
        const embers = [];
        const ashes = [];
        const coals = [];
        
        const maxEmbers = 70;
        const maxAshes = 45;

        // Coal block definitions at the bottom
        class Coal {
            constructor(x, y, radius) {
                this.x = x;
                this.y = y;
                this.radius = radius;
                this.baseRadius = radius;
                this.pulseSpeed = 0.01 + Math.random() * 0.015;
                this.pulseOffset = Math.random() * Math.PI * 2;
                
                // Build a slightly randomized polygon shape for organic feel
                this.numSides = 5 + Math.floor(Math.random() * 4); // 5-8 sides
                this.points = [];
                for (let i = 0; i < this.numSides; i++) {
                    const angle = (i / this.numSides) * Math.PI * 2;
                    // Add slight variance to distance from center
                    const dist = radius * (0.8 + Math.random() * 0.4);
                    this.points.push({
                        x: Math.cos(angle) * dist,
                        y: Math.sin(angle) * dist
                    });
                }
            }

            draw(time) {
                // Calculate dynamic pulse glow multiplier
                const pulse = Math.sin(time * this.pulseSpeed + this.pulseOffset);
                const glowIntensity = 0.45 + pulse * 0.35; // pulses between 0.1 and 0.8
                
                ctx.save();
                ctx.translate(this.x, this.y);
                
                // Create glowing coal inner gradient
                const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius * 1.3);
                grad.addColorStop(0, `rgba(255, ${Math.floor(100 + glowIntensity * 120)}, 0, ${glowIntensity})`); // burning orange core
                grad.addColorStop(0.3, `rgba(220, 50, 0, ${glowIntensity * 0.8})`); // red-hot layer
                grad.addColorStop(0.7, "rgba(50, 10, 5, 0.45)"); // cooling crust
                grad.addColorStop(1, "rgba(12, 12, 12, 0)"); // fading into dark
                
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.moveTo(this.points[0].x, this.points[0].y);
                for (let i = 1; i < this.numSides; i++) {
                    ctx.lineTo(this.points[i].x, this.points[i].y);
                }
                ctx.closePath();
                ctx.fill();
                
                // Add minor ash overlay details (dark patches on burning coal)
                ctx.fillStyle = `rgba(30, 30, 30, ${0.4 - glowIntensity * 0.25})`;
                ctx.beginPath();
                ctx.arc(-this.radius * 0.2, -this.radius * 0.1, this.radius * 0.35, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.restore();
            }
        }

        // Initialize coal base layout (overlapping blocks at screen bottom)
        function initCoals() {
            coals.length = 0;
            const coalCount = Math.ceil(width / 75) + 2; // scale with width
            for (let i = 0; i < coalCount; i++) {
                const x = (i - 0.5) * 80 + (Math.random() * 30 - 15);
                const y = height + 10 + (Math.random() * 20 - 10);
                const radius = 60 + Math.random() * 50;
                coals.push(new Coal(x, y, radius));
            }
        }

        // Ember Particle Definition
        class Ember {
            constructor() {
                this.reset(true);
            }

            reset(initAtBottom = false) {
                this.x = Math.random() * width;
                this.y = initAtBottom ? (height - Math.random() * 50) : (height + 20);
                this.size = 1 + Math.random() * 3.5;
                this.speedY = -(0.5 + Math.random() * 1.5);
                this.speedX = Math.random() * 1 - 0.5;
                
                // Oscillation settings for sway
                this.swaySpeed = 0.01 + Math.random() * 0.02;
                this.swayOffset = Math.random() * Math.PI * 2;
                this.swayRadius = 0.5 + Math.random() * 1.5;
                
                this.life = 0;
                this.maxLife = 200 + Math.random() * 300;
                this.opacity = 1;
                
                // Color spectrum: white-hot yellow, soft orange, red, black
                this.colorVal = Math.random();
            }

            update(time) {
                this.life++;
                this.y += this.speedY;
                
                // Add sine wave sway behavior
                this.x += this.speedX + Math.sin(time * this.swaySpeed + this.swayOffset) * this.swayRadius * 0.1;
                
                // Calculate opacity fade out
                this.opacity = 1 - (this.life / this.maxLife);
                
                // Reset if dead or off-screen
                if (this.life >= this.maxLife || this.y < -20 || this.x < -20 || this.x > width + 20) {
                    this.reset();
                }
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                
                // Spark color transitions
                let color;
                const ratio = this.life / this.maxLife;
                if (ratio < 0.25) {
                    color = `rgba(255, 240, 180, ${this.opacity})`; // yellow white sparks
                } else if (ratio < 0.6) {
                    color = `rgba(255, 140, 30, ${this.opacity})`; // hot orange
                } else {
                    color = `rgba(230, 45, 15, ${this.opacity})`; // dying red ember
                }
                
                ctx.shadowBlur = this.size * 2;
                ctx.shadowColor = "rgba(255, 120, 0, 0.6)";
                
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        // Ash Particle Definition
        class Ash {
            constructor() {
                this.reset(true);
            }

            reset(initAtBottom = false) {
                this.x = Math.random() * width;
                this.y = initAtBottom ? (Math.random() * height) : (height + 20);
                this.size = 1 + Math.random() * 2.5;
                this.speedY = -(0.3 + Math.random() * 0.8); // ash rises slower
                this.speedX = Math.random() * 0.6 - 0.3;
                
                this.swaySpeed = 0.005 + Math.random() * 0.01;
                this.swayOffset = Math.random() * Math.PI * 2;
                this.swayRadius = 0.8 + Math.random() * 2;
                
                this.life = 0;
                this.maxLife = 400 + Math.random() * 400; // longer life
                this.opacity = Math.random() * 0.4 + 0.15; // lower initial opacity
            }

            update(time) {
                this.life++;
                this.y += this.speedY;
                
                // Larger sway logic to look like floating flakes
                this.x += this.speedX + Math.sin(time * this.swaySpeed + this.swayOffset) * this.swayRadius * 0.15;
                
                // Fade logic
                const ratio = this.life / this.maxLife;
                let currentOpacity = this.opacity;
                if (ratio > 0.7) {
                    currentOpacity = this.opacity * (1 - (ratio - 0.7) / 0.3);
                }
                this.currentOpacity = Math.max(0, currentOpacity);
                
                if (this.life >= this.maxLife || this.y < -20 || this.x < -20 || this.x > width + 20) {
                    this.reset();
                }
            }

            draw() {
                if (this.currentOpacity <= 0) return;
                ctx.save();
                ctx.globalAlpha = this.currentOpacity;
                
                // Ash is light grey/white or dark grey flake
                ctx.fillStyle = `rgba(200, 202, 204, ${this.currentOpacity})`;
                
                // Draw irregular flake (diamond-like rather than perfect circle)
                ctx.beginPath();
                const half = this.size / 2;
                ctx.moveTo(this.x, this.y - half);
                ctx.lineTo(this.x + half, this.y);
                ctx.lineTo(this.x, this.y + half);
                ctx.lineTo(this.x - half, this.y);
                ctx.closePath();
                ctx.fill();
                
                ctx.restore();
            }
        }

        // Initialize collections
        initCoals();
        for (let i = 0; i < maxEmbers; i++) {
            embers.push(new Ember());
        }
        for (let i = 0; i < maxAshes; i++) {
            ashes.push(new Ash());
        }

        let time = 0;
        // Animation Loop
        function animate() {
            time++;
            // Clear
            ctx.clearRect(0, 0, width, height);

            // 1. Draw burning charcoal bases
            coals.forEach(coal => coal.draw(time));

            // 2. Update and draw embers (glowing fire Sparks)
            embers.forEach(ember => {
                ember.update(time);
                ember.draw();
            });

            // 3. Update and draw rising ash flakes
            ashes.forEach(ash => {
                ash.update(time);
                ash.draw();
            });

            requestAnimationFrame(animate);
        }
        animate();
    }

    // 12. Video Loop Fallback Trigger (Ensures seamless repeating across all browsers)
    const bgVideo = document.getElementById("bg-video");
    if (bgVideo) {
        bgVideo.addEventListener("ended", () => {
            bgVideo.currentTime = 0;
            bgVideo.play().catch(err => console.log("Video auto-loop play prevented:", err));
        });
    }
});
