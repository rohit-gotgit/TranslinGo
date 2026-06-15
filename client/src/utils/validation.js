// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return { isValid: false, error: "Email is required" };
  }
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }
  return { isValid: true, error: null };
};

// Password validation
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, error: "Password is required" };
  }
  if (password.length < 8) {
    return { isValid: false, error: "Password must be at least 8 characters long" };
  }
  if (password.length > 128) {
    return { isValid: false, error: "Password must be less than 128 characters" };
  }
  return { isValid: true, error: null };
};

// Name validation
export const validateName = (name, fieldName = "Name") => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  if (name.trim().length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters long` };
  }
  if (name.trim().length > 50) {
    return { isValid: false, error: `${fieldName} must be less than 50 characters` };
  }
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  if (!nameRegex.test(name.trim())) {
    return { isValid: false, error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` };
  }
  return { isValid: true, error: null };
};

// Age validation
export const validateAge = (age) => {
  if (!age) {
    return { isValid: false, error: "Age is required" };
  }
  const ageNum = parseInt(age, 10);
  if (isNaN(ageNum)) {
    return { isValid: false, error: "Age must be a valid number" };
  }
  if (ageNum < 10) {
    return { isValid: false, error: "You must be at least 10 years old" };
  }
  if (ageNum > 99) {
    return { isValid: false, error: "Age must be less than 100" };
  }
  return { isValid: true, error: null };
};

// File validation
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.doc', '.docx']
  } = options;

  if (!file) {
    return { isValid: false, error: "File is required" };
  }

  // Check file size
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
    return { isValid: false, error: `File size must be less than ${maxSizeMB}MB` };
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: `File type not allowed. Allowed types: ${allowedExtensions.join(', ')}` };
  }

  // Check file extension
  const fileName = file.name.toLowerCase();
  const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext.toLowerCase()));
  if (!hasValidExtension) {
    return { isValid: false, error: `File extension not allowed. Allowed extensions: ${allowedExtensions.join(', ')}` };
  }

  return { isValid: true, error: null };
};

// Image file validation (specific for avatars)
export const validateImageFile = (file) => {
  return validateFile(file, {
    maxSize: 5 * 1024 * 1024, // 5MB for images
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  });
};
