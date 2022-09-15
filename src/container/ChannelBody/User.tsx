import { Button } from 'antd';
import React from 'react';
import { useChatContext } from 'stream-chat-react';

const sort: any = { last_message_at: -1 };

const User = ({ channel, onSetChannel, onClose, chatClient }: any) => {
  const { client, setActiveChannel }: any = useChatContext();

  const onCreateChat = async (values: { id: string; name: string; image: string; desc: string }) => {
    try {
      if (client) {
        const id: string = `${client.user.id.replace(/\s/g, '-').toLowerCase()}-${values.id
          .replace(/\s/g, '-')
          .toLowerCase()}`;
        const channel = await client.channel('messaging', id, {
          name: values.name,
          image: values.image,
          members: [client.user.id, values.id],
        });
        await channel.create();
        channel.addMembers([values.id]);
        channel.addMembers([client.user.id]);
        setActiveChannel(channel);
        onSetChannel(channel);
        channel.watch();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <ul>
      <li>
        User 1
        <Button onClick={() => onCreateChat({ id: 'TEST_1', name: 'TEST_1', image: '', desc: 'TEST_1' })}>
          Chat with 1
        </Button>
      </li>
      <li>
        User 2
        <Button onClick={() => onCreateChat({ id: 'TEST_2', name: 'TEST_2', image: '', desc: 'TEST_2' })}>
          Chat with 2
        </Button>
      </li>
      <li>
        User 3
        <Button onClick={() => onCreateChat({ id: 'TEST_3', name: 'TEST_3', image: '', desc: 'TEST_3' })}>
          Chat with 3
        </Button>
      </li>
    </ul>
  );
};

export default User;
