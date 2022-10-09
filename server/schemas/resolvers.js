const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    users: async () => {
      return User.find();
    },

    user: async (parent, { userId }) => {
      return User.findOne({ _id: userId });
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if(!user) {
          throw new AuthenticationError('No user found with this email address!')
      }
      const correctPw = await user.isCorrectPassword(password);
      if(!correctPw) {
          throw new AuthenticationError('Incorrect credentials!');
      }
      const token = signToken(user);
      return { token, user };
  },

    saveBook: async (parent, { user, body }) => {
      return User.findOneAndUpdate(
        { _id: user._id },
        {
          $addToSet: { savedBooks: body },
        },
        { new: true, runValidators: true }
      );
    },
    removeUser: async (parent, { userId }) => {
      return User.findOneAndDelete({ _id: userId });
    },
    removeBook: async (parent, { book }, context) => {
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: book } },
          { new: true }
        );
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

module.exports = resolvers;
