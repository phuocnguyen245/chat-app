import React, { useEffect, useState } from 'react';
import { useChatContext } from 'stream-chat-react';
import ChannelItem from './ChannelItem';

const filter = {
  type: 'messaging',
  members: { $in: ['nguyen1'] },
};
const sort: any = { last_message_at: -1 };

const BrowseChannels = ({ onClose }: any) => {
  const { client, setActiveChannel }: any = useChatContext();

  const [channels, setChannels] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetch = async () => {
      if (client) {
        const response: any = await client?.queryChannels(filter, sort, {
          watch: true,
          state: true,
        });

        const filterChannels: any = response.filter((c: any) => c.type === 'messaging');

        setChannels(filterChannels);
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const joinChannel = async (id: any) => {
    const filterChannel = channels.find((c: any) => c.id === id);
    const channel = client.channel('messaging', filterChannel.id);
    await channel.watch();
    onClose();
  };

  return (
    <div>
      {loading ? (
        <div>Loading channels</div>
      ) : (
        <ul>
          {channels?.map((c: any) => {
            return <ChannelItem key={c.cid} onJoin={(id: any) => joinChannel(id)} channel={c} />;
          })}
        </ul>
      )}
    </div>
  );
};

export default BrowseChannels;
