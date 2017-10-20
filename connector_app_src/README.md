# Connector app

the app was developed to facilitate p5.js workshop, it does a couple of things:

- IT served files from a 'connector' folder in your home directory.
- It creates a bridge between websockets and osc (useful to connect to other programs or Arduino)
- It looks for Arduino boards connected to the same network advertizing their name (look in the arduino folder for an example)

first install all the dependencies with npm instal

- to run it:

```
electron-forge start
```

- to package it:

```
electron-forge make
```


TODO:
- would be nice to have a log of messages or some indication that messages are coming in and out
