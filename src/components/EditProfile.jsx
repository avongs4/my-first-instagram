// src/components/EditProfile.jsx
import React, { useEffect, useState } from 'react';
import { API, Auth } from 'aws-amplify';
import { createUser, updateUser } from '../graphql/mutations';
import { getUser } from '../graphql/queries';

function EditProfile() {
  const [formData, setFormData] = useState({
    id: '',
    email: '',
    username: '',
    bio: '',
    avatarUrl: '',
    tags: '',
    socialLinks: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { attributes } = await Auth.currentAuthenticatedUser();
      const userId = attributes.sub;
      const email = attributes.email;

      try {
        const { data } = await API.graphql({
          query: getUser,
          variables: { id: userId },
        });

        if (data.getUser) {
          setFormData({ ...data.getUser });
        } else {
          // If user doesn't exist, store initial values
          setFormData((prev) => ({
            ...prev,
            id: userId,
            email,
          }));
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const input = {
      ...formData,
      tags: formData.tags.split(',').map((t) => t.trim()),
      socialLinks: JSON.stringify({ twitter: formData.socialLinks }),
    };

    try {
      if (formData.__typename) {
        // update existing user
        await API.graphql({ query: updateUser, variables: { input } });
        alert('Profile updated!');
      } else {
        // create new user
        await API.graphql({ query: createUser, variables: { input } });
        alert('Profile created!');
      }
    } catch (err) {
      console.error('Error saving profile:', err);
    }
  };

  return (
    <div>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        /><br />

        <textarea
          name="bio"
          placeholder="Bio"
          value={formData.bio}
          onChange={handleChange}
        /><br />

        <input
          name="avatarUrl"
          placeholder="Avatar URL"
          value={formData.avatarUrl}
          onChange={handleChange}
        /><br />

        <input
          name="tags"
          placeholder="Tags (comma separated)"
          value={formData.tags}
          onChange={handleChange}
        /><br />

        <input
          name="socialLinks"
          placeholder="Twitter URL"
          value={formData.socialLinks}
          onChange={handleChange}
        /><br />

        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
}

export default EditProfile;
