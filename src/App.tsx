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

const user1 = {
  id: 'TEST_1',
  name: 'TEST1',
  image: 'https://getstream.io/random_png/?id=bitter-wave-0&name=bitter-wave-0',
};
const user2 = {
  id: 'TEST_2',
  name: 'TEST2',
  image: 'https://getstream.io/random_png/?id=bitter-wave-0&name=bitter-wave-0',
};
const user3 = {
  id: 'TEST_3',
  name: 'TEST3',
  image: 'https://getstream.io/random_png/?id=bitter-wave-0&name=bitter-wave-0',
};

const users = [user2, user1];

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
      <div style={{ width: '200px' }}>
        <div style={{ width: '200px' }}>
          Channels <Button onClick={() => setIsAddChannel(true)}>+</Button>
        </div>
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
      console.log(value);

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
    return (
      <div
        style={{ background: 'red' }}
        className={selected ? 'channel-preview__container selected' : 'channel-preview__container'}
        onClick={() => handleClick(channel)}
      >
        <div className="channel-preview__content-wrapper">
          <div className="channel-preview__content-top">
            <p className="channel-preview__content-name">{channel?.data?.name || 'Channel'}</p>
            <p className="channel-preview__content-name">{channel?.data?.subtitle}</p>
          </div>
          <p className="channel-preview__content-message">{renderMessageText()}</p>
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
        <div style={{ display: 'flex', width: '100%' }}>
          <ChannelList
            List={CustomListContainer}
            Preview={CustomPreview}
            filters={filters}
            sort={sort}
            onMessageNew={customOnMessageNew}
          />
          <div style={{ width: '25%' }}>
            <BrowseChannels onClose={() => setIsAddChannel(false)} onSetChannel={setChannel} />
          </div>
          <Channel channel={channel}>
            {isAddChannel ? (
              <AddingChannel onClose={() => setIsAddChannel(false)} onSetChannel={setChannel} />
            ) : (
              <ChannelBody />
            )}
          </Channel>
        </div>
        <Thread />
      </Chat>
    </div>
  );
};

export default App;
