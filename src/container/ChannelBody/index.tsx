import React from 'react';
import { ChannelHeader, MessageList, MessageInput } from 'stream-chat-react';
import styled from 'styled-components';
const ChannelBody = () => {
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
  height: 100vh;
  max-height: 100vh;
  .str-chat-header-livestream {
    width: 100%;
    height: 70px;
  }

  .str-chat__lisst {
    height: calc(100vh - 70px);
  }

  .str-chat__input-flat-wrapper {
    position: relative;
    bottom: 20px;
    width: 100%;
  }
`;
