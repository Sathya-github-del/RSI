document.addEventListener("DOMContentLoaded", () => {
    const gallery = document.getElementById("imageGallery")
    const modal = document.getElementById("imageModal")
    const modalImage = document.getElementById("modalImage")
    const closeBtn = document.querySelector(".close-btn")
    const prevBtn = document.getElementById("prevBtn")
    const nextBtn = document.getElementById("nextBtn")
    const hamburger = document.querySelector(".hamburger")
    const navLinks = document.querySelector(".nav-links")
    const darkModeToggle = document.getElementById("darkModeToggle")
  
    let currentImageIndex = 0
    const totalImages = 263 // Total number of images in the gallery
  
    // Toggle mobile menu
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active")
      navLinks.classList.toggle("active")
    })
  
    // Dark mode toggle
    darkModeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode")
      darkModeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙"
      localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"))
    })
  
    // Check for saved dark mode preference
    if (localStorage.getItem("darkMode") === "true") {
      document.body.classList.add("dark-mode")
      darkModeToggle.textContent = "☀️"
    }
  
    // Load gallery images
    function loadGalleryImages(start, end) {
      for (let i = start; i <= end; i++) {
        const img = document.createElement("img")
        img.src = `assets/Images/Image (${i}).jpg`
        img.alt = `Gallery Image ${i}`
        img.loading = "lazy"
        img.addEventListener("click", () => openModal(i))
        gallery.appendChild(img)
      }
    }
  
    // Initial load of first 20 images
    loadGalleryImages(1, 20)
  
    // Infinite scroll for gallery
    window.addEventListener("scroll", () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        const loadedImages = gallery.children.length
        if (loadedImages < totalImages) {
          loadGalleryImages(loadedImages + 1, Math.min(loadedImages + 20, totalImages))
        }
      }
    })
  
    // Open modal
    function openModal(imageIndex) {
      currentImageIndex = imageIndex
      modalImage.src = `assets/Images/Image (${currentImageIndex}).jpg`
      modal.style.display = "flex"
      document.body.style.overflow = "hidden" // Prevent scrolling when modal is open
    }
  
    // Close modal
    function closeModal() {
      modal.style.display = "none"
      document.body.style.overflow = "" // Re-enable scrolling
    }
  
    closeBtn.addEventListener("click", closeModal)
  
    // Navigate images in modal
    function navigateImage(direction) {
      if (direction === "next") {
        currentImageIndex = currentImageIndex === totalImages ? 1 : currentImageIndex + 1
      } else if (direction === "prev") {
        currentImageIndex = currentImageIndex === 1 ? totalImages : currentImageIndex - 1
      }
      modalImage.src = `assets/Images/Image (${currentImageIndex}).jpg`
    }
  
    prevBtn.addEventListener("click", () => navigateImage("prev"))
    nextBtn.addEventListener("click", () => navigateImage("next"))
  
    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (modal.style.display === "flex") {
        if (e.key === "ArrowLeft") navigateImage("prev")
        if (e.key === "ArrowRight") navigateImage("next")
        if (e.key === "Escape") closeModal()
      }
    })
  
    // Close modal when clicking outside the image
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal()
      }
    })
  
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault()
        document.querySelector(this.getAttribute("href")).scrollIntoView({
          behavior: "smooth",
        })
      })
    })
  
    // Error handling for images
    function handleImageError(img) {
      img.onerror = null // Prevent infinite loop
      img.src = "assets/placeholder.jpg" // Replace with a placeholder image
      img.alt = "Image not found"
    }
  
    // Apply error handling to all gallery images
    gallery.addEventListener(
      "error",
      (e) => {
        if (e.target.tagName === "IMG") {
          handleImageError(e.target)
        }
      },
      true,
    )
  
    // Lazy loading with Intersection Observer
    const lazyLoadImages = () => {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const image = entry.target
            image.src = image.dataset.src
            image.classList.remove("lazy")
            observer.unobserve(image)
          }
        })
      })
  
      const imgs = document.querySelectorAll("img.lazy")
      imgs.forEach((img) => imageObserver.observe(img))
    }
  
    // Initialize lazy loading
    lazyLoadImages()
  
    // Debounce function for performance optimization
    function debounce(func, wait) {
      let timeout
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout)
          func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
      }
    }
  
    // Debounced scroll event listener for infinite scroll
    const debouncedScroll = debounce(() => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        const loadedImages = gallery.children.length
        if (loadedImages < totalImages) {
          loadGalleryImages(loadedImages + 1, Math.min(loadedImages + 20, totalImages))
        }
      }
    }, 200)
  
    window.addEventListener("scroll", debouncedScroll)
  })
  
  