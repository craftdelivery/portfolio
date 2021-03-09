import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          Login: {
            screens: {
              LoginScreen: 'one',
            }
          },
          Locations: {
            screens: {
              LocationsScreen: 'two',
            },
          },
          Info: {
            screens: {
              InfoScreen: 'three',
            },
          },
        },
      },
      NotFound: '*',
    },
  },
};
