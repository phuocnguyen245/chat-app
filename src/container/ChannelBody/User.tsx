import { Button } from 'antd';
import React from 'react';
import { useChatContext } from 'stream-chat-react';

const sort: any = { last_message_at: -1 };

const User = ({ channel, onSetChannel, onClose, chatClient }: any) => {
  const { client, setActiveChannel }: any = useChatContext();

  const onCreateChat = async (values: { id: string; name: string; image: string; desc: string }) => {
    try {
      if (client) {
        console.log(values.name);
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
    <ul className="user-list">
      <li className="user">
        <div className="user__img">
          <img src="https://i.pinimg.com/originals/3a/69/ae/3a69ae3942d4a9da6c3cbc93b1c8f051.jpg" alt="avatar" />
        </div>
        <div>
          <p className="user__name">User 11</p>
          <Button
            onClick={() =>
              onCreateChat({
                id: 'USER_TEST_11',
                name: 'USER_TEST_11',
                image: 'https://i.pinimg.com/originals/3a/69/ae/3a69ae3942d4a9da6c3cbc93b1c8f051.jpg',
                desc: 'USER_TEST_11',
              })
            }
          >
            Chat with 11
          </Button>
        </div>
      </li>
      <li>
        <div className="user__img">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpZfuhXmuOc9vS75-O4NRPFQkPBRa3KO_mHkbU9YVdBZ4L7OjScSg65mu4wV_kc-eWsyo&usqp=CAU"
            alt="avatar"
          />
        </div>
        <div>
          <p className="user__name">User 22</p>
          <Button
            onClick={() =>
              onCreateChat({
                id: 'USER_TEST_22',
                name: 'USER_TEST_22',
                image:
                  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpZfuhXmuOc9vS75-O4NRPFQkPBRa3KO_mHkbU9YVdBZ4L7OjScSg65mu4wV_kc-eWsyo&usqp=CAU',
                desc: 'USER_TEST_2',
              })
            }
          >
            Chat with 22
          </Button>
        </div>
      </li>
      <li>
        <div className="user__img">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHzUOzCRx-S6dg4fFyy5Klc2BaDzIrkVCCT-hB9K3ioA7ryAQQuzWRr-pGGOaFx-ZlaY&usqp=CAU"
            alt="avatar"
          />
        </div>
        <div>
          <p className="user__name">User 33</p>
          <Button
            onClick={() =>
              onCreateChat({
                id: 'USER_TEST_33',
                name: 'USER_TEST_33',
                image:
                  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHzUOzCRx-S6dg4fFyy5Klc2BaDzIrkVCCT-hB9K3ioA7ryAQQuzWRr-pGGOaFx-ZlaY&usqp=CAU',
                desc: 'USER_TEST_33',
              })
            }
          >
            Chat with 33
          </Button>
        </div>
      </li>
      <li>
        <div className="user__img">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWZMmzyGuLzccZ1qrPQ6Cytvmz7t9EvIqEG8pw22bMLqc210KqLX_ERisRO8VAUhuNz1A&usqp=CAU"
            alt="avatar"
          />
        </div>
        <div>
          <p className="user__name">User 44</p>
          <Button
            onClick={() =>
              onCreateChat({
                id: 'USER_TEST_44',
                name: 'USER_TEST_44',
                image:
                  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWZMmzyGuLzccZ1qrPQ6Cytvmz7t9EvIqEG8pw22bMLqc210KqLX_ERisRO8VAUhuNz1A&usqp=CAU',
                desc: 'USER_TEST_44',
              })
            }
          >
            Chat with 4
          </Button>
        </div>
      </li>
    </ul>
  );
};

export default User;
