/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateNote = /* GraphQL */ `
  subscription OnCreateNote(
    $filter: ModelSubscriptionNoteFilterInput
    $owner: String
  ) {
    onCreateNote(filter: $filter, owner: $owner) {
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
export const onUpdateNote = /* GraphQL */ `
  subscription OnUpdateNote(
    $filter: ModelSubscriptionNoteFilterInput
    $owner: String
  ) {
    onUpdateNote(filter: $filter, owner: $owner) {
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
export const onDeleteNote = /* GraphQL */ `
  subscription OnDeleteNote(
    $filter: ModelSubscriptionNoteFilterInput
    $owner: String
  ) {
    onDeleteNote(filter: $filter, owner: $owner) {
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
export const onCreatePost = /* GraphQL */ `
  subscription OnCreatePost($filter: ModelSubscriptionPostFilterInput) {
    onCreatePost(filter: $filter) {
      id
      name
      description
      image
      likes {
        items {
          id
          content
          createdAt
          updatedAt
          postLikesId
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdatePost = /* GraphQL */ `
  subscription OnUpdatePost($filter: ModelSubscriptionPostFilterInput) {
    onUpdatePost(filter: $filter) {
      id
      name
      description
      image
      likes {
        items {
          id
          content
          createdAt
          updatedAt
          postLikesId
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeletePost = /* GraphQL */ `
  subscription OnDeletePost($filter: ModelSubscriptionPostFilterInput) {
    onDeletePost(filter: $filter) {
      id
      name
      description
      image
      likes {
        items {
          id
          content
          createdAt
          updatedAt
          postLikesId
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreateLike = /* GraphQL */ `
  subscription OnCreateLike($filter: ModelSubscriptionLikeFilterInput) {
    onCreateLike(filter: $filter) {
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
      createdAt
      updatedAt
      postLikesId
    }
  }
`;
export const onUpdateLike = /* GraphQL */ `
  subscription OnUpdateLike($filter: ModelSubscriptionLikeFilterInput) {
    onUpdateLike(filter: $filter) {
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
      createdAt
      updatedAt
      postLikesId
    }
  }
`;
export const onDeleteLike = /* GraphQL */ `
  subscription OnDeleteLike($filter: ModelSubscriptionLikeFilterInput) {
    onDeleteLike(filter: $filter) {
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
      createdAt
      updatedAt
      postLikesId
    }
  }
`;
