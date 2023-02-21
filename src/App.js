import React, { useState, useEffect } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { listNotes, listPosts } from "./graphql/queries";
import { listPostsWithLikes } from "./graphql/CustomQueries";
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation,
  createPost as createPostMutation,
  deletePost as deletePostMutation,
  createLike as createLikeMutation,
  deleteLike as deleteLikeMutation
} from "./graphql/mutations";
import { API, Storage } from 'aws-amplify';
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

  useEffect(() => {
    fetchNotes();
    fetchPosts();
  }, []);

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
    /// Replace the previous list posts query with a new one that includes likes -------------------------------------------------------
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
/// -----------------------------------------------------------------------------------------------------------------------------------

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


  /// New function to delete a like when passed its ID -----------------------------------------------------------
  async function deleteLike({ id }) {
    await API.graphql({
      query: deleteLikeMutation,
      variables: { input: { id } },
      authMode: 'API_KEY'
    });
  }
  /// ------------------------------------------------------------------------------------------------------------


  async function deletePost({ id, name, likes }) {
    likes.items.map((like) => deleteLike(like)); /// Delete all the likes belonging to a post so they are not stranded with no matching post---------------------

    const newPosts = posts.filter((post) => post.id !== id);
    setPosts(newPosts);
    await Storage.remove(name);
    await API.graphql({
      query: deletePostMutation,
      variables: { input: { id } },
      authMode: 'API_KEY'
    });
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
          
          {/* /// Take the likes array of this post and display each --------------------------------------------------- */}
          <Text as="strong" fontWeight={700}>Liked by:</Text>
          {post.likes.items.map((like) => (
            <Text as="span">{like.content}</Text>
          ))}
          {/* /// ------------------------------------------------------------------------------------------------------ */}
          
          <Button variation="link" onClick={() => deletePost(post)}>
            Delete post
          </Button>

          {/* /// Add a like onto a given post ------------------------------------------------------------------------- */}
          <Button variation="link" onClick={() => addLike(post)}>
            Like
          </Button>
          {/* /// ------------------------------------------------------------------------------------------------------ */}

        </Flex>
      ))}
      </View>

      <Button onClick={signOut}>Sign Out</Button>
    </View>
  );
};

export default withAuthenticator(App);