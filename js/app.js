/**
 *
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 *
 * Dependencies: None
 *
 * JS Version: ES2015/ES6
 *
 * JS Standard: ESlint
 *
 */

/**
 * Comments should be present at the beginning of each procedure and class.
 * Great to have comments before crucial code sections within the procedure.
 */

/**
 * Define Global Variables
 *
 */
// Define Global Variables
const sections = document.querySelectorAll("section");
const navBarList = document.getElementById("navbar__list");
const scrollToTopBtn = document.getElementById("scrollToTopBtn");
/**
 * End Global Variables
 * Start Helper Functions
 *
 */
// Helper function to check if an element is in the viewport
const isInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return rect.top >= 0 && rect.top <= window.innerHeight * 0.5;
};

// Helper function to check if the user has scrolled below the fold of the page
const isBelowFold = () => {
  return window.scrollY > window.innerHeight;
};

// Helper function to highlight the active menu item
function highlightActiveMenuItem(activeSectionId) {
  const navItems = document.querySelectorAll(".menu__link");

  navItems.forEach((item) => {
    item.classList.remove("active");

    if (item.getAttribute("href") === `#${activeSectionId}`) {
      item.classList.add("active");
    }
  });
}
// Debounce function to limit the rate of function execution
const debounce = (func, delay) => {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

// Throttle function to limit the frequency of function execution
const throttle = (func, limit) => {
  let throttleId;
  let lastExecutedTime = 0;

  return function (...args) {
    const now = Date.now();

    if (now - lastExecutedTime >= limit) {
      func.apply(this, args);
      lastExecutedTime = now;
    } else {
      clearTimeout(throttleId);
      throttleId = setTimeout(() => {
        func.apply(this, args);
        lastExecutedTime = now;
      }, limit - (now - lastExecutedTime));
    }
  };
};
/**
 * End Helper Functions
 * Begin Main Functions
 *
 */
// build the nav
// Build the navigation menu dynamically
const buildNavMenu = () => {
  // Add Page Content Efficiently
  const fragment = document.createDocumentFragment(); // using a DocumentFragment instead of a <div>

  sections.forEach((section) => {
    const listItem = document.createElement("li");
    const sectionId = section.getAttribute("id");
    const sectionName = section.getAttribute("data-nav");

    listItem.innerHTML = `<a class="menu__link" href="#${sectionId}">${sectionName}</a>`;
    fragment.appendChild(listItem);
  });

  navBarList.appendChild(fragment); // reflow and repaint here once
};

// Add class 'active' to section when near top of viewport
const setActiveSection = throttle(() => {
  let activeSection = sections[0];
  let minDistance = Infinity;

  sections.forEach((section) => {
    const distance = Math.abs(section.getBoundingClientRect().top);
    if (distance < minDistance) {
      minDistance = distance;
      activeSection = section;
    }
  });

  sections.forEach((section) => {
    section.classList.remove("section-active");
  });

  activeSection.classList.add("section-active");
  highlightActiveMenuItem(activeSection.id);
  // We can use the for loop if the forEach method is not supported by any browser
  //   for (let i = 0; i < sections.length; i++) {
  //     if (isInViewport(sections[i])) {
  //       sections[i].classList.add("section-active");
  //     } else {
  //       sections[i].classList.remove("section-active");
  //     }
  //   }
}, 0); // throttling time (200 milliseconds)

// Scroll to anchor ID using scrollTO event
// Scroll to the corresponding section when a navigation link is clicked
const scrollToSection = (event) => {
  event.preventDefault();
  // Checking the Node Type in Event Delegation
  if (event.target.nodeName === "A") {
    const sectionId = event.target.getAttribute("href");
    const targetSection = document.querySelector(sectionId);

    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  }
};

// Show or hide the scroll-to-top button based on the scroll position
const toggleScrollToTopButton = () => {
  if (isBelowFold()) {
    scrollToTopBtn.classList.add("show");
  } else {
    scrollToTopBtn.classList.remove("show");
  }
};

// Scroll to the top of the page
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
const handleScrollActions = () => {
  toggleScrollToTopButton();
  setActiveSection();
};
const debouncedScrollActions = debounce(handleScrollActions, 200);
const throttledScrollToTop = throttle(scrollToTop, 500);
/**
 * End Main Functions
 * Begin Events
 *
 */

// Build menu
// Build the navigation menu on page load
document.addEventListener("DOMContentLoaded", buildNavMenu);

// Scroll to section on link click
// Event Delegation
navBarList.addEventListener("click", scrollToSection);

// Set sections as active
// Toggle the scroll-to-top button visibility on scroll using debounced function
window.addEventListener("scroll", debouncedScrollActions);

// Scroll to top when the scroll-to-top button is clicked using throttled function
scrollToTopBtn.addEventListener("click", throttledScrollToTop);
