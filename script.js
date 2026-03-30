const menuButton = document.querySelector('.menu-btn');
const nav = document.querySelector('.site-nav');

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      nav.classList.remove('open');
    });
  });
}

const searchIndex = [
  {
    title: 'Home',
    description: 'Welcome, venue, important dates, proceedings, about NIT Silchar and CSE department.',
    url: 'index.html',
    keywords: ['home welcome venue dates proceedings about nit silchar cse department silchar keynote publication']
  },
  {
    title: 'Committee',
    description: 'Organizing committee, general chairs, advisory and technical committee details.',
    url: 'committee.html#organizing',
    keywords: ['committee organizing committee general chairs technical committee advisory hospitality registration chairs']
  },
  {
    title: 'Call For Papers',
    description: 'Conference tracks, brochure, best paper awards and special session details.',
    url: 'call-for-papers.html#tracks',
    keywords: ['call for papers tracks brochure best paper awards special session artificial intelligence iot data analytics']
  },
  {
    title: 'Submission Guidelines',
    description: 'Submission process, templates, consent form, camera-ready instructions and checklist.',
    url: 'submission.html#submission-guidelines-title',
    keywords: ['submission manuscript templates consent publish camera ready guidelines checklist cmt springer files naming']
  },
  {
    title: 'Registration',
    description: 'Registration fee, payment notes and form link.',
    url: 'registration.html',
    keywords: ['registration fees payment form gst indian authors abroad listeners students academicians industry']
  },
  {
    title: 'Contact',
    description: 'Conference contact information for AICTA 2026 at NIT Silchar.',
    url: 'index.html#contact',
    keywords: ['contact email address nit silchar department of computer science and engineering']
  }
];

const normalizeSearchText = (value) => value.toLowerCase().replace(/\s+/g, ' ').trim();

const getSearchMatches = (query) => {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return [];
  }

  const terms = normalizedQuery.split(' ');

  return searchIndex.filter((entry) => {
    const haystack = normalizeSearchText(`${entry.title} ${entry.description} ${entry.keywords.join(' ')}`);
    return terms.every((term) => haystack.includes(term));
  });
};

document.querySelectorAll('.site-search').forEach((form) => {
  const input = form.querySelector('.site-search-input');
  const results = form.querySelector('.site-search-results');

  if (!input || !results) {
    return;
  }

  const hideResults = () => {
    results.hidden = true;
    results.innerHTML = '';
  };

  const renderResults = (matches, query) => {
    results.innerHTML = '';

    if (!query) {
      hideResults();
      return;
    }

    if (matches.length === 0) {
      const emptyState = document.createElement('p');
      emptyState.className = 'site-search-empty';
      emptyState.textContent = 'No matching pages found.';
      results.appendChild(emptyState);
      results.hidden = false;
      return;
    }

    matches.slice(0, 6).forEach((match) => {
      const link = document.createElement('a');
      link.className = 'site-search-result';
      link.href = match.url;
      link.innerHTML = `<strong>${match.title}</strong><span>${match.description}</span>`;
      results.appendChild(link);
    });

    results.hidden = false;
  };

  input.addEventListener('input', () => {
    const matches = getSearchMatches(input.value);
    renderResults(matches, input.value);
  });

  input.addEventListener('focus', () => {
    const matches = getSearchMatches(input.value);
    renderResults(matches, input.value);
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      hideResults();
      input.blur();
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const matches = getSearchMatches(input.value);

    if (matches.length > 0) {
      window.location.href = matches[0].url;
      return;
    }

    renderResults([], input.value);
  });

  document.addEventListener('click', (event) => {
    if (!form.contains(event.target)) {
      hideResults();
    }
  });
});

const viewCounterKey = 'aicta-site-view-count';
const currentCount = Number(window.localStorage.getItem(viewCounterKey) || '0') + 1;
window.localStorage.setItem(viewCounterKey, String(currentCount));

document.querySelectorAll('.view-counter-value').forEach((counterNode) => {
  counterNode.textContent = currentCount.toLocaleString('en-IN');
});

const glimpsesSlider = document.querySelector('.glimpses-slider');
const glimpsesTrack = document.querySelector('.glimpses-track');
const glimpsesSlides = document.querySelectorAll('.glimpses-slide');
const glimpsesDotsContainer = document.querySelector('.glimpses-dots');

if (glimpsesSlider && glimpsesTrack && glimpsesSlides.length > 0 && glimpsesDotsContainer) {
  let currentIndex = 0;
  let autoplayId;

  const updateSlider = (index) => {
    currentIndex = index;
    glimpsesTrack.style.transform = `translateX(-${index * 100}%)`;

    const dots = glimpsesDotsContainer.querySelectorAll('.glimpses-dot');
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('active', dotIndex === index);
      dot.setAttribute('aria-selected', String(dotIndex === index));
    });
  };

  const startAutoplay = () => {
    autoplayId = window.setInterval(() => {
      const nextIndex = (currentIndex + 1) % glimpsesSlides.length;
      updateSlider(nextIndex);
    }, 3500);
  };

  const stopAutoplay = () => {
    if (autoplayId) {
      window.clearInterval(autoplayId);
    }
  };

  glimpsesSlides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'glimpses-dot';
    dot.setAttribute('aria-label', `Go to glimpse ${index + 1}`);
    dot.setAttribute('aria-selected', 'false');

    dot.addEventListener('click', () => {
      updateSlider(index);
      stopAutoplay();
      startAutoplay();
    });

    glimpsesDotsContainer.appendChild(dot);
  });

  glimpsesSlider.addEventListener('mouseenter', stopAutoplay);
  glimpsesSlider.addEventListener('mouseleave', startAutoplay);

  updateSlider(0);
  startAutoplay();
}
