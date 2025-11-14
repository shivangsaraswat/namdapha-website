// Google Sheet email verification
// For now using a simple check, can be upgraded to actual Google Sheets API

const AUTHORIZED_DOMAINS = ['iitmbs.org', 'gmail.com']; // Add your authorized domains

export async function isEmailAuthorized(email: string): Promise<boolean> {
  // TODO: Replace with actual Google Sheets API call
  // For now, check if email domain is authorized
  const domain = email.split('@')[1];
  return AUTHORIZED_DOMAINS.includes(domain);
}

// Future implementation with Google Sheets API:
/*
export async function isEmailAuthorized(email: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID}/values/Sheet1!A:A?key=${process.env.GOOGLE_SHEETS_API_KEY}`
    );
    const data = await response.json();
    const emails = data.values?.flat() || [];
    return emails.includes(email);
  } catch (error) {
    console.error('Error checking email authorization:', error);
    return false;
  }
}
*/
