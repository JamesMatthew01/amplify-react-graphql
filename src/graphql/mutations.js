/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createNote = /* GraphQL */ `
  mutation CreateNote(
    $input: CreateNoteInput!
    $condition: ModelNoteConditionInput
  ) {
    createNote(input: $input, condition: $condition) {
      id
      name
      description
      image
      createdAt
      updatedAt
      owner
    }
  }
`;
export const updateNote = /* GraphQL */ `
  mutation UpdateNote(
    $input: UpdateNoteInput!
    $condition: ModelNoteConditionInput
  ) {
    updateNote(input: $input, condition: $condition) {
      id
      name
      description
      image
      createdAt
      updatedAt
      owner
    }
  }
`;
export const deleteNote = /* GraphQL */ `
  mutation DeleteNote(
    $input: DeleteNoteInput!
    $condition: ModelNoteConditionInput
  ) {
    deleteNote(input: $input, condition: $condition) {
      id
      name
      description
      image
      createdAt
      updatedAt
      owner
    }
  }
`;
export const createPost = /* GraphQL */ `
  mutation CreatePost(
    $input: CreatePostInput!
    $condition: ModelPostConditionInput
  ) {
    createPost(input: $input, condition: $condition) {
      id
      name
      description
      image
      likes {
        items {
          id
          content
          postID
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const updatePost = /* GraphQL */ `
  mutation UpdatePost(
    $input: UpdatePostInput!
    $condition: ModelPostConditionInput
  ) {
    updatePost(input: $input, condition: $condition) {
      id
      name
      description
      image
      likes {
        items {
          id
          content
          postID
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const deletePost = /* GraphQL */ `
  mutation DeletePost(
    $input: DeletePostInput!
    $condition: ModelPostConditionInput
  ) {
    deletePost(input: $input, condition: $condition) {
      id
      name
      description
      image
      likes {
        items {
          id
          content
          postID
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const createLike = /* GraphQL */ `
  mutation CreateLike(
    $input: CreateLikeInput!
    $condition: ModelLikeConditionInput
  ) {
    createLike(input: $input, condition: $condition) {
      id
      content
      post {
        id
        name
        description
        image
        likes {
          nextToken
        }
        createdAt
        updatedAt
      }
      postID
      createdAt
      updatedAt
    }
  }
`;
export const updateLike = /* GraphQL */ `
  mutation UpdateLike(
    $input: UpdateLikeInput!
    $condition: ModelLikeConditionInput
  ) {
    updateLike(input: $input, condition: $condition) {
      id
      content
      post {
        id
        name
        description
        image
        likes {
          nextToken
        }
        createdAt
        updatedAt
      }
      postID
      createdAt
      updatedAt
    }
  }
`;
export const deleteLike = /* GraphQL */ `
  mutation DeleteLike(
    $input: DeleteLikeInput!
    $condition: ModelLikeConditionInput
  ) {
    deleteLike(input: $input, condition: $condition) {
      id
      content
      post {
        id
        name
        description
        image
        likes {
          nextToken
        }
        createdAt
        updatedAt
      }
      postID
      createdAt
      updatedAt
    }
  }
`;
export const createLogin = /* GraphQL */ `
  mutation CreateLogin(
    $input: CreateLoginInput!
    $condition: ModelLoginConditionInput
  ) {
    createLogin(input: $input, condition: $condition) {
      id
      userName
      loginTime
      createdAt
      updatedAt
    }
  }
`;
export const updateLogin = /* GraphQL */ `
  mutation UpdateLogin(
    $input: UpdateLoginInput!
    $condition: ModelLoginConditionInput
  ) {
    updateLogin(input: $input, condition: $condition) {
      id
      userName
      loginTime
      createdAt
      updatedAt
    }
  }
`;
export const deleteLogin = /* GraphQL */ `
  mutation DeleteLogin(
    $input: DeleteLoginInput!
    $condition: ModelLoginConditionInput
  ) {
    deleteLogin(input: $input, condition: $condition) {
      id
      userName
      loginTime
      createdAt
      updatedAt
    }
  }
`;
