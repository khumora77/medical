import React, { useState, useRef, useEffect } from 'react';

const AdminProfile: React.FC = () => {
  // State for admin data - localStorage dan o'qish
  const [adminData, setAdminData] = useState(() => {
    const savedData = localStorage.getItem('adminProfileData');
    return savedData ? JSON.parse(savedData) : {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      role: 'Senior Administrator',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
      joinDate: 'January 2022',
      lastLogin: '2 hours ago',
      department: 'IT Management',
      location: 'San Francisco, CA',
      phone: '+1 (555) 123-4567'
    };
  });

  // State for stats
  const [stats] = useState([
    { label: 'Total Users', value: '2,458' },
    { label: 'Active Sessions', value: '378' },
    { label: 'Tasks Completed', value: '1,245' },
    { label: 'Storage Used', value: '4.7GB' }
  ]);

  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...adminData });

  // State for avatar editing
  const [isAvatarEditing, setIsAvatarEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Ma'lumotlarni localStorage ga saqlash
  useEffect(() => {
    localStorage.setItem('adminProfileData', JSON.stringify(adminData));
  }, [adminData]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  // Save changes
  const handleSave = () => {
    setAdminData(editData);
    setIsEditing(false);
    // localStorage ga avtomatik saqlanadi useEffect orqali
  };

  // Cancel editing
  const handleCancel = () => {
    setEditData(adminData);
    setIsEditing(false);
  };

  // Fayl yuklash funksiyasi
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Fayl hajmini tekshirish (5MB dan oshmasligi kerak)
      if (file.size > 5 * 1024 * 1024) {
        alert('Fayl hajmi 5MB dan oshmasligi kerak!');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const newAvatar = e.target.result as string;
          const updatedData = {...adminData, avatar: newAvatar};
          setAdminData(updatedData);
          setEditData(updatedData);
          setIsAvatarEditing(false);
          
          // localStorage ga yangi avatar ni saqlash
          localStorage.setItem('adminProfileData', JSON.stringify(updatedData));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Kamerani ishga tushirish
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error('Kamerani ochishda xatolik:', error);
      alert('Kameraga kirish imkoni yo‘q. Iltimos, ruxsatnomalarni tekshiring.');
    }
  };

  // Kamerani yopish
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  };

  // Rasmni kameradan olish
  const captureFromCamera = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (!context) return;
      
      // Canvas o'lchamlarini video o'lchamlariga moslashtirish
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Videodan rasmni canvasga chizish
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Canvasdagi rasmni ma'lumot URI sifatida olish
      const imageDataURL = canvas.toDataURL('image/png');
      const updatedData = {...adminData, avatar: imageDataURL};
      setAdminData(updatedData);
      setEditData(updatedData);
      stopCamera();
      setIsAvatarEditing(false);
      
      // localStorage ga yangi avatar ni saqlash
      localStorage.setItem('adminProfileData', JSON.stringify(updatedData));
    }
  };

  // Avatar tahrirlash modali
  const AvatarEditModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Profil rasmini o'zgartirish</h3>
        
        <div className="flex flex-col space-y-4">
          {/* Fayl yuklash */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Kompyuterdan rasm tanlash
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          
          {/* Kameradan rasm olish */}
          {!isCameraActive ? (
            <button
              onClick={startCamera}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Kameradan rasm olish
            </button>
          ) : (
            <div className="space-y-2">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-48 bg-gray-200 rounded-lg object-cover"
              />
              <div className="flex space-x-2">
                <button
                  onClick={captureFromCamera}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex-1"
                >
                  Rasmni olish
                </button>
                <button
                  onClick={stopCamera}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex-1"
                >
                  Bekor qilish
                </button>
              </div>
            </div>
          )}
          
          <canvas ref={canvasRef} className="hidden" />
          
          <button
            onClick={() => setIsAvatarEditing(false)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Bekor qilish
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Profile</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <img
                    src={adminData.avatar}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
                  />
                  <button
                    onClick={() => setIsAvatarEditing(true)}
                    className="absolute bottom-2 right-2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gray-800">{adminData.name}</h2>
                <p className="text-blue-600 font-medium">{adminData.role}</p>
                <p className="text-gray-500 text-sm mt-2">Joined {adminData.joinDate}</p>
                
                <div className="w-full mt-6 space-y-4">
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors duration-300"
                  >
                    Edit Profile
                  </button>
                  <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg transition-colors duration-300">
                    Change Password
                  </button>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  {stats.map((stat, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-600">{stat.label}</span>
                      <span className="font-semibold text-gray-800">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Details and Forms */}
          <div className="lg:col-span-2">
            {/* Personal Information Card */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                {isEditing && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Editing
                  </span>
                )}
              </div>
              
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={editData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <input
                      type="text"
                      name="department"
                      value={editData.department}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={editData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                    <p className="mt-1 text-gray-800">{adminData.name}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                    <p className="mt-1 text-gray-800">{adminData.email}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                    <p className="mt-1 text-gray-800">{adminData.phone}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Department</h3>
                    <p className="mt-1 text-gray-800">{adminData.department}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Location</h3>
                    <p className="mt-1 text-gray-800">{adminData.location}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Last Login</h3>
                    <p className="mt-1 text-gray-800">{adminData.lastLogin}</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Security Settings Card */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Security Settings</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-800">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                  </div>
                  <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300">
                    Enable
                  </button>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-800">Login Activity</h3>
                    <p className="text-sm text-gray-600">Review your account's login history</p>
                  </div>
                  <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300">
                    View Logs
                  </button>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-800">Active Sessions</h3>
                    <p className="text-sm text-gray-600">Manage your active login sessions</p>
                  </div>
                  <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300">
                    Manage
                  </button>
                </div>
              </div>
            </div>
            
            {/* System Preferences Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">System Preferences</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-800">Email Notifications</h3>
                    <p className="text-sm text-gray-600">Receive emails for important updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                  </label>
                </div>
                
                <div className="flex justify-between items-center pt-4">
                  <div>
                    <h3 className="font-medium text-gray-800">Dark Mode</h3>
                    <p className="text-sm text-gray-600">Switch to dark theme</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                  </label>
                </div>
                
                <div className="flex justify-between items-center pt-4">
                  <div>
                    <h3 className="font-medium text-gray-800">Auto Logout</h3>
                    <p className="text-sm text-gray-600">Automatically logout after 30 minutes of inactivity</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {isAvatarEditing && <AvatarEditModal />}
    </div>
  );
};

export default AdminProfile;