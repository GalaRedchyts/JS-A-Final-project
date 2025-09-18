export function validateTitle(title, errorElement) {
    const value = title.trim();

    if (value.length === 0) {
      hideError(errorElement);
      return false;
    }
  
    if (value.length < 2) {
      showError(errorElement, "Title must be at least 2 characters.");
      return false;
    }
    if (value.length > 50) {
      showError(errorElement, "Title must be less than 50 characters.");
      return false;
    }
  
    hideError(errorElement);
    return true;
  }
  
  function showError(errorElement, message) {
    if (!errorElement) return;
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }
  
  function hideError(errorElement) {
    if (!errorElement) return;
    errorElement.textContent = "";
    errorElement.style.display = "none";
  }
  