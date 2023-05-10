import React, { useEffect, useState } from "react";
import { API, Storage } from 'aws-amplify';
import { listPostsWithLikes } from "../graphql/CustomQueries";
import {
  createPost as createPostMutation,
  deletePost as deletePostMutation,
  createLike as createLikeMutation,
  deleteLike as deleteLikeMutation
} from "../graphql/mutations";
import {
  Button,
  Flex,
  Image,
  Text,
  TextField,
  View,
  useAuthenticator
} from '@aws-amplify/ui-react';

export function PublicBoard() {
  const [posts, setPosts] = useState([]);
  const { route, user } = useAuthenticator((context) => [context.route, context.user]);
  
  async function refreshPosts() {
    // Use a custom list query that also fetches likes belonging to each post
    const apiData = await API.graphql({ query: listPostsWithLikes, authMode: 'AMAZON_COGNITO_USER_POOLS' }); //Need to include API_KEY authMode for public posts 
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
      authMode: 'AMAZON_COGNITO_USER_POOLS'
    });
    refreshPosts();
    event.target.reset();
  }

  async function addLike({ id }) { //Add a like - uses id of the post it is called against and createLike graphql query to put creating user's name as 'content' field in like
    const newLike = {
      content: user.username,
      postID: id
    };
    await API.graphql({
      query: createLikeMutation,
      variables: { input: newLike},
      authMode: 'AMAZON_COGNITO_USER_POOLS'
    });
    refreshPosts();
  }

  async function unLike( id ) { //remove like with given ID and refresh posts (and so also refresh likes) - called when user unlikes a post
    await API.graphql({
      query: deleteLikeMutation,
      variables: { input: { id } },
      authMode: 'AMAZON_COGNITO_USER_POOLS'
    });

    refreshPosts();
  }

  async function cleanupLike({ id }) { //remove like with given ID but do not fetch posts - called as part of deleting a post
    await API.graphql({
      query: deleteLikeMutation,
      variables: { input: { id } },
      authMode: 'AMAZON_COGNITO_USER_POOLS'
    });
  }

  async function deletePost({ id, name, likes }) {
    likes.items.map((like) => cleanupLike(like)); /// Delete all the likes belonging to a post so they are not stranded with no matching post

    const newPosts = posts.filter((post) => post.id !== id);
    setPosts(newPosts);
    await Storage.remove(name);
    await API.graphql({
      query: deletePostMutation,
      variables: { input: { id } },
      authMode: 'AMAZON_COGNITO_USER_POOLS'
    });
  }

  useEffect(() => {
    async function fetchPosts() {
      // Use a custom list query that also fetches likes belonging to each post
      const apiData = await API.graphql({ query: listPostsWithLikes, authMode: route === 'authenticated' ? 'AMAZON_COGNITO_USER_POOLS' : 'AWS_IAM' }); //Need to include API_KEY authMode for public posts 
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

    fetchPosts();
  }, [route]);

  return(

    <View className = "App">
  
      {(route === "authenticated") &&
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
      }

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
          
          {(route === "authenticated") &&
          <Button variation="link" onClick={() => deletePost(post)}>
            Delete post
          </Button>
          }
          
          {(route === "authenticated") && !post.likes.items.map(like => like.content).includes(user.username) && //if the post has no like from the current user display like button
            <Button variation="link" onClick={() => addLike(post)}>
              Like
            </Button>
          } 

          { (route === "authenticated") && post.likes.items.map(like => like.content).includes(user.username) && //else display unlike button - onClick will identify the id of the like and pass it to unLike function
            <Button variation="link" onClick={() => unLike(post.likes.items[post.likes.items.map(like => like.content).indexOf(user.username)].id)}>
              Unlike
            </Button>
          }
          
        </Flex>
      ))}
      </View>

    </View>

  );
}