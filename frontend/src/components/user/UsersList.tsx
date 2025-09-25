import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Select,
  Input,
  message,
  Tooltip,
  Alert
} from 'antd';
import { PlusOutlined, EditOutlined,  ReloadOutlined } from '@ant-design/icons';
import { UserCreateForm } from './UserCreateForm';
import { UserEditModal } from './UserEdit';
import { useUserStore } from '../../store/userStore';
import type { User } from '../../types/user';

const { Option } = Select;
const { Search } = Input;

export const UsersList: React.FC = () => {
  const {
    users,
    loading,
    error,
    pagination,
    filters,
    fetchUsers,
    setFilters
  } = useUserStore();

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const handleTableChange = (pagination: any) => {
    setFilters({
      page: pagination.current,
      limit: pagination.pageSize
    });
    fetchUsers({
      page: pagination.current,
      limit: pagination.pageSize,
      search: filters.search,
      role: filters.role,
      status: filters.status
    });
  };

  const handleSearch = (value: string) => {
    setFilters({ search: value, page: 1 });
    fetchUsers({ 
      ...filters, 
      search: value, 
      page: 1 
    });
  };

  const handleRoleFilter = (value: string) => {
    setFilters({ role: value, page: 1 });
    fetchUsers({ 
      ...filters, 
      role: value, 
      page: 1 
    });
  };

  const handleStatusFilter = (value: string) => {
    setFilters({ status: value, page: 1 });
    fetchUsers({ 
      ...filters, 
      status: value, 
      page: 1 
    });
  };

  const handleRefresh = () => {
    fetchUsers();
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditModalVisible(true);
  };

  const handleUpdateSuccess = () => {
    setEditModalVisible(false);
    setSelectedUser(null);
    fetchUsers();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'red';
      case 'doctor': return 'blue';
      case 'reception': return 'green';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'orange';
      case 'banned': return 'red';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Ism',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Familiya',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={getRoleColor(role)}>{role.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Yaratilgan',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Harakatlar',
      key: 'actions',
      render: (record: User) => (
        <Space>
          <Tooltip title="Tahrirlash">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Foydalanuvchilar Boshqaruvi"
      extra={
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={loading}
          >
            Yangilash
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            Yangi User
          </Button>
        </Space>
      }
    >
      {error && (
        <Alert
          message="Xatolik"
          description={error}
          type="error"
          showIcon
          closable
          style={{ marginBottom: 16 }}
        />
      )}

      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Email orqali qidirish..."
          onSearch={handleSearch}
          style={{ width: 250 }}
          defaultValue={filters.search}
        />
        <Select
          placeholder="Role bo'yicha filtrlash"
          style={{ width: 150 }}
          onChange={handleRoleFilter}
          value={filters.role}
          allowClear
        >
          <Option value="admin">Admin</Option>
          <Option value="doctor">Doctor</Option>
          <Option value="reception">Reception</Option>
          <Option value="user">User</Option>
        </Select>
        <Select
          placeholder="Status bo'yicha filtrlash"
          style={{ width: 150 }}
          onChange={handleStatusFilter}
          value={filters.status}
          allowClear
        >
          <Option value="active">Active</Option>
          <Option value="inactive">Inactive</Option>
          <Option value="banned">Banned</Option>
        </Select>
      </Space>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} items`
        }}
        onChange={handleTableChange}
      />

      <UserCreateForm
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onSuccess={() => {
          setCreateModalVisible(false);
          fetchUsers();
        }}
      />

      <UserEditModal
        visible={editModalVisible}
        user={selectedUser}
        onCancel={() => setEditModalVisible(false)}
        onSuccess={handleUpdateSuccess}
      />
    </Card>
  );
};