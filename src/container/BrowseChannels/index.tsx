import React, { useEffect, useState, useMemo } from 'react';
import { useChatContext } from 'stream-chat-react';
import ChannelItem from './ChannelItem';

const sort: any = { last_message_at: -1 };

const BrowseChannels = ({ onClose, onSetChannel }: any) => {
  const { client, setActiveChannel }: any = useChatContext();

  const [channels, setChannels] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const filter = useMemo(() => {
    return { type: 'messaging', members: { $in: [client.user.id] } };
  }, [client]);

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
  }, [client, filter]);

  const joinChannel = async (id: any) => {
    const findChannel = channels.find((c: any) => c.id === id);
    if (!findChannel) {
      onClose();
    } else {
      findChannel.addMembers([client.user.id]);
      findChannel.watch();
      onSetChannel(findChannel);
      setActiveChannel(findChannel);
      onClose();
    }
  };
  return (
    <div>
      {loading ? (
        <div>Loading channels</div>
      ) : (
        <ul>
          {channels?.map((c: any) => {
            return <ChannelItem key={c.cid} onJoin={joinChannel} channel={c} />;
          })}
        </ul>
      )}
    </div>
  );
};

export default BrowseChannels;
