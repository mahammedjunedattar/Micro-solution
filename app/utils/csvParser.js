export async function parseCSV(file) {
  return new Promise((resolve, reject) => {
    if (!(file instanceof Blob)) {
      return reject(new Error('Invalid file format. Please upload a valid CSV file.'));
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target.result.trim();

      // Split lines and filter out empty ones
      const lines = text.split('\n').filter(line => line.trim() !== '');

      if (lines.length < 2) {
        return reject(new Error('CSV file must contain at least a header and one data row.'));
      }

      const headers = lines[0].split(',').map(header => header.trim().toLowerCase());

      const data = lines.slice(1).map(line => {
        const values = line.split(',').map(value => value.trim());
        const entry = headers.reduce((obj, header, index) => {
          obj[header] = values[index] || '';
          return obj;
        }, {});

        // Ensure numeric and date fields are properly formatted
        entry.amount = parseFloat(entry.amount) || 0;
        entry.dueDate = new Date(entry.dueDate) || null;

        return entry;
      });

      resolve(data);
    };

    reader.onerror = (error) => reject(error);

    reader.readAsText(file);
  });
}
