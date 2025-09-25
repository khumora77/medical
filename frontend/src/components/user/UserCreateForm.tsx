import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button, message, Space } from 'antd';
import { useUserStore } from '../../store/userStore';
import type { CreateUserDto } from '../../types/user';


const { Option } = Select;

interface UserCreateFormProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

export const UserCreateForm: React.FC<UserCreateFormProps> = ({
  visible,
  onCancel,
  onSuccess
}) => {
  const [form] = Form.useForm();
  const { createUser, loading } = useUserStore();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: CreateUserDto) => {
    setSubmitting(true);
    try {
      const success = await createUser(values);
      if (success) {
        message.success('User muvaffaqiyatli yaratildi');
        form.resetFields();
        onSuccess();
      }
    } catch (error) {
      // Error storeda handle qilinadi
    } finally {
      setSubmitting(false);
    }
  };

  const generateTemporaryPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    form.setFieldValue('temporaryPassword', password);
  };

  return (
    <Modal
      title="Yangi User Yaratish"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ role: 'user' }}
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Email kiritishingiz shart' },
            { type: 'email', message: 'To\'g\'ri email formatini kiriting' }
          ]}
        >
          <Input placeholder="user@example.com" />
        </Form.Item>

        <Form.Item
          name="firstName"
          label="Ism"
          rules={[{ required: true, message: 'Ism kiritishingiz shart' }]}
        >
          <Input placeholder="Foydalanuvchi ismi" />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Familiya"
          rules={[{ required: true, message: 'Familiya kiritishingiz shart' }]}
        >
          <Input placeholder="Foydalanuvchi familiyasi" />
        </Form.Item>

        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: 'Roleni tanlash shart' }]}
        >
          <Select placeholder="Roleni tanlang">
            <Option value="admin">Admin</Option>
            <Option value="doctor">Doctor</Option>
            <Option value="reception">Reception</Option>
            <Option value="user">User</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="temporaryPassword"
          label="Vaqtincha Parol"
          rules={[{ required: true, message: 'Parol kiritishingiz shart' }]}
        >
          <Space.Compact style={{ width: '100%' }}>
            <Input.Password placeholder="Vaqtincha parol" />
            <Button type="default" onClick={generateTemporaryPassword}>
              Avto Generate
            </Button>
          </Space.Compact>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={submitting || loading}
            >
              Yaratish
            </Button>
            <Button onClick={onCancel}>Bekor qilish</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};