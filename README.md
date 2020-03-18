# Description

Chat api using rabbitmq. This api use competing consumer pattern.

# Requirements

Node Js >= 8 or <= 12.

# Installation

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:3000 for development
npm run dev

# launch server at localhost:3000
npm start
```

# REST API

Endpoint for send message.
```
localhost:3000/send-message
```

Endpoint for get all message, included all previously message.
```
localhost:3000/get-message-all
```

# How To Test?

1\. Import ```chat-api.postman_collection.json``` to postman.

2\. Open console and open app directory on the console.

3\. Run the following command:

```
npm start
```

# How To Test Realtime API?

1\. Open new console and open app directory on the console.

2\. Run the following command:

```
node test/index.js
```

3\. Hit endpoint ```localhost:3000/send-message```. Then the message will appear in console.
