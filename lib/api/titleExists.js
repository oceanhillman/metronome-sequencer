/**
 * Checks if a song with the given title exists for the currently logged-in user
 * by calling the backend API endpoint.
 *
 * Assumes the API endpoint is mounted at '/api/songs/exists' and expects
 * a 'title' query parameter.
 *
 * @param {string} title - The exact title of the song to check. Must be a non-empty string.
 * @returns {Promise<boolean>} A promise that resolves to:
 * - `true` if the song exists.
 * - `false` if the song does not exist (API returned exists: false).
 * @throws {Error} Throws an error if:
 * - The provided title is invalid.
 * - The network request fails (e.g., offline).
 * - The API returns a non-successful status code (e.g., 401 Unauthorized, 500 Internal Server Error).
 * - The API response is not valid JSON or doesn't contain the expected 'exists' boolean property.
 */
export default async function titleExists(title) {
    // 1. Input Validation
    if (!title || typeof title !== 'string' || title.trim() === '') {
      // Using Promise.reject is equivalent to throwing an error in an async function
      return Promise.reject(new Error('Invalid title provided. Title must be a non-empty string.'));
    }
  
    // Trim the title to avoid issues with leading/trailing whitespace
    const trimmedTitle = title.trim();
  
    // 2. Construct the URL with Query Parameter
    // IMPORTANT: Adjust '/api/songs/exists' if your actual API route is different!
    const apiPath = '/api/songs/titleExists';
    const params = new URLSearchParams({ title: trimmedTitle });
    const url = `${apiPath}?${params.toString()}`;
  
    try {
      // 3. Make the GET request
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          // Indicate that we expect a JSON response
          'Accept': 'application/json',
          // Content-Type is not typically needed for GET, but Accept is important
        }
      });
  
      // 4. Handle Non-OK HTTP Responses (e.g., 4xx, 5xx)
      if (!response.ok) {
        let errorMessage = `API request failed with status ${response.status}`;
        try {
          // Try to parse error details from the response body if available
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage; // Use specific error from API if provided
        } catch (e) {
          // Ignore error if response body isn't valid JSON
          errorMessage = `${errorMessage} ${response.statusText || ''}`.trim();
        }
  
        // Throw an error to be caught by the calling code
        throw new Error(errorMessage);
      }
  
      // 5. Parse the JSON response body for successful requests (200 OK)
      const data = await response.json();
  
      // 6. Validate response structure and return the 'exists' value
      if (typeof data?.exists !== 'boolean') {
        // The API response didn't match the expected format
        console.warn(`API response for title "${trimmedTitle}" is missing or has an invalid 'exists' property.`, data);
        throw new Error("Received an invalid response format from the server.");
      }
  
      return data.exists; // Should be true or false
  
    } catch (error) {
      // 7. Catch network errors or errors thrown during response handling
      console.error(`Error checking song existence for title "${trimmedTitle}":`, error);
      // Re-throw the error to allow calling code to handle it appropriately
      // You might want to customize the error message further depending on context
      throw error; // Re-throws the original error (could be fetch error or Error thrown above)
    }
  }
  
  // --- Example Usage ---
  /*
  async function handleCheckSongClick(songTitleToCheck) {
    if (!songTitleToCheck) {
      alert("Please enter a song title.");
      return;
    }
  
    try {
      const exists = await checkIfSongExists(songTitleToCheck);
  
      if (exists) {
        alert(`The song "${songTitleToCheck}" already exists in your library!`);
        // Maybe disable a save button, etc.
      } else {
        alert(`The song "${songTitleToCheck}" does not exist. You can save it.`);
        // Enable save button, etc.
      }
    } catch (error) {
      console.error("Failed to check song existence:", error);
      // Display a user-friendly error message
      alert(`Could not check if the song exists. Error: ${error.message}`);
    }
  }
  
  // Example of calling it:
  // handleCheckSongClick("My New Song Title");
  */