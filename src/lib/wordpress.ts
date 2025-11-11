import axios from 'axios';

const apiUrl = process.env.WORDPRESS_API_URL;
const username = process.env.WORDPRESS_USERNAME;
const password = process.env.WORDPRESS_APP_PASSWORD;

function getAuthHeader() {
  const token = Buffer.from(`${username}:${password}`).toString('base64');
  return { Authorization: `Basic ${token}` };
}

export async function fetchPosts() {
  const res = await axios.get(`${apiUrl}/posts`);
  return res.data;
}

export async function createPost({ title, content }: { title: string; content: string }) {
  const res = await axios.post(
    `${apiUrl}/posts`,
    { title, content, status: 'publish' },
    { headers: { ...getAuthHeader(), 'Content-Type': 'application/json' } }
  );
  return res.data;
}
