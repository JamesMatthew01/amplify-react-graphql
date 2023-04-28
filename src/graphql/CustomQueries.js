
export const listPostsWithLikes = /* GraphQL */ `
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
      nextToken
    }
  }
`;