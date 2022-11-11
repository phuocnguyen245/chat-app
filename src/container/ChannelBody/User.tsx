import { Button } from 'antd';
import React from 'react';
import { useChatContext } from 'stream-chat-react';
import { users } from '../../App';

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
          desc: values.desc,
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
    <ul className="user-list">
      {users.map((user) => {
        return (
          <li className="user">
            <div className="user__img">
              <img src={user.image} alt="avatar" />
            </div>
            <div>
              <p className="user__name">{user.name}</p>
              <Button
                onClick={() =>
                  onCreateChat({
                    id: `${user.id}`,
                    name: `${user.name}`,
                    image: `${user.image}`,
                    desc: `${client.user.name}`,
                  })
                }
              >
                Chat
              </Button>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default User;
