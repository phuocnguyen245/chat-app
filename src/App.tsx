import 'antd/dist/antd.css';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { StreamChat } from 'stream-chat';
import { Channel, ChannelList, Chat, LoadingIndicator, Thread } from 'stream-chat-react';
import 'stream-chat-react/dist/css/index.css';
import ChannelBody from './container/ChannelBody';
import User from './container/ChannelBody/User';
import './container/style/index.scss';
import { useParams } from 'react-router-dom';
const user1 = {
  id: 'Tai_khoan_1',
  name: 'Tai_khoan_1',
  image: 'https://i.pinimg.com/originals/3a/69/ae/3a69ae3942d4a9da6c3cbc93b1c8f051.jpg',
};
const user2 = {
  id: 'Tai_khoan_2',
  name: 'Tai_khoan_2',
  image:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpZfuhXmuOc9vS75-O4NRPFQkPBRa3KO_mHkbU9YVdBZ4L7OjScSg65mu4wV_kc-eWsyo&usqp=CAU',
};
const user3 = {
  id: 'Tai_khoan_3',
  name: 'Tai_khoan_3',
  image:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHzUOzCRx-S6dg4fFyy5Klc2BaDzIrkVCCT-hB9K3ioA7ryAQQuzWRr-pGGOaFx-ZlaY&usqp=CAU',
};
const user4 = {
  id: 'Tai_khoan_4',
  name: 'Tai_khoan_4',
  image:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWZMmzyGuLzccZ1qrPQ6Cytvmz7t9EvIqEG8pw22bMLqc210KqLX_ERisRO8VAUhuNz1A&usqp=CAU',
};

export const users = [user1, user2, user3, user4];

const sort: any = { last_message_at: -1 };
const App = () => {
  const { id } = useParams();

  const [chatClient, setChatClient] = useState<any>(null);
  const [channel, setChannel] = useState<any>(null);
  const [filters, setFilters] = useState<any>();
  const [isAddChannel, setIsAddChannel] = useState<boolean>(false);

  useEffect(() => {
    const initChat = async () => {
      const client = StreamChat.getInstance('pz8nsv3b98d6');
      const user = id === '1' ? user1 : id === '2' ? user2 : id === '3' ? user3 : user4;
      const filterChat = {
        members: { $in: [user.id] },
      };

      await client.connectUser(user, client.devToken(user.id));
      const channel = client.channel('messaging', 'general1', {
        image: 'https://i.pinimg.com/736x/0e/25/e9/0e25e977ec41237a19edd736a3340bef.jpg',
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
  }, [id, chatClient]);

  if (!chatClient || !channel) {
    return <LoadingIndicator />;
  }

  const CustomListContainer = (props: any) => {
    return <div style={{ width: '500px' }}>{props.children}</div>;
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
      setActiveChannel(channel);
      setChannel(channel);
      channel.watch();
    };
    const userKey = Object.keys(channel.state.members).filter((user) => user !== channel._client.userID);

    return (
      <div className={'channel-list'} onClick={() => handleClick(channel)}>
        <div className="channel">
          <div className="channel__image">
            <img
              src={
                Object.keys(channel.state.members).length <= 2
                  ? channel.state.members[userKey[0]].user.image
                  : channel?.data.image
              }
              alt="avatar"
            />
          </div>
          <div className="channel__detail">
            <p className="channel__detail__name">
              {Object.keys(channel.state.members).length <= 2
                ? channel.state.members[userKey[0]].user.name
                : channel?.data.name}
            </p>
            <p className="channel__detail__text">{renderMessageText()}</p>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div>
      <Outlet />
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
          <Channel channel={channel}>
            <ChannelBody channel={channel} />
          </Channel>
        </div>
        <Thread />
      </Chat>
    </div>
  );
};

export default App;
