const API_URL = process.env.MONGODB_API_URL;
const API_KEY = process.env.MONGODB_API_KEY;
const REGISTER_ENDPOINT = process.env.MONGODB_ENDPOINT_REGISTER;

export async function POST(req) {
  try {
    const data = await req.json(); // Parse the request body if needed

    // Make the API call to the registration endpoint
    const apiResponse = await fetch(REGISTER_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
        // Add authentication headers if required by your endpoint
      },
      body: JSON.stringify(data)
    });

    // Check if the API response is successful
    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      throw new Error(`API response error: ${errorText}`);
    }

    // Return a successful response
    return new Response(
      JSON.stringify({ message: 'User registered successfully!' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error handling POST request:', error);
    // Return an error response
    return new Response(
      JSON.stringify({ message: 'Registration failed', error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
