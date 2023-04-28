/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getNote = /* GraphQL */ `
  query GetNote($id: ID!) {
    getNote(id: $id) {
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
export const listNotes = /* GraphQL */ `
  query ListNotes(
    $filter: ModelNoteFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listNotes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        image
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
export const getPost = /* GraphQL */ `
  query GetPost($id: ID!) {
    getPost(id: $id) {
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
export const listPosts = /* GraphQL */ `
  query ListPosts(
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getLike = /* GraphQL */ `
  query GetLike($id: ID!) {
    getLike(id: $id) {
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
export const listLikes = /* GraphQL */ `
  query ListLikes(
    $filter: ModelLikeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLikes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        content
        post {
          id
          name
          description
          image
          createdAt
          updatedAt
        }
        postID
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const likesByPostID = /* GraphQL */ `
  query LikesByPostID(
    $postID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelLikeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    likesByPostID(
      postID: $postID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        content
        post {
          id
          name
          description
          image
          createdAt
          updatedAt
        }
        postID
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getLogin = /* GraphQL */ `
  query GetLogin($id: ID!) {
    getLogin(id: $id) {
      id
      userName
      loginTime
      createdAt
      updatedAt
    }
  }
`;
export const listLogins = /* GraphQL */ `
  query ListLogins(
    $filter: ModelLoginFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLogins(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userName
        loginTime
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
