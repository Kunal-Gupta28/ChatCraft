// an function to reduce the function calls
export default function debounce(fn, delay = 300) {
  let timer;

  function debounced(...args) {
    const context = this;

    clearTimeout(timer);

    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  }

  // cancel pending execution
  debounced.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  // flush immediately
  debounced.flush = (...args) => {
    if (timer) {
      clearTimeout(timer);
      fn(...args);
      timer = null;
    }
  };

  return debounced;
}