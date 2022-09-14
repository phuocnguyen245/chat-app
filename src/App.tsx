import React, { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Channel, ChannelList, Chat, LoadingIndicator, Thread } from 'stream-chat-react';
import { Button } from 'antd';
import 'stream-chat-react/dist/css/index.css';
import AddingChannel from './container/BrowseChannels/AddingChannel';
import ChannelBody from './container/ChannelBody';
import 'antd/dist/antd.css';
const user1 = {
  id: 'nguyen1',
  name: 'nguyen1',
  image: 'https://getstream.io/random_png/?id=bitter-wave-0&name=bitter-wave-0',
};
const user2 = {
  id: 'nguyen2',
  name: 'nguyen2',
  image: 'https://getstream.io/random_png/?id=bitter-wave-0&name=bitter-wave-0',
};
const user3 = {
  id: 'nguyen3',
  name: 'nguyen3',
  image: 'https://getstream.io/random_png/?id=bitter-wave-0&name=bitter-wave-0',
};

const users = [user1];

const randomUser = () => {
  const randomIndex = Math.floor(Math.random() * users.length);
  return users[randomIndex];
};

const sort: any = { last_message_at: -1 };
const App = () => {
  const [chatClient, setChatClient] = useState<any>(null);
  const [channel, setChannel] = useState<any>(null);
  const [filters, setFilters] = useState<any>();
  const [isAddChannel, setIsAddChannel] = useState<boolean>(false);

  useEffect(() => {
    const initChat = async () => {
      const client = StreamChat.getInstance('qhk6w6rhkxpt');
      const user = randomUser();
      const filterChat = {
        type: 'messaging',
        members: { $in: [user.id] },
      };
      await client.connectUser(user, client.devToken(user.id));
      const channel = client.channel('messaging', 'general1', {
        image: 'https://goo.gl/Zefkbx',
        name: 'General1',
      });

      await channel.create();
      channel.addMembers([user.id]);

      setChatClient(client);
      setChannel(channel);
      setFilters(filterChat);
    };

    initChat();
    return () => {
      if (chatClient) chatClient.disconnectUser();
    };
  }, [chatClient]);

  if (!chatClient || !channel) {
    return <LoadingIndicator />;
  }

  const CustomListContainer = (props: any) => {
    return (
      <div style={{ width: '200px' }}>
        <div style={{ width: '200px' }}>
          Channels <Button onClick={() => setIsAddChannel(true)}>+</Button>
        </div>
        {props.children}
      </div>
    );
  };
  return (
    <Chat client={chatClient} theme="messaging light">
      <div>
        <ChannelList List={CustomListContainer} filters={filters} sort={sort} />
      </div>
      <Channel channel={channel}>
        {isAddChannel ? <AddingChannel onClose={() => setIsAddChannel(false)} /> : <ChannelBody />}
      </Channel>
      <Thread />
    </Chat>
  );
};

export default App;
