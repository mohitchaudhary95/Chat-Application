const ws = require("ws");
const jwt = require("jsonwebtoken");
const Message = require("./models/messageModel");
const { User } = require("./models/userModel");

const createWebSocketServer = (server) => {
  const wss = new ws.WebSocketServer({ server });

  wss.on("connection", (connection, req) => {
    const notifyAboutOnlinePeople = async () => {
      const onlineClients = Array.from(wss.clients);
      
      const authenticatedClients = onlineClients.filter(client => client.userId);

      const onlineUsers = await Promise.all(
        authenticatedClients.map(async (client) => {
          const { userId, username } = client;
          const user = await User.findById(userId);
          const avatarLink = user ? user.avatarLink : null;
          return { userId, username, avatarLink };
        })
      );
      
      onlineClients.forEach((client) => {
        client.send(
          JSON.stringify({
            online: onlineUsers,
          })
        );
      });
    };

    connection.isAlive = true;
    connection.timer = setInterval(() => {
      connection.ping();
      connection.deathTimer = setTimeout(() => {
        connection.isAlive = false;
        clearInterval(connection.timer);
        connection.terminate();
        notifyAboutOnlinePeople(); 
        console.log("Terminated a dead connection.");
      }, 1000);
    }, 5000);

    connection.on("pong", () => {
      clearTimeout(connection.deathTimer);
    });

    const cookies = req.headers.cookie;
    if (cookies) {
      const tokenString = cookies
        .split(";")
        .find((str) => str.trim().startsWith("authToken="));

      if (tokenString) {
        const token = tokenString.split("=")[1];
        jwt.verify(token, process.env.JWTPRIVATEKEY, {}, (err, userData) => {
          if (err) {
            console.error("JWT verification error:", err);
            return; 
          }
          if (userData) {
            const { _id, firstName, lastName } = userData;
            connection.userId = _id;
            connection.username = `${firstName} ${lastName}`;
          }
        });
      }
    }

    connection.on("message", async (message) => {
      const messageData = JSON.parse(message.toString());
      const { recipient, text } = messageData;

      if (recipient && text && connection.userId) {
        const msgDoc = await Message.create({
          sender: connection.userId,
          recipient,
          text,
        });

        [...wss.clients]
          .filter((c) => c.userId === recipient)
          .forEach((client) => {
            client.send(
              JSON.stringify({
                _id: msgDoc._id,
                sender: connection.userId,
                recipient,
                text,
              })
            );
          });
      }
    });

    notifyAboutOnlinePeople();
  });
};

module.exports = createWebSocketServer;