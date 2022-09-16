import React, { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Channel, ChannelList, Chat, LoadingIndicator, Thread, useChatContext } from 'stream-chat-react';
import { Button } from 'antd';
import 'stream-chat-react/dist/css/index.css';
import AddingChannel from './container/BrowseChannels/AddingChannel';
import ChannelBody from './container/ChannelBody';
import 'antd/dist/antd.css';
import User from './container/ChannelBody/User';
import BrowseChannels from './container/BrowseChannels';
import './container/style/index.scss';
const user1 = {
  id: 'USER_TEST_11',
  name: 'USER_TEST_11',
  image: 'https://i.pinimg.com/originals/3a/69/ae/3a69ae3942d4a9da6c3cbc93b1c8f051.jpg',
};
const user2 = {
  id: 'USER_TEST_22',
  name: 'USER_TEST_22',
  image:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpZfuhXmuOc9vS75-O4NRPFQkPBRa3KO_mHkbU9YVdBZ4L7OjScSg65mu4wV_kc-eWsyo&usqp=CAU',
};
const user3 = {
  id: 'USER_TEST_33',
  name: 'USER_TEST_33',
  image:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHzUOzCRx-S6dg4fFyy5Klc2BaDzIrkVCCT-hB9K3ioA7ryAQQuzWRr-pGGOaFx-ZlaY&usqp=CAU',
};
const user4 = {
  id: 'USER_TEST_44',
  name: 'USER_TEST_44',
  image:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWZMmzyGuLzccZ1qrPQ6Cytvmz7t9EvIqEG8pw22bMLqc210KqLX_ERisRO8VAUhuNz1A&usqp=CAU',
};

const users = [user1, user2];

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
        members: { $in: [user.id] },
      };

      await client.connectUser(user, client.devToken(user.id));
      const channel = client.channel('messaging', 'general1', {
        image: 'https://goo.gl/Zefkbx',
        name: 'General1',
      });
      await channel.watch();
      await channel.create();
      channel.addMembers([user.id]);
      setChannel(channel);
      setChatClient(client);
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
      <div style={{ width: '500px' }}>
        {/* <div style={{ width: '500px' }}>
          Channels <Button onClick={() => setIsAddChannel(true)}>+</Button>
        </div> */}
        {props.children}
      </div>
    );
  };
  const customOnMessageNew = async ({ setChannels, event }: any) => {
    const eventChannel = event.channel;

    // If the channel isn't frozen, then don't add it to the list.
    if (!eventChannel?.id || !eventChannel.frozen) return;

    try {
      const newChannel = chatClient.channel(eventChannel.type, eventChannel.id);
      await newChannel.watch();
      setChannels((channels: any) => [newChannel, ...channels]);
    } catch (error) {
      console.log(error);
    }
  };

  const CustomPreview = (props: any) => {
    const { channel, setActiveChannel }: any = props;
    const { channel: activeChannel } = useChatContext();
    const selected = channel?.id === activeChannel?.id;
    const renderMessageText = () => {
      const lastMessageText = channel?.state?.messages[channel.state.messages.length - 1]?.text;
      const text = lastMessageText || 'message text';
      return text.length < 60 ? lastMessageText : `${text.slice(0, 70)}...`;
    };
    if (!channel.state.messages.length) return null;
    const handleClick = async (value: any) => {
      const channel = await chatClient.channel('messaging', value.id, {
        name: value?.data?.name,
        image: value.data?.image,
      });
      await channel.create();
      // channel.addMembers([value.id]);
      // channel.addMembers([chatClient.user.id]);
      setActiveChannel(channel);
      setChannel(channel);
      channel.watch();
    };
    console.log(channel);

    return (
      <div className={'channel-list'} onClick={() => handleClick(channel)}>
        <div className="channel">
          <div className="channel__image">
            <img
              src={
                'https://images.unsplash.com/photo-1517976547714-720226b864c1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3000&q=80'
              }
              alt="avatar"
            />
          </div>
          <div className="channel__detail">
            <p className="channel__detail__name">{channel?.data?.name || 'Channel'}</p>
            <p className="channel__detail__text">{renderMessageText()}</p>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div>
      <Chat client={chatClient} theme="messaging light">
        <User
          channel={channel}
          chatClient={chatClient}
          onSetChannel={setChannel}
          onClose={() => setIsAddChannel(false)}
        />
        <div>
          <ChannelList
            List={CustomListContainer}
            Preview={CustomPreview}
            filters={filters}
            sort={sort}
            onMessageNew={customOnMessageNew}
          />
          {/* <div>
            <BrowseChannels onClose={() => setIsAddChannel(false)} onSetChannel={setChannel} />
          </div> */}
          <Channel channel={channel}>
            {/* {isAddChannel ? (
              <AddingChannel onClose={() => setIsAddChannel(false)} onSetChannel={setChannel} />
            ) : ( */}
            <ChannelBody />
            {/* )} */}
          </Channel>
        </div>
        <Thread />
      </Chat>
    </div>
  );
};

export default App;
