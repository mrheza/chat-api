# Description

Chat api using rabbitmq. This api use competing consumer pattern.

# Requirements

Node Js >= 8 or <= 12

# Installation

``` bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# launch server at localhost:3000
$ npm start
```

# REST API

endpoint for send message
```
localhost:3000/send-message
```

endpoint for get all message, included all previously message
```
localhost:3000/get-message-all
```

# How To Test?

Import ```chat-api.postman_collection.json``` to postman

# How To Test Realtime API?

1\. Open new console and open app directory

2\. Run the following command:

```
node test/index.js
```

3\. Hit endpoint ```localhost:3000/send-message```. Then the message will appear in console.
