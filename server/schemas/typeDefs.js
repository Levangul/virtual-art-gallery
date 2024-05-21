const typeDefs = `#graphql
  type User {
    _id: ID
    username: String
    email: String
    password: String
    artCount: Int
    savedArt: [Art]
  }

  type Art {
    id: ID!
    title: String!
    artist_titles: String
    description: String!
    image_id: String!
  }

  type Order {
  _id: ID!
  purchaseDate: String
  products: [Artwork]!
}

  type Auth {
    token: ID!
    user: User
  }

  input ArtInput {
    id: ID!
    title: String!
    artist_titles: String
    description: String!
    imageUrl: String!
  type CheckoutResponse {
    sessionId: String!
  }

  type Query {
    users: [User]    # Define the 'users' field to query users
    user(username: String!): User
    saveArt(artData: ArtInput!): User
    me: User
  }

  type Mutation {
  addUser(username: String!, email: String!, password: String!): Auth
  login(email: String!, password: String!): Auth
  removeArt(artId: ID!): User
  saveArt(artData: ArtInput!): User # This is the saveArt mutation definition
}
    artwork: [Artwork]!
    artworkById(id: ID!): Artwork
    getOrderById(id: ID!): Order
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    deleteArtwork(id: ID!): Artwork
    checkout(products: [ID]!): CheckoutResponse
  }
`;

`;
module.exports = typeDefs;