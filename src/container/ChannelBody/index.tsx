import React from 'react';
import { ChannelHeader, MessageList, MessageInput } from 'stream-chat-react';
import styled from 'styled-components';
const ChannelBody = ({ channel }: any) => {
  return (
    <Container>
      <ChannelHeader />
      <MessageList />
      <MessageInput />
    </Container>
  );
};

export default ChannelBody;
const Container = styled.div`
  width: 100%;
  margin-top: 12px;
  .str-chat__list {
    height: calc(100vh - 300px);
  }
`;
