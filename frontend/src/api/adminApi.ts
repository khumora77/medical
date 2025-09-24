changePassword: async (passwordData: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ message: string }> => {
  try {
    const response = await makeRequest<ApiResponse<{ message: string }>>({
      method: 'POST',
      url: '/auth/change-password',
      data: {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        // confirmPassword backendga yuborilmasligi mumkin
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('changePassword error:', error);
    
    // Backend xatosini tekshirish
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    throw new Error('Parolni yangilash mumkin emas. Iltimos, qaytadan urinib ko\'ring.');
  }
},