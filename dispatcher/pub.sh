#!/bin/bash
# take param -i or -a

# todo remove or reset app.config.js

# choose simulator
expo build:ios --release-channel dev

#choose apk
expo build:android --release-channel dev

# take param -p
expo publish --release-channel dev