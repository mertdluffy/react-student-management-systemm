import React, { useEffect, useState } from 'react';
import './MainPage.css';

const MainPage = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage, setUsersPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState([]);
    const [newUser, setNewUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        fetch('https://dummyjson.com/users')
            .then((response) => response.json())
            .then((data) => {
                if (data && Array.isArray(data.users)) {
                    setUsers(data.users);
                } else {
                    console.log('Invalid API response:', data);
                }
            })
            .catch((error) => {
                console.log('Error fetching data:', error);
            });
    }, []);

    // Pagination logic and filtering based on search query
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    var currentUsers = users
        .filter(user => user.firstName.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(indexOfFirstUser, indexOfLastUser);


    // Change page
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Change users per page
    const handleUsersPerPageChange = (event) => {
        setUsersPerPage(parseInt(event.target.value));
        setCurrentPage(1);
    };

    // Search by name
    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1);
    };

    // Create new user
    const handleCreateUser = () => {
        var updatedUsers;
        fetch('https://dummyjson.com/users/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
        })
            .then(res => res.json())
            .then((data) => {
                updatedUsers = [...users, JSON.parse(JSON.stringify(data))];
                setUsers(updatedUsers);
            });
        closeCreatePopup();
    };

    // Open create popup
    const openCreatePopup = () => {
        setIsCreatePopupOpen(true);
    };

    // Close create popup
    const closeCreatePopup = () => {
        setIsCreatePopupOpen(false);
        setNewUser({
            firstName: '',
            lastName: '',
            email: '',
            phone: ''
        });
    };

    // Handle input change in create popup form
    const handleCreateInputChange = (event) => {
        const { name, value } = event.target;
        setNewUser((prevUser) => ({ ...prevUser, [name]: value }));
    };

    // Update user
    const handleUpdateUser = (user) => {
        setSelectedUser(user);
    };

// Delete user
    const handleDeleteUser = (user) => {
        fetch('https://dummyjson.com/users/'+user.id, {
            method: 'DELETE',
        })
            .then(res => res.json())
            .then(console.log);
        const updatedUsers = users.filter((u) => u.id !== user.id);

        setUsers(updatedUsers);
        // Perform any other desired action (e.g., make an API call to delete the user)
    };

    // Handle input change in update popup form
    const handleUpdateInputChange = (event) => {
        const { name, value } = event.target;
        setSelectedUser((prevUser) => ({ ...prevUser, [name]: value }));
    };

// Close update popup
    const closeUpdatePopup = () => {
        console.log(selectedUser)
        setSelectedUser(null);
    };

// Handle update button click
    const handleUpdate = () => {
        fetch('https://dummyjson.com/users/'+selectedUser.id, {
            method: 'PUT', /* or PATCH */
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                selectedUser
            })
        })
            .then(res => res.json())
            .then((data) => {
                var objIndex = users.findIndex((user_to_be_edited => user_to_be_edited.id === selectedUser.id));
                users[objIndex] = selectedUser
                setUsers(users)
                currentUsers = users
                    .filter(user => user.firstName.toLowerCase().includes(searchQuery.toLowerCase()))
                    .slice(indexOfFirstUser, indexOfLastUser);
            });
        closeUpdatePopup();
    };



    return (
        <div className="main-page-container">
            <h2>Student Management System</h2>
            <div className="toolbar">
                <button className="create-button" onClick={openCreatePopup}>
                    Create New Student
                </button>
            </div>

            <div className="user-table-container">
                <h2>User Table</h2>
                <div className="pagination">
                    <div className="search-container">
                        <input type="text" placeholder="Search by name" value={searchQuery} onChange={handleSearch} />
                    </div>
                    <div className="users-per-page">
                        <label>Users Per Page:</label>
                        <select value={usersPerPage} onChange={handleUsersPerPageChange}>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </div>
                    <div className="page-selection">
                        {Array.from({ length: Math.ceil(users.length / usersPerPage) }, (_, index) => (
                            <button
                                key={index}
                                className={currentPage === index + 1 ? 'active' : ''}
                                onClick={() => paginate(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
                <table className="user-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentUsers.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>
                                <button className="update-button" onClick={() => handleUpdateUser(user)}>
                                    Update
                                </button>
                                <button className="delete-button" onClick={() => handleDeleteUser(user)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {isCreatePopupOpen && (
                <div className="popup-overlay">
                    <div className="create-popup">
                        <h3>Create New Student</h3>
                        <form>
                            <div className="form-group">
                                <label>First Name:</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={newUser.firstName}
                                    onChange={handleCreateInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name:</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={newUser.lastName}
                                    onChange={handleCreateInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={newUser.email}
                                    onChange={handleCreateInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone:</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={newUser.phone}
                                    onChange={handleCreateInputChange}
                                />
                            </div>
                            <div className="popup-buttons">
                                <button className="cancel-button" onClick={closeCreatePopup}>
                                    Cancel
                                </button>
                                <button className="create-button" onClick={handleCreateUser}>
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {selectedUser && (
                <div className="popup-overlay">
                    <div className="update-popup">
                        <h3>Update User</h3>
                        <form>
                            <div className="form-group">
                                <label>First Name:</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={selectedUser.firstName}
                                    onChange={handleUpdateInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name:</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={selectedUser.lastName}
                                    onChange={handleUpdateInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={selectedUser.email}
                                    onChange={handleUpdateInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone:</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={selectedUser.phone}
                                    onChange={handleUpdateInputChange}
                                />
                            </div>
                            <div className="popup-buttons">
                                <button className="cancel-button" onClick={closeUpdatePopup}>
                                    Cancel
                                </button>
                                <button className="update-button" onClick={handleUpdate}>
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MainPage;
