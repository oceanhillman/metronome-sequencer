// pages/api/addCurrentUser.js

import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async (req, res) => {
  const session = getSession(req, res);

  if (!session || !session.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const { email, name } = session.user;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/user/addUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, name }),
    });

    if (response.ok) {
      res.status(200).json({ message: 'User added successfully' });
    } else {
      res.status(response.status).json({ message: 'Error adding user' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
