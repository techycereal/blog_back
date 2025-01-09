const express = require('express');
const cors = require('cors');
const app = express();
const { authenticateUser } = require('./middleware');
const { admin, db } = require('./firebase');

app.use(cors());
app.use(express.json());



const createUserWithUniqueDisplayName = async (email, password, displayName) => {
    try {
      // Check if the displayName is already taken
      const snapshot = await db.collection('usernames').doc(displayName).get();
      if (snapshot.exists) {
        throw new Error('Display name is already taken.');
      }  
      // Create the user in Firebase Auth
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName,
      });
  
      // Add the displayName to Firestore to mark it as used
      await db.collection('usernames').doc(displayName).set({
        uid: userRecord.uid,
      });
  
      return userRecord;
    } catch (error) {
        console.log(error)
      throw new Error(error.message);
    }
  };
  
  // Usage
  app.post('/register', async (req, res) => {
    const { email, password, displayName } = req.body;
  
    if (!email || !password || !displayName) {
      return res.status(400).send('Email, password, and display name are required.');
    }
  
    try {
      const user = await createUserWithUniqueDisplayName(email, password, displayName);
      res.status(201).send({ uid: user.uid, displayName: user.displayName });
    } catch (error) {
        console.log(error)
      res.status(400).send(error.message);
    }
  });

  app.get('/post', async (req, res) => {
    try {
      // Get query parameters with defaults
      const limit = parseInt(req.query.limit) || 10;
      const orderBy = req.query.orderBy || 'createdAt';
      const order = req.query.order === 'asc' ? 'asc' : 'desc';
  
      // Build the query
      let query = db.collection('posts')
        .orderBy(orderBy, order)
        .limit(limit);
  
      const postsSnapshot = await query.get();
      const posts = [];
  
      postsSnapshot.forEach(doc => {
        // Get all the document data and exclude the 'uid' field
        const data = doc.data();
        delete data.uid;  // Remove the 'uid' field from the data
        console.log(data)
  
        posts.push({
          id: doc.id,
          ...data
        });
      });
  
      res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).send('Error fetching posts');
    }
  });
  

// Create a new post
app.post('/post', authenticateUser, async (req, res) => {
    const { name, content, likes } = req.body;
    if (!name || !content) {
      return res.status(400).send('name and content are required.');
    }
  
    try {
      // Create a new document with auto-generated id
      const postRef = db.collection('posts').doc();
  
      // Set the document data
      const postData = {
        name,
        content,
        uid: req.user.uid,
        owner: req.user.name,
        likes,
        createdAt: new Date().toISOString(),
      };
      await postRef.set(postData);
  
      // Add the document ID to the data
      const responseData = {
        id: postRef.id,
        ...postData,
      };
  
      res.status(200).send(responseData);
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).send('Error creating post');
    }
  });
  

app.delete('/post/:id', authenticateUser, async (req, res) => {
    const { id } = req.params;
  
    try {
      // Fetch the document by ID
      const postRef = db.collection('posts').doc(id);
      const postSnapshot = await postRef.get();
  
      // Check if the document exists
      if (!postSnapshot.exists) {
        return res.status(404).send('Post not found.');
      }
      const postData = postSnapshot.data();
      if (postData.uid !== req.user.uid) {
        return res.status(403).send('You are not authorized to delete this post.');
      }
  
      // Delete the document
      await postRef.delete();
      res.status(200).send({ message: 'Post deleted successfully.' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Error.');
    }
  });

app.get('/post/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      // Fetch the document by ID
      const postRef = db.collection('posts').doc(id);
      const postSnapshot = await postRef.get();
  
      // Check if the document exists
      if (!postSnapshot.exists) {
        return res.status(404).send('Post not found.');
      }
      const postData = postSnapshot.data();
      res.status(200).send(postData);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Error.');
    }
  });

  app.put('/post', authenticateUser, async (req, res) => {
    const { updates, id } = req.body;
    const name = updates.name
    const content = updates.content
    
    // Ensure name and content are provided
    if (!name || !content || !id) {
        return res.status(400).send('name, content, and post ID are required.');
    }

    // Fetch the document by ID
    const postRef = db.collection('posts').doc(id);
    const postSnapshot = await postRef.get();

    // Check if the document exists
    if (!postSnapshot.exists) {
        return res.status(404).send('Post not found.');
    }

    const postData = postSnapshot.data();

    // Check if the user is authorized to edit the post
    if (postData.uid !== req.user.uid) {
        return res.status(403).send('You are not authorized to edit this post.');
    }

    // Update the post document with new name and content
    try {
        await postRef.update({
            ...updates,
            updatedAt: new Date()  // Optionally, add an update timestamp
        });
        res.status(200).send('Post updated successfully.');
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).send('Error updating post.');
    }
});

app.put('/like_post', async (req, res) => {
    const { likes, id } = req.body;
    
    // Fetch the document by ID
    const postRef = db.collection('posts').doc(id);
    const postSnapshot = await postRef.get();

    // Check if the document exists
    if (!postSnapshot.exists) {
        return res.status(404).send('Post not found.');
    }

    // Update the post document with new name and content
    try {
        await postRef.update({
            likes
        });
        res.status(200).send('Post updated successfully.');
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).send('Error updating post.');
    }
});

app.get('/myposts', authenticateUser, async (req, res) => {
    try {
        // Get the UID from the authenticated user
        const userUid = req.user.uid;

        // Query the database to get all posts where the uid matches the current user's UID
        const postsSnapshot = await db.collection('posts')
            .where('uid', '==', userUid)  // Make sure 'uid' is indexed in Firestore
            .get();

        // If no posts are found
        if (postsSnapshot.empty) {
            return res.status(404).send('No posts found for this user.');
        }

        // Map over the documents and return them as an array of post data
        const posts = postsSnapshot.docs.map(doc => {
            return { id: doc.id, ...doc.data() };
        });

        // Send the posts back in the response
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error.');
    }
});


app.get('/get_post/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Query the database to get a single post by its id
        const postRef = db.collection('posts').doc(id);
        const postSnapshot = await postRef.get();

        // If no post is found
        if (!postSnapshot.exists) {
            return res.status(404).send('No post found with this ID.');
        }

        // Return the post data with its ID
        const post = { id: postSnapshot.id, ...postSnapshot.data() };

        // Send the post back in the response
        res.status(200).json(post);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error.');
    }
});



app.listen(3009, () => {
  console.log('Server is running on port 3009');
});