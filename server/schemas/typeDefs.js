const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    password: String
    savedBooks: [Book]
  }

  type Book {
    bookId: String!
    authors: [String]!
    description: String
    title: String
    image: String
    link: String
  }

  input saveBookInput {
    bookId: String!
    authors: [String]!
    description: String
    title: String
    image: String
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
    users: [User]!
    user(userId: ID!): User
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(input: saveBookInput!): User
    removeUser(userId: ID!): User
    removeBook(userId: ID!, book: String!): User
  }
`;

module.exports = typeDefs;
