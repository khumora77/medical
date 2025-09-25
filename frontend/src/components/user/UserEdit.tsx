import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, Button, Space, message } from 'antd';
import type { User } from '../../types/user';
import { useUserStore } from '../../store/userStore';


const { Option } = Select;

interface UserEditModalProps {
  visible: boolean;
  user: User | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export const UserEditModal: React.FC<UserEditModalProps> = ({
  visible,
  user,
  onCancel,
  onSuccess
}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const { updateUserRole, updateUserStatus, loading } = useUserStore();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        role: user.role,
        status: user.status
      });
    }
  }, [user, form]);

  const handleSubmit = async (values: { role: string; status: string }) => {
    if (!user) return;
    
    setSubmitting(true);
    try {
      let success = true;
      
      // Role yangilash
      if (values.role !== user.role) {
        const roleSuccess = await updateUserRole(user.id, { role: values.role as any });
        success = success && roleSuccess;
      }
      
      // Status yangilash
      if (values.status !== user.status) {
        const statusSuccess = await updateUserStatus(user.id, { status: values.status as any });
        success = success && statusSuccess;
      }
      
      if (success) {
        message.success('User ma\'lumotlari yangilandi');
        onSuccess();
      }
    } catch (error) {
      // Error storeda handle qilinadi
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={`${user?.firstName} ${user?.lastName} ni tahrirlash`}
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item name="role" label="Role">
          <Select>
            <Option value="admin">Admin</Option>
            <Option value="doctor">Doctor</Option>
            <Option value="reception">Reception</Option>
            <Option value="user">User</Option>
          </Select>
        </Form.Item>

        <Form.Item name="status" label="Status">
          <Select>
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
            <Option value="banned">Banned</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={submitting || loading}
            >
              Saqlash
            </Button>
            <Button onClick={onCancel}>Bekor qilish</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};