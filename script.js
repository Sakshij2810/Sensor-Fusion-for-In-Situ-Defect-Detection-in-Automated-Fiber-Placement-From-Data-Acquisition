/* ============================================
   SENSOR FUSION BLOG - JAVASCRIPT
   Sidebar Navigation & Interactive Features
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  // Elements
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".blog-sidebar-link");

  // Highlight active section in sidebar based on scroll position
  function highlightActiveSection() {
    let scrollPosition = window.scrollY + 120; // Offset for better UX

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === "#" + sectionId) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  // Throttle scroll events for better performance
  let scrollTimeout;
  window.addEventListener("scroll", function () {
    if (scrollTimeout) {
      window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(function () {
      highlightActiveSection();
    });
  });

  // Initial highlight on page load
  highlightActiveSection();

  // Smooth scrolling for sidebar links
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        // Calculate scroll position with offset
        const headerOffset = 40;
        const elementPosition = targetSection.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        // Update active state immediately
        navLinks.forEach((l) => l.classList.remove("active"));
        this.classList.add("active");
      }
    });
  });

  // Add subtle animation to cards on scroll into view
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  // Animate cards
  const animatedElements = document.querySelectorAll(
    ".stat-card, .level-card, .conclusion-card, .learn-more-card, .strategy-card, .feature-item, .spec-card",
  );

  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    observer.observe(el);
  });

  // Add hover effect enhancement to images
  const images = document.querySelectorAll(
    ".full-width-image, .split-image img",
  );
  images.forEach((img) => {
    img.addEventListener("mouseenter", function () {
      this.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";
      this.style.transform = "scale(1.01)";
      this.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.15)";
    });
    img.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
      this.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.08)";
    });
  });

  // Table row hover highlight
  const tableRows = document.querySelectorAll(".data-table tbody tr");
  tableRows.forEach((row) => {
    row.addEventListener("mouseenter", function () {
      this.style.backgroundColor = "#f1f5f9";
    });
    row.addEventListener("mouseleave", function () {
      this.style.backgroundColor = "";
    });
  });

  // Back to top functionality (optional enhancement)
  const createBackToTop = () => {
    const button = document.createElement("button");
    button.innerHTML = "↑";
    button.className = "back-to-top";
    button.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, #bf3425 0%, #9d2a1e 100%);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-size: 20px;
            font-weight: bold;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(191, 52, 37, 0.3);
        `;

    button.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-3px)";
      this.style.boxShadow = "0 8px 25px rgba(191, 52, 37, 0.4)";
    });

    button.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
      this.style.boxShadow = "0 4px 15px rgba(191, 52, 37, 0.3)";
    });

    button.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });

    document.body.appendChild(button);

    window.addEventListener("scroll", function () {
      if (window.pageYOffset > 500) {
        button.style.opacity = "1";
        button.style.visibility = "visible";
      } else {
        button.style.opacity = "0";
        button.style.visibility = "hidden";
      }
    });
  };

  createBackToTop();

  // Reading progress indicator (optional enhancement)
  const createProgressBar = () => {
    const progressBar = document.createElement("div");
    progressBar.className = "reading-progress";
    progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, #bf3425, #47577c);
            z-index: 9999;
            transition: width 0.1s linear;
            width: 0%;
        `;
    document.body.appendChild(progressBar);

    window.addEventListener("scroll", function () {
      const windowHeight = window.innerHeight;
      const documentHeight =
        document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;
      progressBar.style.width = progress + "%";
    });
  };

  createProgressBar();

  // Lazy loading images (if not using native lazy loading)
  const lazyImages = document.querySelectorAll("img[data-src]");
  if (lazyImages.length > 0) {
    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add("loaded");
            observer.unobserve(img);
          }
        });
      },
      { rootMargin: "100px" },
    );

    lazyImages.forEach((img) => imageObserver.observe(img));
  }

  // Copy code functionality for any code blocks (if present)
  const codeBlocks = document.querySelectorAll("pre code");
  codeBlocks.forEach((block) => {
    const container = block.parentElement;
    const copyButton = document.createElement("button");
    copyButton.textContent = "Copy";
    copyButton.className = "copy-code-btn";
    copyButton.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 5px 10px;
            background: #47577c;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            opacity: 0;
            transition: opacity 0.2s;
        `;

    container.style.position = "relative";
    container.appendChild(copyButton);

    container.addEventListener("mouseenter", () => {
      copyButton.style.opacity = "1";
    });
    container.addEventListener("mouseleave", () => {
      copyButton.style.opacity = "0";
    });

    copyButton.addEventListener("click", () => {
      navigator.clipboard.writeText(block.textContent).then(() => {
        copyButton.textContent = "Copied!";
        setTimeout(() => {
          copyButton.textContent = "Copy";
        }, 2000);
      });
    });
  });

  console.log("Sensor Fusion Blog - Scripts loaded successfully");
});

//  <!-- INFOGRAPHIC 1: AFP CELL TIME BREAKDOWN - Inspection 42%, Rework 20%, Layup 19%, Other 19% -->

(function () {
  var ctx = document.getElementById("afpTimeChart").getContext("2d");

  var afpTimeChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Inspection", "Rework", "Layup", "Other"],
      datasets: [
        {
          data: [42, 20, 19, 19],
          backgroundColor: ["#bf3425", "#47577c", "#1e293b", "#9d9d9c"],
          hoverBackgroundColor: ["#d9453a", "#5a6b8f", "#334155", "#b0b0b0"],
          borderWidth: 3,
          borderColor: "#ffffff",
          hoverBorderWidth: 4,
          hoverOffset: 15,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "55%",
      animation: {
        animateScale: true,
        animateRotate: true,
        duration: 1500,
        easing: "easeOutQuart",
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "#ffffff",
          titleColor: "#1e293b",
          bodyColor: "#475569",
          borderColor: "#e2e8f0",
          borderWidth: 1,
          padding: 16,
          cornerRadius: 8,
          displayColors: true,
          boxPadding: 6,
          callbacks: {
            label: function (context) {
              var label = context.label || "";
              var value = context.parsed || 0;
              var descriptions = {
                Inspection: "Quality verification & defect detection",
                Rework: "Fixing defects & re-processing",
                Layup: "Actual material deposition",
                Other: "Setup, maintenance & transitions",
              };
              return [label + ": " + value + "%", descriptions[label] || ""];
            },
          },
        },
      },
    },
  });

  // Interactive legend highlighting
  var legendItems = document.querySelectorAll(".afp-time-legend-item");
  legendItems.forEach(function (item) {
    item.addEventListener("mouseenter", function () {
      var index = parseInt(this.getAttribute("data-index"));
      afpTimeChart.setActiveElements([{ datasetIndex: 0, index: index }]);
      afpTimeChart.update();
    });

    item.addEventListener("mouseleave", function () {
      afpTimeChart.setActiveElements([]);
      afpTimeChart.update();
    });
  });
})();

//  <!-- INFOGRAPHIC 2: AFP DEFECTS hierarchy -->

(function () {
  // Add animation on scroll into view
  const categories = document.querySelectorAll(".afp-category-card");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }, index * 150);
        }
      });
    },
    { threshold: 0.1 },
  );

  categories.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    observer.observe(card);
  });

  // Trigger animations immediately for visible cards
  setTimeout(() => {
    categories.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, index * 150);
    });
  }, 100);

  // Category header click to collapse/expand
  const headers = document.querySelectorAll(".afp-category-header");
  headers.forEach((header) => {
    header.addEventListener("click", function () {
      const list = this.parentElement.querySelector(".afp-defect-list");
      if (list.style.maxHeight && list.style.maxHeight !== "500px") {
        list.style.maxHeight = "500px";
        list.style.opacity = "1";
      } else {
        list.style.maxHeight = list.scrollHeight + "px";
      }
    });
  });
})();

//   <!-- INFOGRAPHIC 3: GAP DEFECT vs OVERLAP DEFECT cross-section -->
(function () {
  // Add entrance animations
  const cards = document.querySelectorAll(".afp-defect-card");

  cards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = "opacity 0.5s ease, transform 0.5s ease";

    setTimeout(
      () => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      },
      200 + index * 150,
    );
  });

  // Add table row animations
  const rows = document.querySelectorAll(".afp-comparison-row");
  rows.forEach((row, index) => {
    if (index === 0) return; // Skip header
    row.style.opacity = "0";
    row.style.transform = "translateX(-10px)";
    row.style.transition = "opacity 0.4s ease, transform 0.4s ease";

    setTimeout(
      () => {
        row.style.opacity = "1";
        row.style.transform = "translateX(0)";
      },
      500 + index * 100,
    );
  });
})();

//   <!-- INFOGRAPHIC 4: Radar chart comparing sensors -->
(function () {
  // Sensor data
  const sensorData = {
    laser: {
      name: "Laser Profilometry",
      color: "#47577c",
      data: [7, 7, 6, 10, 6],
      details: {
        "In-Situ": "7/10",
        "Gap Detect": "7/10",
        "Twist/Wrinkle": "6/10",
        Resolution: "10/10",
        Speed: "6/10",
      },
      description:
        "High-precision surface profiling with micron-level accuracy",
    },
    thermo: {
      name: "Thermography",
      color: "#bf3425",
      data: [10, 6, 8, 5, 9],
      details: {
        "In-Situ": "10/10",
        "Gap Detect": "6/10",
        "Twist/Wrinkle": "8/10",
        Resolution: "5/10",
        Speed: "9/10",
      },
      description: "Real-time thermal imaging for process monitoring",
    },
    eddy: {
      name: "Eddy Current",
      color: "#9d9d9c",
      data: [5, 8, 5, 6, 5],
      details: {
        "In-Situ": "5/10",
        "Gap Detect": "8/10",
        "Twist/Wrinkle": "5/10",
        Resolution: "6/10",
        Speed: "5/10",
      },
      description: "Electromagnetic sensing for subsurface defect detection",
    },
    structured: {
      name: "Structured Light",
      color: "#1e293b",
      data: [6, 8, 7, 8, 7],
      details: {
        "In-Situ": "6/10",
        "Gap Detect": "8/10",
        "Twist/Wrinkle": "7/10",
        Resolution: "8/10",
        Speed: "7/10",
      },
      description: "3D surface reconstruction for geometry verification",
    },
  };

  const ctx = document.getElementById("sensorRadarChart").getContext("2d");

  const sensorRadarChart = new Chart(ctx, {
    type: "radar",
    data: {
      labels: [
        "In-Situ Capable",
        "Gap Detection",
        "Twist/Wrinkle",
        "Resolution",
        "Processing Speed",
      ],
      datasets: [
        {
          label: "Laser Profilometry",
          data: sensorData.laser.data,
          borderColor: "#47577c",
          backgroundColor: "rgba(71, 87, 124, 0.1)",
          borderWidth: 2,
          pointBackgroundColor: "#47577c",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: "Thermography",
          data: sensorData.thermo.data,
          borderColor: "#bf3425",
          backgroundColor: "rgba(191, 52, 37, 0.1)",
          borderWidth: 2,
          pointBackgroundColor: "#bf3425",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: "Eddy Current",
          data: sensorData.eddy.data,
          borderColor: "#9d9d9c",
          backgroundColor: "rgba(157, 157, 156, 0.1)",
          borderWidth: 2,
          pointBackgroundColor: "#9d9d9c",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: "Structured Light",
          data: sensorData.structured.data,
          borderColor: "#1e293b",
          backgroundColor: "rgba(30, 41, 59, 0.1)",
          borderWidth: 2,
          pointBackgroundColor: "#1e293b",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          min: 0,
          max: 10,
          ticks: {
            stepSize: 2,
            display: true,
            backdropColor: "transparent",
            color: "#94a3b8",
            font: { size: 10 },
          },
          angleLines: {
            color: "#e2e8f0",
          },
          grid: {
            color: "#e2e8f0",
          },
          pointLabels: {
            color: "#475569",
            font: {
              size: 11,
              weight: "600",
              family: "Inter",
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "#ffffff",
          titleColor: "#1e293b",
          bodyColor: "#475569",
          borderColor: "#e2e8f0",
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          displayColors: true,
          boxPadding: 6,
          callbacks: {
            label: function (context) {
              return context.dataset.label + ": " + context.parsed.r + "/10";
            },
          },
        },
      },
      animation: {
        duration: 1500,
        easing: "easeOutQuart",
      },
    },
  });

  // Legend interactivity
  const legendItems = document.querySelectorAll(".sensor-legend-item");
  const detailsPanel = document.getElementById("sensorDetailsPanel");
  const detailCard = document.getElementById("sensorDetailCard");
  const detailTitle = document.getElementById("sensorDetailTitle");
  const detailGrid = document.getElementById("sensorDetailGrid");

  legendItems.forEach((item, index) => {
    item.addEventListener("click", function () {
      const sensorKey = this.getAttribute("data-sensor");
      const sensor = sensorData[sensorKey];

      // Toggle active state
      const wasActive = this.classList.contains("active");
      legendItems.forEach((li) => li.classList.remove("active"));

      if (!wasActive) {
        this.classList.add("active");
        showDetails(sensor);

        // Highlight this dataset
        sensorRadarChart.data.datasets.forEach((dataset, i) => {
          if (i === index) {
            dataset.borderWidth = 3;
            dataset.backgroundColor = dataset.borderColor
              .replace(")", ", 0.25)")
              .replace("rgb", "rgba");
          } else {
            dataset.borderWidth = 1;
            dataset.backgroundColor = dataset.borderColor
              .replace(")", ", 0.05)")
              .replace("rgb", "rgba");
          }
        });
      } else {
        hideDetails();
        // Reset all datasets
        sensorRadarChart.data.datasets.forEach((dataset) => {
          dataset.borderWidth = 2;
          dataset.backgroundColor = dataset.borderColor
            .replace(")", ", 0.1)")
            .replace("rgb", "rgba");
        });
      }

      sensorRadarChart.update();
    });

    // Hover effect for chart
    item.addEventListener("mouseenter", function () {
      const idx = index;
      sensorRadarChart.setActiveElements([
        { datasetIndex: idx, index: 0 },
        { datasetIndex: idx, index: 1 },
        { datasetIndex: idx, index: 2 },
        { datasetIndex: idx, index: 3 },
        { datasetIndex: idx, index: 4 },
      ]);
      sensorRadarChart.update();
    });

    item.addEventListener("mouseleave", function () {
      if (!this.classList.contains("active")) {
        sensorRadarChart.setActiveElements([]);
        sensorRadarChart.update();
      }
    });
  });

  function showDetails(sensor) {
    detailTitle.textContent = sensor.name;
    detailCard.style.borderLeftColor = sensor.color;

    let gridHTML = "";
    for (const [label, value] of Object.entries(sensor.details)) {
      gridHTML += `
        <div class="sensor-detail-stat">
          <div class="sensor-detail-stat-value" style="color: ${sensor.color}">${value}</div>
          <div class="sensor-detail-stat-label">${label}</div>
        </div>
      `;
    }
    detailGrid.innerHTML = gridHTML;
    detailsPanel.classList.add("visible");
  }

  window.hideDetails = function () {
    detailsPanel.classList.remove("visible");
    legendItems.forEach((li) => li.classList.remove("active"));

    // Reset all datasets
    sensorRadarChart.data.datasets.forEach((dataset) => {
      dataset.borderWidth = 2;
      const baseColor = dataset.borderColor;
      if (baseColor.startsWith("#")) {
        const r = parseInt(baseColor.slice(1, 3), 16);
        const g = parseInt(baseColor.slice(3, 5), 16);
        const b = parseInt(baseColor.slice(5, 7), 16);
        dataset.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.1)`;
      }
    });
    sensorRadarChart.update();
  };
})();

//   <!-- FIGURE 6: Laser Profilometry Operating Principle -->

(function () {
  // Entrance animations
  const steps = document.querySelectorAll(".laser-step");
  steps.forEach((step, index) => {
    step.style.opacity = "0";
    step.style.transform = "translateY(20px)";
    step.style.transition = "opacity 0.5s ease, transform 0.5s ease";

    setTimeout(
      () => {
        step.style.opacity = "1";
        step.style.transform = "translateY(0)";
      },
      300 + index * 100,
    );
  });

  const specs = document.querySelectorAll(".laser-spec-card");
  specs.forEach((spec, index) => {
    spec.style.opacity = "0";
    spec.style.transform = "scale(0.9)";
    spec.style.transition = "opacity 0.5s ease, transform 0.5s ease";

    setTimeout(
      () => {
        spec.style.opacity = "1";
        spec.style.transform = "scale(1)";
      },
      600 + index * 100,
    );
  });

  // Step hover highlighting
  steps.forEach((step, index) => {
    step.addEventListener("mouseenter", () => {
      // Could add SVG highlighting here for corresponding elements
      step.style.backgroundColor = "#f0f4f8";
    });

    step.addEventListener("mouseleave", () => {
      step.style.backgroundColor = "#f8fafc";
    });
  });
})();

//    <!-- INFOGRAPHIC 5: CNN architecture -->
(function () {
  // Layer data
  const layerData = {
    input: {
      title: "Input Layer",
      details: [
        { label: "Width", value: "224 px" },
        { label: "Height", value: "224 px" },
        { label: "Channels", value: "3 (RGB)" },
        { label: "Total Pixels", value: "150,528" },
      ],
    },
    conv1: {
      title: "Conv Block 1",
      details: [
        { label: "Filters", value: "64" },
        { label: "Kernel", value: "3×3" },
        { label: "Activation", value: "ReLU" },
        { label: "Output", value: "112×112×64" },
      ],
    },
    conv2: {
      title: "Conv Block 2",
      details: [
        { label: "Filters", value: "128" },
        { label: "Kernel", value: "3×3" },
        { label: "Activation", value: "ReLU" },
        { label: "Output", value: "56×56×128" },
      ],
    },
    conv3: {
      title: "Conv Block 3",
      details: [
        { label: "Filters", value: "256" },
        { label: "Kernel", value: "3×3" },
        { label: "Activation", value: "ReLU" },
        { label: "Output", value: "28×28×256" },
      ],
    },
    dense1: {
      title: "Dense Layer 1",
      details: [
        { label: "Units", value: "1024" },
        { label: "Activation", value: "ReLU" },
        { label: "Dropout", value: "0.5" },
        { label: "Parameters", value: "~2M" },
      ],
    },
    dense2: {
      title: "Dense Layer 2",
      details: [
        { label: "Units", value: "256" },
        { label: "Activation", value: "ReLU" },
        { label: "Dropout", value: "0.3" },
        { label: "Parameters", value: "~262K" },
      ],
    },
  };

  const detailsPanel = document.getElementById("detailsPanel");
  const detailsTitle = document.getElementById("detailsTitle");
  const detailsGrid = document.getElementById("detailsGrid");

  // Add click handlers to layers
  document.querySelectorAll("[data-layer]").forEach((layer) => {
    layer.addEventListener("click", function () {
      const layerKey = this.getAttribute("data-layer");
      const data = layerData[layerKey];

      if (data) {
        showDetails(data);
      }
    });
  });

  function showDetails(data) {
    detailsTitle.textContent = data.title;

    let html = "";
    data.details.forEach((item) => {
      html += `
        <div class="cnn-details-item">
          <div class="cnn-details-value">${item.value}</div>
          <div class="cnn-details-label">${item.label}</div>
        </div>
      `;
    });

    detailsGrid.innerHTML = html;
    detailsPanel.classList.add("visible");
  }

  window.hideDetails = function () {
    detailsPanel.classList.remove("visible");
  };

  // Animate data flow
  let currentArrow = 0;
  const arrows = document.querySelectorAll(".cnn-arrow");

  function animateFlow() {
    arrows.forEach((arrow, i) => {
      if (i === currentArrow) {
        arrow.classList.add("active");
      } else {
        arrow.classList.remove("active");
      }
    });

    currentArrow = (currentArrow + 1) % arrows.length;
  }

  setInterval(animateFlow, 800);

  // Output class hover simulation
  const outputClasses = document.querySelectorAll(".cnn-output-class");

  function simulatePrediction() {
    const probs = [
      Math.random() * 0.1,
      Math.random() * 0.1,
      Math.random() * 0.1,
      Math.random() * 0.1,
      Math.random() * 0.1,
    ];

    // Make one probability high
    const highIndex = Math.floor(Math.random() * 5);
    probs[highIndex] = 0.7 + Math.random() * 0.25;

    // Normalize
    const sum = probs.reduce((a, b) => a + b, 0);
    probs.forEach((p, i) => {
      const normalized = (p / sum).toFixed(2);
      outputClasses[i].querySelector(".cnn-output-prob").textContent =
        normalized;
    });
  }

  // Simulate predictions every 3 seconds
  setInterval(simulatePrediction, 3000);

  // Entrance animations
  const sections = document.querySelectorAll(".cnn-section");
  sections.forEach((section, index) => {
    section.style.opacity = "0";
    section.style.transform = "translateY(20px)";
    section.style.transition = "opacity 0.5s ease, transform 0.5s ease";

    setTimeout(
      () => {
        section.style.opacity = "1";
        section.style.transform = "translateY(0)";
      },
      200 + index * 150,
    );
  });
})();

// <!-- INFOGRAPHIC 6: Predictive detection pipeline -->

(function () {
  // Entrance animations
  const stages = document.querySelectorAll(
    ".pipeline-stage-box, .pipeline-input-box, .pipeline-output-box",
  );

  stages.forEach((stage, index) => {
    stage.style.opacity = "0";
    stage.style.transform = "translateY(20px)";
    stage.style.transition = "opacity 0.5s ease, transform 0.5s ease";

    setTimeout(
      () => {
        stage.style.opacity = "1";
        stage.style.transform = "translateY(0)";
      },
      200 + index * 200,
    );
  });

  // Arrow flow synchronization
  const arrows = document.querySelectorAll(".pipeline-arrow-line");
  arrows.forEach((arrow, index) => {
    arrow.style.animationDelay = `${index * 0.3}s`;
  });

  // Prediction value animation
  const predictionValues = document.querySelectorAll(".prediction-value");

  function animatePredictions() {
    predictionValues.forEach((value) => {
      value.style.transition = "transform 0.3s ease";
      value.style.transform = "scale(1.05)";
      setTimeout(() => {
        value.style.transform = "scale(1)";
      }, 300);
    });
  }

  // Trigger prediction animation periodically
  setInterval(animatePredictions, 4000);
})();

// <!-- INFOGRAPHIC 7: Latency budget waterfall -->
(function () {
  // Entrance animations for bars
  const bars = document.querySelectorAll(".waterfall-bar");

  bars.forEach((bar, index) => {
    const originalWidth = bar.style.width;
    bar.style.width = "0";
    bar.style.transition = "width 0.8s ease-out";

    setTimeout(
      () => {
        bar.style.width = originalWidth;
      },
      300 + index * 150,
    );
  });

  // Row hover effects
  const rows = document.querySelectorAll(".waterfall-row[data-component]");

  rows.forEach((row) => {
    row.addEventListener("mouseenter", function () {
      const bar = this.querySelector(".waterfall-bar");
      if (bar) {
        bar.style.filter = "brightness(1.1)";
      }
    });

    row.addEventListener("mouseleave", function () {
      const bar = this.querySelector(".waterfall-bar");
      if (bar) {
        bar.style.filter = "brightness(1)";
      }
    });
  });

  // Animate cumulative values
  const cumulatives = document.querySelectorAll(".time-cumulative");
  cumulatives.forEach((cum, index) => {
    cum.style.opacity = "0";
    cum.style.transition = "opacity 0.5s ease";

    setTimeout(
      () => {
        cum.style.opacity = "1";
      },
      800 + index * 150,
    );
  });
})();
//  <!-- INFOGRAPHIC 8: Control maturity levels pyramid -->
(function () {
  // Level details data
  const levelData = {
    5: {
      title: "Level 5: Full Autonomous",
      color: "#1e293b",
      details: [
        {
          label: "Capability",
          value: "Autonomous defect removal, repair, and process resumption",
        },
        { label: "Human Role", value: "Supervisory monitoring only" },
        { label: "Response Time", value: "Real-time continuous" },
        {
          label: "Technology Status",
          value:
            "Concept stage - requires significant advances in robotics and AI",
        },
      ],
    },
    4: {
      title: "Level 4: Adaptive Parameter Control",
      color: "#47577c",
      details: [
        {
          label: "Capability",
          value:
            "Real-time adjustment of temperature, pressure, speed, and path",
        },
        {
          label: "Human Role",
          value: "Set boundaries and approve major changes",
        },
        { label: "Response Time", value: "< 100ms parameter updates" },
        {
          label: "Technology Status",
          value: "Active R&D with promising lab demonstrations",
        },
      ],
    },
    3: {
      title: "Level 3: Detect, Halt, and Assist",
      color: "#bf3425",
      details: [
        {
          label: "Capability",
          value:
            "Automated detection, process halt, and guided correction recommendations",
        },
        { label: "Human Role", value: "Execute recommended corrections" },
        { label: "Response Time", value: "< 500ms detection to halt" },
        {
          label: "Technology Status",
          value: "Research demonstrations in controlled environments",
        },
      ],
    },
    2: {
      title: "Level 2: Detect and Halt",
      color: "#9d9d9c",
      details: [
        {
          label: "Capability",
          value: "Automated defect detection with automatic layup pause",
        },
        { label: "Human Role", value: "Evaluate defect and decide on action" },
        { label: "Response Time", value: "< 1s detection to halt" },
        {
          label: "Technology Status",
          value: "Emerging in production environments",
        },
      ],
    },
    1: {
      title: "Level 1: Detect and Alert",
      color: "#64748b",
      details: [
        {
          label: "Capability",
          value: "Automated defect detection with operator notification",
        },
        {
          label: "Human Role",
          value: "Monitor alerts, halt process, inspect, and correct",
        },
        { label: "Response Time", value: "Depends on operator response" },
        {
          label: "Technology Status",
          value: "Industry standard - widely deployed",
        },
      ],
    },
    0: {
      title: "Level 0: Open Loop",
      color: "#cbd5e1",
      details: [
        {
          label: "Capability",
          value: "No automated inspection - manual visual inspection only",
        },
        {
          label: "Human Role",
          value: "Perform all inspection and quality control",
        },
        { label: "Response Time", value: "Post-process inspection only" },
        {
          label: "Technology Status",
          value: "Baseline - still common in many facilities",
        },
      ],
    },
  };

  const detailPanel = document.getElementById("detailPanel");
  const detailTitle = document.getElementById("detailTitle");
  const detailContent = document.getElementById("detailContent");

  // Add click handlers to levels
  document.querySelectorAll(".pyramid-level").forEach((level) => {
    level.addEventListener("click", function () {
      const levelNum = this.getAttribute("data-level");
      const data = levelData[levelNum];

      if (data) {
        showDetails(data);
      }
    });
  });

  function showDetails(data) {
    detailTitle.textContent = data.title;
    detailTitle.style.color = data.color;

    let html = "";
    data.details.forEach((item) => {
      html += `
        <div class="detail-item" style="border-left-color: ${data.color}">
          <div class="detail-item-label">${item.label}</div>
          <div class="detail-item-value">${item.value}</div>
        </div>
      `;
    });

    detailContent.innerHTML = html;
    detailPanel.classList.add("visible");

    // Scroll to panel
    detailPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  window.hideDetails = function () {
    detailPanel.classList.remove("visible");
  };

  // Entrance animations
  const levels = document.querySelectorAll(".pyramid-level");

  levels.forEach((level, index) => {
    level.style.opacity = "0";
    level.style.transform = "translateY(-20px)";
    level.style.transition = "opacity 0.5s ease, transform 0.5s ease";

    // Animate from top to bottom
    setTimeout(
      () => {
        level.style.opacity = "1";
        level.style.transform = "translateY(0)";
      },
      200 + index * 100,
    );
  });

  // Status badge animations
  const badges = document.querySelectorAll(".status-badge");
  badges.forEach((badge, index) => {
    badge.style.opacity = "0";
    badge.style.transition = "opacity 0.5s ease";

    setTimeout(
      () => {
        badge.style.opacity = "0.9";
      },
      800 + index * 100,
    );
  });
})();
//    <!-- INFOGRAPHIC 9: Multi-sensor fusion architecture -->
(function () {
  // Entrance animations
  const containers = [
    document.querySelector(".sensors-container"),
    ...document.querySelectorAll(".feature-box"),
    ...document.querySelectorAll(".processing-block"),
    ...document.querySelectorAll(".decision-box"),
  ];

  containers.forEach((el, index) => {
    if (el) {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity 0.5s ease, transform 0.5s ease";

      setTimeout(
        () => {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        },
        200 + index * 80,
      );
    }
  });

  // Sensor card click highlighting
  const sensorCards = document.querySelectorAll(".sensor-card");
  const featureBoxes = document.querySelectorAll(".feature-box");

  sensorCards.forEach((card, index) => {
    card.addEventListener("mouseenter", function () {
      if (featureBoxes[index]) {
        featureBoxes[index].style.transform = "translateY(-4px)";
        featureBoxes[index].style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
      }
    });

    card.addEventListener("mouseleave", function () {
      if (featureBoxes[index]) {
        featureBoxes[index].style.transform = "";
        featureBoxes[index].style.boxShadow = "";
      }
    });
  });

  // Decision items interaction
  const decisionItems = document.querySelectorAll(".decision-item");
  decisionItems.forEach((item) => {
    item.addEventListener("mouseenter", function () {
      this.querySelector(".decision-item-dot").style.transform = "scale(1.5)";
    });

    item.addEventListener("mouseleave", function () {
      this.querySelector(".decision-item-dot").style.transform = "";
    });
  });
})();

// <!-- INFOGRAPHIC 10: Literature gap bar chart -->
(function () {
  // Animate bars on load
  const bars = document.querySelectorAll(".bar");

  setTimeout(() => {
    bars.forEach((bar, index) => {
      const targetWidth = bar.getAttribute("data-width");
      setTimeout(() => {
        bar.style.transition = "width 1s ease-out";
        bar.style.width = targetWidth;
      }, index * 100);
    });
  }, 300);

  // Row hover interaction
  const rows = document.querySelectorAll(".bar-row");
  rows.forEach((row) => {
    row.addEventListener("mouseenter", function () {
      const bar = this.querySelector(".bar");
      if (bar) {
        bar.style.filter = "brightness(1.15)";
        bar.style.transform = "scaleY(1.1)";
      }
    });

    row.addEventListener("mouseleave", function () {
      const bar = this.querySelector(".bar");
      if (bar) {
        bar.style.filter = "";
        bar.style.transform = "";
      }
    });
  });

  // Stat cards animation
  const statCards = document.querySelectorAll(".stat-card");
  statCards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = "opacity 0.5s ease, transform 0.5s ease";

    setTimeout(
      () => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      },
      1200 + index * 150,
    );
  });

  // Animate stat values counting up
  const statValues = document.querySelectorAll(".stat-value");
  statValues.forEach((stat, index) => {
    const finalValue = stat.textContent;
    const isPercentage = finalValue.includes("%");
    const numValue = parseInt(finalValue.replace(/[^0-9]/g, ""));

    let currentValue = 0;
    const increment = numValue / 30;
    const prefix = finalValue.startsWith("~") ? "~" : "";
    const suffix = isPercentage ? "%" : "";

    setTimeout(
      () => {
        const counter = setInterval(() => {
          currentValue += increment;
          if (currentValue >= numValue) {
            currentValue = numValue;
            clearInterval(counter);
          }
          stat.textContent = prefix + Math.round(currentValue) + suffix;
        }, 30);
      },
      1500 + index * 200,
    );
  });
})();
