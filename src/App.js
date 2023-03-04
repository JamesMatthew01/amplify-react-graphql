import React, { useState, useEffect } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { listNotes, listLogins } from "./graphql/queries";
import { listPostsWithLikes } from "./graphql/CustomQueries";
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation,
  createPost as createPostMutation,
  deletePost as deletePostMutation,
  createLike as createLikeMutation,
  deleteLike as deleteLikeMutation,
  createLogin as createLoginMutation,
  updateLogin as updateLoginMutation,
  deleteLogin as deleteLoginMutation
} from "./graphql/mutations";
import { API, Storage , Auth} from 'aws-amplify'; //added auth to this to allow session information
import {
  Button,
  Flex,
  Heading,
  Image,
  Text,
  TextField,
  View,
  withAuthenticator,
} from '@aws-amplify/ui-react';


const App = ({ signOut, user }) => {

  const [notes, setNotes] = useState([]);
  const [posts, setPosts] = useState([]);
  const [logins, setLogins] = useState([]);

  useEffect(() => {
    loginHandler(); //added call to session handler that uploads login to database
    fetchNotes();
    fetchPosts();
  }, []);

  async function loginHandler() {
    const token = await Auth.currentSession();
    
    const filterByUser = {
      filter: {
        userName: {
          eq: user.username
        }
      }
    };

    const previousLogin = await API.graphql({ query: listLogins, authMode: 'API_KEY', variables: filterByUser });
    
    if(previousLogin && previousLogin.data.listLogins.items.length > 0) {
      console.log("Updating an entry")
      const loginData = {
        id: previousLogin.data.listLogins.items[0].id,
        loginTime: token.getAccessToken().payload.auth_time
      };

      await API.graphql({
        query: updateLoginMutation,
        variables: { input: loginData },
        authMode: 'API_KEY'
      });

    } else {
      console.log("Creating the entry")
      const loginData = {
        userName: user.username,
        loginTime: token.getAccessToken().payload.auth_time
      };
      
      await API.graphql({
        query: createLoginMutation,
        variables: { input: loginData },
        authMode: 'API_KEY'
      });
    }

    fetchLogins();
  }

  async function fetchNotes() {
    const apiData = await API.graphql({ query: listNotes, authMode: 'AMAZON_COGNITO_USER_POOLS' }); //Need to include authMode here in addition to changning @auth in schema
    const notesFromAPI = apiData.data.listNotes.items;
    await Promise.all(
      notesFromAPI.map(async (note) => {
        if (note.image) {
          const url = await Storage.get(note.name);
          note.image = url;
        }
        return note;
      })
    );
    setNotes(notesFromAPI);
  }

  async function fetchPosts() {
    /// Replace the previous list posts query with a new one that includes likes
    const apiData = await API.graphql({ query: listPostsWithLikes, authMode: 'API_KEY' }); //Need to include a different authMode for public posts - using cognito or omitting causes error even though posts are public anyway 
    const postsFromAPI = apiData.data.listPosts.items;
    await Promise.all(
      postsFromAPI.map(async (post) => {
        if (post.image) {
          const url = await Storage.get(post.name);
          post.image = url;
        }
        return post;
      })
    );
    setPosts(postsFromAPI);
  }

  async function fetchLogins() {
    const apiData = await API.graphql({ query: listLogins, authMode: 'API_KEY' });
    const loginsFromAPI = apiData.data.listLogins.items;
    setLogins(loginsFromAPI);
  }

  async function createNote(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const image = form.get("image");
    const data = {
      name: form.get("name"),
      description: form.get("description"),
      image: image.name,
    };
    if (!!data.image) await Storage.put(data.name, image);
    await API.graphql({
      query: createNoteMutation,
      variables: { input: data },
      authMode: 'AMAZON_COGNITO_USER_POOLS'
    });
    fetchNotes();
    event.target.reset();
  }

  async function createPost(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const image = form.get("image");
    const data = {
      name: form.get("name"),
      description: form.get("description"),
      image: image.name,
    };
    if (!!data.image) await Storage.put(data.name, image);
    await API.graphql({
      query: createPostMutation,
      variables: { input: data },
      authMode: 'API_KEY'
    });
    fetchPosts();
    event.target.reset();
  }

  ///Add a like - takes the id of the post it is called against and uses createLike graphql query to put creating user's name as a like
  async function addLike({ id }) {
    const newLike = {
      content: user.username,
      postLikesId: id
    };
    await API.graphql({
      query: createLikeMutation,
      variables: { input: newLike},
      authMode: 'API_KEY'
    });
    fetchPosts();
  }

  async function deleteNote({ id, name }) {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
    await Storage.remove(name);
    await API.graphql({
      query: deleteNoteMutation,
      variables: { input: { id } },
      authMode: 'AMAZON_COGNITO_USER_POOLS'
    });
  }

  async function cleanupLike({ id }) {
    await API.graphql({
      query: deleteLikeMutation,
      variables: { input: { id } },
      authMode: 'API_KEY'
    });
  }

  async function unLike( id ) {
    await API.graphql({
      query: deleteLikeMutation,
      variables: { input: { id } },
      authMode: 'API_KEY'
    });

    fetchPosts();
  }
  
  async function deletePost({ id, name, likes }) {
    likes.items.map((like) => cleanupLike(like)); /// Delete all the likes belonging to a post so they are not stranded with no matching post

    const newPosts = posts.filter((post) => post.id !== id);
    setPosts(newPosts);
    await Storage.remove(name);
    await API.graphql({
      query: deletePostMutation,
      variables: { input: { id } },
      authMode: 'API_KEY'
    });
}

  async function deleteLogin({ id }) {
    await API.graphql({
      query: deleteLoginMutation,
      variables: { input: { id } },
      authMode: 'API_KEY'
    });
    fetchLogins();
  }


 
  return (
    <View className="App">

      <Heading level={1}>Notes and Posts</Heading>

      <View as="form" margin="3rem 0" onSubmit={createNote}>
        <Flex direction="row" justifyContent="center">
          <Text fontWeight={"bold"}>Create a private note:</Text>
          <TextField
            name="name"
            placeholder="Note Name"
            label="Note Name"
            labelHidden
            variation="quiet"
            required
          />
          <TextField
            name="description"
            placeholder="Note Description"
            label="Note Description"
            labelHidden
            variation="quiet"
            required
          />
          <View
            name="image"
            as="input"
            type="file"
            style={{ alignSelf: "end" }}
          />
          <Button type="submit" variation="primary">
            Create Note
          </Button>
        </Flex>
      </View>

      <View as="form" margin="3rem 0" onSubmit={createPost}>
        <Flex direction="row" justifyContent="center">
          <Text fontWeight={"bold"}>Create a public post:</Text>
          <TextField
            name="name"
            placeholder="Post Name"
            label="Post Name"
            labelHidden
            variation="quiet"
            required
          />
          <TextField
            name="description"
            placeholder="Post Description"
            label="Post Description"
            labelHidden
            variation="quiet"
            required
          />
          <View
            name="image"
            as="input"
            type="file"
            style={{ alignSelf: "end" }}
          />
          <Button type="submit" variation="primary">
            Create Post
          </Button>
        </Flex>
      </View>

      <Heading level={2}>Private Notes of User: {user.username}</Heading>
      <View margin="3rem 0">
      {notes.map((note) => (
        <Flex
        key={note.id || note.name}
        direction="row"
        justifyContent="center"
        alignItems="center"
        >
          <Text as="strong" fontWeight={700}>
            {note.name}
          </Text>
          <Text as="span">{note.description}</Text>
            {note.image && (
          <Image
            src={note.image}
            alt={`visual aid for ${notes.name}`}
            style={{ width: 400 }}
          />
            )}
          <Button variation="link" onClick={() => deleteNote(note)}>
            Delete note
          </Button>
        </Flex>
      ))}
      </View>
      
      <Heading level={2}>Public Posts</Heading>
      <View margin="3rem 0">
      {posts.map((post) => (

        <Flex
        key={post.id || post.name}
        direction="row"
        justifyContent="center"
        alignItems="center"
        >
          <Text as="strong" fontWeight={700}>
            {post.name}
          </Text>
          <Text as="span">{post.description}</Text>
            {post.image && (
          <Image
            src={post.image}
            alt={`visual aid for ${posts.name}`}
            style={{ width: 400 }}
          />
            )}
          
          <Text as="strong" fontWeight={700}>Liked by:</Text>
          {post.likes.items.map((like) => (
            <Text as="span" key={like.id}>{like.content}</Text>
          ))}
          
          <Button variation="link" onClick={() => deletePost(post)}>
            Delete post
          </Button>
          
          { !post.likes.items.map(like => like.content).includes(user.username) &&
            <Button variation="link" onClick={() => addLike(post)}>
              Like
            </Button>
          } 

          { post.likes.items.map(like => like.content).includes(user.username) &&
            <Button variation="link" onClick={() => unLike(post.likes.items[post.likes.items.map(like => like.content).indexOf(user.username)].id)}>
              Unlike
            </Button>
          }        
          
        </Flex>
      ))}
      </View>

      <Heading level={2}>User Activity</Heading>
      <View margin="3rem 0">
      {logins.map((login) => (
        <Flex
        key={login.id || login.name}
        direction="row"
        justifyContent="center"
        alignItems="center"
        >
          <Text as="strong" fontWeight={700}>
            {login.userName}
          </Text>
          <Text as="span">{new Date(1000 * login.loginTime).toISOString()}</Text>
          <Button variation="link" onClick={() => deleteLogin(login)}>Delete Login</Button>

        </Flex>
      ))}
      </View>

      <Button onClick={signOut}>Sign Out</Button>
    </View>
  );
};

export default withAuthenticator(App);