import { Button, Form, Input } from 'antd';
import React from 'react';
import { useChatContext } from 'stream-chat-react';

const CreateChannel = ({ onClose, onSetChannel }: any) => {
  const [form] = Form.useForm();
  const { client, setActiveChannel }: any = useChatContext();

  const onFinish = async (values: { name: string; image: string; desc: string }) => {
    try {
      const id: string = values.name.replace(/\s/g, '-').toLowerCase();
      const channel = await client.channel('messaging', id, {
        name: values.name,
        image: values.image,
      });
      await channel.create();
      channel.addMembers([client.user.id]);
      setActiveChannel(channel);
      onSetChannel(channel);
      channel.watch();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form name="basic" onFinish={onFinish} autoComplete="off" form={form}>
      <Form.Item label="Channel name" name="name" rules={[{ required: true, message: 'Please input your username!' }]}>
        <Input />
      </Form.Item>

      <Form.Item label="Image" name="image">
        <Input />
      </Form.Item>

      <Form.Item label="Description" name="desc" rules={[{ required: true, message: 'Please input your password!' }]}>
        <Input />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create Channel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateChannel;
