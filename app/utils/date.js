export function safeDateConverter(dateValue) {
    try {
      if (!dateValue) return new Date();
      
      // Handle MongoDB extended JSON format
      if (typeof dateValue === 'object' && dateValue.$date) {
        return new Date(dateValue.$date.$numberLong);
      }
      
      // Handle ISO strings and timestamps
      return new Date(dateValue);
    } catch (error) {
      console.error('Date conversion error:', error);
      return new Date(); // Fallback to current date
    }
  }
  
  export function formatLocalDate(date, locale = 'en-IN') {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Kolkata'
    };
    return safeDateConverter(date).toLocaleDateString(locale, options);
  }