document.addEventListener('DOMContentLoaded', () => {
    const COLOR_TRACK = "#CBD5E1";
    const COLOR_RANGE = window.getComputedStyle(document.querySelector(".range_container")).getPropertyValue('--_marker-border-clr');

    // Get the sliders and tooltips
    const fromSlider = document.querySelector('#fromSlider');
    const toSlider = document.querySelector('#toSlider');
    const scale = document.getElementById('scale');

    // Get text fields
    const fromTextField = document.querySelector('.faceted-filter-group-display__price-range-from .faceted-filter-group-display__price-range-input');
    const toTextField = document.querySelector('.faceted-filter-group-display__price-range-to .faceted-filter-group-display__price-range-input');

    // Get min and max values from the fromSlider element
    const MIN = parseInt(fromSlider.getAttribute('min')); // scale will start from min value (first range slider)
    const MAX = parseInt(fromSlider.getAttribute('max')); // scale will end at max value (first range slider)
    const STEPS = parseInt(scale.dataset.steps); // update the data-steps attribute value to change the scale points

    function controlFromSlider(fromSlider, toSlider) {
        const [from, to] = getParsed(fromSlider, toSlider);
        fillSlider(fromSlider, toSlider, COLOR_TRACK, COLOR_RANGE, toSlider);
        if (from > to) {
            fromSlider.value = to;
        }
        updateTextfield();
    }

    function controlToSlider(fromSlider, toSlider) {
        const [from, to] = getParsed(fromSlider, toSlider);
        fillSlider(fromSlider, toSlider, COLOR_TRACK, COLOR_RANGE, toSlider);
        setToggleAccessible(toSlider);
        if (from <= to) {
            toSlider.value = to;
        } else {
            toSlider.value = from;
        }
        updateTextfield();
    }

    function updateTextfield() {
      fromTextField.value = fromSlider.value;
      toTextField.value = toSlider.value;
    }

    function getParsed(currentFrom, currentTo) {
        const from = parseInt(currentFrom.value, 10);
        const to = parseInt(currentTo.value, 10);
        return [from, to];
    }

    function fillSlider(from, to, sliderColor, rangeColor, controlSlider) {
        const rangeDistance = to.max - to.min;
        const fromPosition = from.value - to.min;
        const toPosition = to.value - to.min;
        controlSlider.style.background = `linear-gradient(
          to right,
          ${sliderColor} 0%,
          ${sliderColor} ${(fromPosition) / (rangeDistance) * 100}%,
          ${rangeColor} ${((fromPosition) / (rangeDistance)) * 100}%,
          ${rangeColor} ${(toPosition) / (rangeDistance) * 100}%, 
          ${sliderColor} ${(toPosition) / (rangeDistance) * 100}%, 
          ${sliderColor} 100%)`;
    }

    function setToggleAccessible(currentTarget) {
        const toSlider = document.querySelector('#toSlider');
        if (Number(currentTarget.value) <= 0) {
            toSlider.style.zIndex = 2;
        } else {
            toSlider.style.zIndex = 0;
        }
    }

    function createScale(min, max, step) {
      
        const range = max - min;
        const steps = range / step;
        for (let i = 0; i <= steps; i++) {
            const value = min + (i * step);
            const percent = (value - min) / range * 100;
            const marker = document.createElement('div');
            marker.style.left = `${percent}%`;
            marker.textContent = `$${value}`;
            scale.appendChild(marker);
        }
    }

    // events
    fromSlider.oninput = () => controlFromSlider(fromSlider, toSlider);
    toSlider.oninput = () => controlToSlider(fromSlider, toSlider);

    fromSlider.onchange = (e) => e.stopPropagation();
    toSlider.onchange = (e) => e.stopPropagation();

    fromTextField.onchange = () => {
      fromSlider.value = fromTextField.value;
      const event = new Event("input");
      fromSlider.dispatchEvent(event);
    };
    toTextField.onchange = () => {
      toSlider.value = toTextField.value;
      const event = new Event("input");
      toSlider.dispatchEvent(event);
    };



    // Initial load
    fillSlider(fromSlider, toSlider, COLOR_TRACK, COLOR_RANGE, toSlider);
    setToggleAccessible(toSlider);
    createScale(MIN, MAX, STEPS);
  });