export default async function isSubscribed(email) {
    try {
      const response = await fetch('/api/check-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      const res = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
  
      return res.activeSubscription;
    } catch (error) {
      console.error('Error checking subscription:', error.message);
      return { error: error.message };
    }
  }
  