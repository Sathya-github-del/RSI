document.addEventListener("DOMContentLoaded", () => {
  const loaderWrapper = document.querySelector(".loader-wrapper")

  // Only proceed if loader wrapper exists
  if (loaderWrapper) {
    // Prevent scrolling while loading
    document.body.style.overflow = "hidden"

    // Remove loader after 2 seconds
    setTimeout(() => {
      loaderWrapper.classList.add("fade-out")
      document.body.style.overflow = ""

      // Remove loader from DOM after fade animation
      setTimeout(() => {
        loaderWrapper.remove()
      }, 500)
    }, 500)
  }

  const hamburger = document.querySelector(".hamburger")
  const navLinks = document.querySelector(".nav-links")
  const darkModeToggle = document.getElementById("darkModeToggle")
  const getQuoteButton = document.querySelector(".get")

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active")
    navLinks.classList.toggle("active")
    if (getQuoteButton) getQuoteButton.classList.toggle("active")

    // Toggle aria-expanded for accessibility
    const isExpanded = hamburger.classList.contains("active")
    hamburger.setAttribute("aria-expanded", isExpanded)
  })

  document.body.classList.add("dark-mode") // Set default to dark mode
  darkModeToggle.textContent = "☀️" // Set initial toggle text for dark mode

  darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode")
    darkModeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙"
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

  // Intersection Observer for fade-in animations and hero image lazy loading
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains("hero")) {
            changeHeroImage()
          } else {
            entry.target.classList.add("fade-in")
          }
        }
      })
    },
    { threshold: 0.1 },
  )

  document.querySelectorAll(".service-card, .pricing-card, .hero").forEach((el) => {
    observer.observe(el)
  })

  const heroElement = document.querySelector(".hero")
  const images = ["heroimage1.jpg", "heroimage2.jpg", "heroimage3.jpg"] // Add all your image names here
  let currentIndex = 0 // Replaced 'currentImageIndex' with 'currentIndex'

  // Function to set background image and apply zoom effect
  function changeHeroImage() {
    // Increment and wrap around if needed
    currentIndex = (currentIndex + 1) % images.length

    const imageUrl = `assets/${images[currentIndex]}`
    console.log("Loading hero image:", imageUrl)
    // Apply the new background image
    heroElement.style.setProperty("--hero-image", `url('${imageUrl}')`)
  }

  // Initial call to set the first image
  changeHeroImage()

  // Run the image change every 5 seconds
  setInterval(changeHeroImage, 5000)

  // submit forms logic

  document.querySelectorAll(".submit-button, .whatsapp-button, .facebook-button").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault()
      const form = this.closest("form")
      if (!validateForm(form)) {
        alert("Please fill out all required fields before submitting.")
        return
      }
      const formData = new FormData(form)
      if (this.classList.contains("whatsapp-button")) {
        handleWhatsAppSubmit(formData)
      } else if (this.classList.contains("facebook-button")) {
        handleFacebookSubmit(formData)
      } else {
        handleDefaultSubmit(formData)
      }
    })
  })

  function validateForm(form) {
    const requiredFields = form.querySelectorAll("[required]")
    return Array.from(requiredFields).every((field) => field.value.trim() !== "")
  }

  function handleWhatsAppSubmit(formData) {
    const whatsappNumber = "+917019565765"
    const message = createMessage(formData)
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank")
  }

  function handleFacebookSubmit(formData) {
    const facebookUsername = "rooparam.devashi"
    const message = createMessage(formData)
    const url = `https://m.me/${facebookUsername}?message=${encodeURIComponent(message)}`
    window.open(url, "_blank")
  }

  function handleDefaultSubmit(formData) {
    console.log("Form submitted:", Object.fromEntries(formData))
  }

  function createMessage(formData) {
    return (
      `Hello, I'd like to inquire about your services. Here are my details:\n\n` +
      `Name: ${formData.get("firstName")} ${formData.get("lastName")}\n` +
      `Phone Number: ${formData.get("phoneNumber")}\n` +
      `Email: ${formData.get("email")}\n` +
      `City: ${formData.get("cityName")}\n` +
      `Office/Home: ${formData.get("office")}\n` +
      `Message: ${formData.get("message")}`
    )
  }

  const gallery = document.getElementById("imageGallery")
  const numberOfImages = 263
  let currentImageIndex = null

  function loadGalleryImages(start, end) {
    for (let i = start; i <= end; i++) {
      const img = document.createElement("img")
      img.onerror = function () {
        this.src = "assets/Images/default.jpg"
        this.classList.add("error-image")
      }

      img.classList.add("loading")
      img.onload = function () {
        this.classList.remove("loading")
        this.classList.add("loaded")
      }

      const imagePath = `assets/Images/Image (${i}).jpg`.replace(/\s+/g, "%20")
      img.src = imagePath
      img.alt = `Radhey Smart Interiors Image ${i}`
      img.loading = "lazy"

      img.onclick = () => {
        openModal(i)
      }

      const gridItem = document.createElement("div")
      gridItem.classList.add("grid-item")
      gridItem.appendChild(img)
      gallery.appendChild(gridItem)
    }
  }

  // Initial load of first 20 images
  loadGalleryImages(1, 20)

  // Load more images as user scrolls
  window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
      const loadedImages = gallery.children.length
      if (loadedImages < numberOfImages) {
        loadGalleryImages(loadedImages + 1, Math.min(loadedImages + 20, numberOfImages))
      }
    }
  })

  function openModal(imageIndex) {
    const modal = document.getElementById("imageModal")
    const modalImage = document.getElementById("modalImage")

    currentImageIndex = imageIndex
    modalImage.src = `assets/Images/Image (${currentImageIndex}).jpg`
    modal.style.display = "flex"
  }

  function closeModal() {
    const modal = document.getElementById("imageModal")
    modal.style.display = "none"
  }

  function navigateImage(direction) {
    if (direction === "next") {
      currentImageIndex = currentImageIndex === numberOfImages ? 1 : currentImageIndex + 1
    } else if (direction === "prev") {
      currentImageIndex = currentImageIndex === 1 ? numberOfImages : currentImageIndex - 1
    }

    const modalImage = document.getElementById("modalImage")
    modalImage.src = `assets/Images/Image (${currentImageIndex}).jpg`
  }

  // Add keyboard navigation for modal
  document.addEventListener("keydown", (e) => {
    if (document.getElementById("imageModal").style.display === "flex") {
      if (e.key === "ArrowLeft") navigateImage("prev")
      if (e.key === "ArrowRight") navigateImage("next")
      if (e.key === "Escape") closeModal()
    }
  })


  // Only set up hamburger menu if elements exist
  if (hamburger && navLinks && getQuoteButton) {
    function toggleMenu() {
      hamburger.classList.toggle("active")
      navLinks.classList.toggle("active")
      if (getQuoteButton) getQuoteButton.classList.toggle("active")

      // Toggle aria-expanded for accessibility
      const isExpanded = hamburger.classList.contains("active")
      hamburger.setAttribute("aria-expanded", isExpanded)
    }

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      const isClickInsideMenu = navLinks.contains(e.target)
      const isClickOnHamburger = hamburger.contains(e.target)

      if (!isClickInsideMenu && !isClickOnHamburger && navLinks.classList.contains("active")) {
        toggleMenu()
      }
    })
    hamburger.addEventListener("click", (e) => {
      e.stopPropagation()
      toggleMenu()
    })
  }
  // Close menu on window resize (prevent menu issues when switching orientations)
  let resizeTimer
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 1024) {
        // Desktop breakpoint
        hamburger.classList.remove("active")
        navLinks.classList.remove("active")
        if (getQuoteButton) getQuoteButton.classList.remove("active")
      }
    }, 250)
  })
  console.log("Gallery element found:", !!gallery)
  console.log("Testing first image path:", `assets/Images/Image (1).jpg`)

  // Map initialization
  function initMap() {
    const mapConfig = {
      coords: [13.0274499, 77.6510631],
      zoom: 16,
      title: "Radhey Smart Interiors",
      address: "86, 4th Cross Rd, Mallappa Layout, Hennur Gardens, Bengaluru, Karnataka 560043",
    }

    const map = L.map("map", {
      center: mapConfig.coords,
      zoom: mapConfig.zoom,
      scrollWheelZoom: false,
    })

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
      minZoom: 10,
    }).addTo(map)

    const marker = L.marker(mapConfig.coords).addTo(map)

    const popupContent = `
            <div class="map-popup">
                <h3>${mapConfig.title}</h3>
                <p>${mapConfig.address}</p>
                <a href="https://www.google.com/maps/dir/?api=1&destination=${mapConfig.coords[0]},${mapConfig.coords[1]}" 
                   target="_blank" 
                   rel="noopener noreferrer">
                   Get Directions
                </a>
            </div>
        `

    marker.bindPopup(popupContent).openPopup()

    map.on("click", () => {
      map.scrollWheelZoom.enable()
    })

    map.on("mouseout", () => {
      map.scrollWheelZoom.disable()
    })
  }

  // Call the map initialization function when the page loads
  window.addEventListener("load", initMap)
})

