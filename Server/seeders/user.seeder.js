import { ChatModel } from "../models/chat.models.js";
import { MessageModel } from "../models/message.models.js";
import {UserModel} from "../models/user.models.js";
import {faker, simpleFaker} from "@faker-js/faker";
const createUser=async (numUser)=>{
    try {
        const userPromise=[];
        for(let i =0 ;i<numUser;i++){
            const tempUser=UserModel.create({
                name:faker.person.fullName(),
                username:faker.internet.userName(),
                email: faker.internet.email(),
                bio:faker.lorem.sentence(10),
                password:"password",
                avatar:{
                    url:faker.image.url(),
                    public_id:faker.system.fileName()
                }
            })
            userPromise.push(tempUser);
        }
        await Promise.all(userPromise);
        console.log("user created",numUser);
        process.exit(1);

    } catch (error) {
        console.log(error);
        console.log("error in seeder");
        process.exit(1)
    }
}

const createSingleChats = async (numChats) => {
    try {
      const users = await UserModel.find().select("_id");
  
      const chatsPromise = [];
  
      for (let i = 0; i < users.length; i++) {
        for (let j = i + 1; j < users.length; j++) {
          chatsPromise.push(
            ChatModel.create({
              name: faker.lorem.words(2),
              members: [users[i], users[j]],
            })
          );
        }
      }
  
      await Promise.all(chatsPromise);
  
      console.log("Chats created successfully");
      process.exit();
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  };

  
  const createGroupChats = async (numChats) => {
    try {
      const users = await UserModel.find().select("_id");
  
      const chatsPromise = [];
  
      for (let i = 0; i < numChats; i++) {
        const numMembers = simpleFaker.number.int({ min: 3, max: users.length });
        const members = [];
  
        for (let i = 0; i < numMembers; i++) {
          const randomIndex = Math.floor(Math.random() * users.length);
          const randomUser = users[randomIndex];
  
          // Ensure the same user is not added twice
          if (!members.includes(randomUser)) {
            members.push(randomUser);
          }
        }
  
        const chat = ChatModel.create({
          groupChat: true,
          name: faker.lorem.words(1),
          members,
          creator: members[0],
        });
  
        chatsPromise.push(chat);
      }
  
      await Promise.all(chatsPromise);
  
      console.log("Chats created successfully");
      process.exit();
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  };

  const createMessages = async (numMessages) => {
    try {
      const users = await UserModel.find().select("_id");
      const chats = await ChatModel.find().select("_id");
  
      const messagesPromise = [];
  
      for (let i = 0; i < numMessages; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomChat = chats[Math.floor(Math.random() * chats.length)];
  
        messagesPromise.push(
          MessageModel.create({
            chat: randomChat,
            sender: randomUser,
            content: faker.lorem.sentence(),
          })
        );
      }
  
      await Promise.all(messagesPromise);
  
      console.log("Messages created successfully");
      process.exit();
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  };

  const createMessagesInAChat = async (chatId, numMessages) => {
    try {
      const users = await UserModel.find().select("_id");
  
      const messagesPromise = [];
  
      for (let i = 0; i < numMessages; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
  
        messagesPromise.push(
          MessageModel.create({
            chat: chatId,
            sender: randomUser,
            content: faker.lorem.sentence(),
          })
        );
      }
  
      await Promise.all(messagesPromise);
  
      console.log("Messages created successfully");
      process.exit();
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  };
  
export {createUser,
        createSingleChats,
        createGroupChats,
        createMessages,
        createMessagesInAChat
};