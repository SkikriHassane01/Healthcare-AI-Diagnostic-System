import React, { useState, useEffect } from 'react';
import { 
  Search, 
  UserPlus, 
  Edit, 
  Trash, 
  ChevronLeft, 
  ChevronRight,
  Check,
  X,
  RefreshCw
} from 'lucide-react';
import adminService from '../../../services/admin.service';

const UserManagement = ({ isDark }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'delete'
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'doctor',
    is_active: true
  });

  // Fetch users
  const fetchUsers = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const response = await adminService.getUsers({ page, search });
      setUsers(response.users);
      setTotalPages(response.pagination.pages);
      setCurrentPage(response.pagination.page);
    } catch (err) {
      setError('Failed to load users. Please try again.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(1, searchTerm);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    fetchUsers(page, searchTerm);
  };

  // Open modal for adding new user
  const openAddModal = () => {
    setModalMode('add');
    setFormData({
      username: '',
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      role: 'doctor',
      is_active: true
    });
    setIsModalOpen(true);
  };

  // Open modal for editing user
  const openEditModal = (user) => {
    setModalMode('edit');
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '', // Leave empty for edit, only update if a value is provided
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      is_active: user.is_active
    });
    setIsModalOpen(true);
  };

  // Open modal for deleting user
  const openDeleteModal = (user) => {
    setModalMode('delete');
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let response;
      
      if (modalMode === 'add') {
        // Remove empty password if not provided
        const userData = { ...formData };
        if (!userData.password) {
          delete userData.password;
        }
        
        response = await adminService.createUser(userData);
      } else if (modalMode === 'edit') {
        // Only include password if provided
        const userData = { ...formData };
        if (!userData.password) {
          delete userData.password;
        }
        
        response = await adminService.updateUser(selectedUser.id, userData);
      } else if (modalMode === 'delete') {
        response = await adminService.deleteUser(selectedUser.id);
      }
      
      // Success
      setIsModalOpen(false);
      fetchUsers(currentPage, searchTerm); // Refresh user list
    } catch (err) {
      setError(err.message || 'Failed to process request. Please try again.');
      console.error('Error processing user request:', err);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-bold mb-4 md:mb-0">User Management</h2>
        
        {/* Search and Add User */}
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
          <form 
            onSubmit={handleSearch} 
            className="flex"
          >
            <div className={`relative flex-grow ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 rounded-l-md w-full ${
                  isDark 
                    ? 'bg-slate-800 border-slate-700 placeholder-slate-400' 
                    : 'bg-white border-slate-300 placeholder-slate-500'
                } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            </div>
            <button
              type="submit"
              className={`px-4 py-2 ${
                isDark 
                  ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
              } rounded-r-md transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500`}
            >
              Search
            </button>
          </form>
          
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-md flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </button>
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className={`p-4 mb-6 rounded-md ${isDark ? 'bg-red-900/30 text-red-300 border border-red-700' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          <div className="flex items-start">
            <X className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        </div>
      )}
      
      {/* Users Table */}
      <div className={`rounded-lg shadow-md overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-white'} transition-colors`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead className={isDark ? 'bg-slate-700' : 'bg-slate-50'}>
              <tr>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-500'} uppercase tracking-wider`}>
                  Name
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-500'} uppercase tracking-wider`}>
                  Username / Email
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-500'} uppercase tracking-wider`}>
                  Role
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-500'} uppercase tracking-wider`}>
                  Status
                </th>
                <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-500'} uppercase tracking-wider`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-slate-200'}`}>
              {loading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className={isDark ? 'bg-slate-800' : 'bg-white'}>
                    {Array.from({ length: 5 }).map((_, cellIndex) => (
                      <td key={cellIndex} className="px-6 py-4 whitespace-nowrap">
                        <div className={`h-4 rounded animate-pulse ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center justify-center py-6">
                      <Users className={`h-12 w-12 ${isDark ? 'text-slate-600' : 'text-slate-300'} mb-3`} />
                      <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                        {searchTerm ? 'No users match your search' : 'No users found'}
                      </p>
                      {searchTerm && (
                        <button
                          onClick={() => {
                            setSearchTerm('');
                            fetchUsers();
                          }}
                          className="mt-2 text-sm text-purple-600 hover:text-purple-500 flex items-center"
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Clear search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                // User rows
                users.map((user) => (
                  <tr key={user.id} className={isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-slate-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`h-8 w-8 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-100'} flex items-center justify-center flex-shrink-0`}>
                          <span className="text-sm font-medium">
                            {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {user.first_name} {user.last_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.username}</div>
                      <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin'
                          ? isDark ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800'
                          : isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'admin' ? 'Administrator' : 'Doctor'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`flex items-center text-sm ${
                        user.is_active
                          ? isDark ? 'text-green-400' : 'text-green-600'
                          : isDark ? 'text-red-400' : 'text-red-600'
                      }`}>
                        {user.is_active ? (
                          <>
                            <Check className="h-4 w-4 mr-1.5" />
                            Active
                          </>
                        ) : (
                          <>
                            <X className="h-4 w-4 mr-1.5" />
                            Inactive
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditModal(user)}
                        className={`text-indigo-600 hover:text-indigo-900 p-1 rounded mr-2 ${
                          isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                        }`}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </button>
                      <button
                        onClick={() => openDeleteModal(user)}
                        className={`text-red-600 hover:text-red-900 p-1 rounded ${
                          isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                        }`}
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {!loading && users.length > 0 && (
          <div className={`px-4 py-3 flex items-center justify-between border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            <div>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                Showing <span className="font-medium">1</span> to <span className="font-medium">{users.length}</span> of{' '}
                <span className="font-medium">{users.length * totalPages}</span> results
              </p>
            </div>
            <div>
              <nav className="flex items-center">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`h-8 w-8 flex items-center justify-center rounded-md ${
                    currentPage === 1
                      ? isDark ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : isDark ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  } focus:outline-none mr-2`}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`h-8 w-8 flex items-center justify-center rounded-md mx-0.5 focus:outline-none ${
                      currentPage === index + 1
                        ? isDark ? 'bg-purple-600 text-white' : 'bg-purple-600 text-white'
                        : isDark ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`h-8 w-8 flex items-center justify-center rounded-md ${
                    currentPage === totalPages
                      ? isDark ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : isDark ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  } focus:outline-none ml-2`}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>
      
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-black opacity-50"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div 
              className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${
                isDark ? 'bg-slate-800' : 'bg-white'
              }`}
            >
              {modalMode === 'delete' ? (
                // Delete Confirmation Dialog
                <div className="p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <Trash className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Delete User
                      </h3>
                      <div className="mt-2">
                        <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
                          Are you sure you want to delete {selectedUser?.username}? This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className={`mt-3 w-full inline-flex justify-center rounded-md border px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm ${
                        isDark 
                          ? 'border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600 focus:ring-slate-500' 
                          : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-500'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // Add/Edit User Form
                <form onSubmit={handleSubmit}>
                  <div className="p-6">
                    <h3 className={`text-lg font-medium mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {modalMode === 'add' ? 'Add New User' : 'Edit User'}
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="first_name" className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            First Name
                          </label>
                          <input
                            type="text"
                            name="first_name"
                            id="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            required
                            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                              isDark 
                                ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                            }`}
                          />
                        </div>
                        <div>
                          <label htmlFor="last_name" className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            Last Name
                          </label>
                          <input
                            type="text"
                            name="last_name"
                            id="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            required
                            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                              isDark 
                                ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                            }`}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="username" className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          Username
                        </label>
                        <input
                          type="text"
                          name="username"
                          id="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          required
                          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                            isDark 
                              ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                              : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                          }`}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                            isDark 
                              ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                              : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                          }`}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="password" className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          {modalMode === 'add' ? 'Password' : 'Password (leave blank to keep current)'}
                        </label>
                        <input
                          type="password"
                          name="password"
                          id="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required={modalMode === 'add'}
                          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                            isDark 
                              ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                              : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                          }`}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="role" className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          Role
                        </label>
                        <select
                          name="role"
                          id="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                            isDark 
                              ? 'bg-slate-700 border-slate-600 text-white' 
                              : 'bg-white border-slate-300 text-slate-900'
                          }`}
                        >
                          <option value="doctor">Doctor</option>
                          <option value="admin">Administrator</option>
                        </select>
                      </div>
                      
                      {modalMode === 'edit' && (
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="is_active"
                            id="is_active"
                            checked={formData.is_active}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
                          />
                          <label htmlFor="is_active" className={`ml-2 block text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            Active account
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className={`px-6 py-3 flex flex-row-reverse ${isDark ? 'bg-slate-700' : 'bg-slate-50'}`}>
                    <button
                      type="submit"
                      className="ml-3 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:text-sm"
                    >
                      {modalMode === 'add' ? 'Add User' : 'Update User'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className={`inline-flex justify-center rounded-md border px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm ${
                        isDark 
                          ? 'border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600 focus:ring-slate-500' 
                          : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-500'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;