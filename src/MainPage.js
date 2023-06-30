import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './MainPage.css';
import Layout from "./Layout";

const MainPage = () => {
    const [students, setStudents] = useState([]);
    const [studentsPerPage, setStudentsPerPage] = useState(10);
    const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [newStudent, setNewStudent] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });
    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const queryPage = queryParams.get('page');
    const querySearchQuery = queryParams.get('searchQuery');
    const [currentPage, setCurrentPage] = useState(queryPage ? Number(queryPage) : 1);
    const [searchQuery, setSearchQuery] = useState(querySearchQuery || '');

    useEffect(() => {
        fetch('https://dummyjson.com/users')
            .then((response) => response.json())
            .then((data) => {
                if (data && Array.isArray(data.users)) {
                    setStudents(data.users);
                } else {
                    console.log('Invalid API response:', data);
                }
            })
            .catch((error) => {
                console.log('Error fetching data:', error);
            });
    }, []);

useEffect(() => {
        const newParams = new URLSearchParams();
        newParams.set('page', currentPage);
        newParams.set('searchQuery', searchQuery);
        navigate(`?${newParams.toString()}`);
    }, [currentPage, searchQuery, navigate]);

    // Pagination logic and filtering based on search query
    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = students
        .filter(student => student.firstName.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(indexOfFirstStudent, indexOfLastStudent);


    // Change page
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Change students per page
    const handleStudentsPerPageChange = (event) => {
        setStudentsPerPage(parseInt(event.target.value));
        setCurrentPage(1);
    };

    // Search by name
    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1);
    };

    // Create new student
    const handleCreateStudent = () => {
        var updatedStudents;
        fetch('https://dummyjson.com/users/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newStudent)
        })
            .then(res => res.json())
            .then((data) => {
                updatedStudents = [...students, JSON.parse(JSON.stringify(data))];
                setStudents(updatedStudents);
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
        setNewStudent({
            firstName: '',
            lastName: '',
            email: '',
            phone: ''
        });
    };

    // Handle input change in create popup form
    const handleCreateInputChange = (event) => {
        const { name, value } = event.target;
        setNewStudent((prevStudent) => ({ ...prevStudent, [name]: value }));
    };

    // Update student
    const handleUpdateStudent = (student) => {
        setSelectedStudent(student);
    };

// Delete student
    const handleDeleteStudent = (student) => {
        fetch('https://dummyjson.com/users/'+student.id, {
            method: 'DELETE',
        })
            .then(res => res.json())
        const updatedStudents = students.filter((u) => u.id !== student.id);

        setStudents(updatedStudents);

    };

    // Handle input change in update popup form
    const handleUpdateInputChange = (event) => {
        const { name, value } = event.target;
        setSelectedStudent((prevStudent) => ({ ...prevStudent, [name]: value }));
    };

// Close update popup
    const closeUpdatePopup = () => {
        setSelectedStudent(null);
    };

// Handle update button click
    const handleUpdate = () => {
        fetch(`https://dummyjson.com/users/${selectedStudent.id}`, {
            method: 'PUT', /* or PATCH */
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(selectedStudent)
        })
            .then(res => res.json())
            .then(updatedStudent => {
                // Update the users state with the updated user
                const updatedStudents = students.map(student =>
                    student.id === updatedStudent.id ? updatedStudent : student
                );
                setStudents(updatedStudents);
            })
            .catch(error => {
                console.log('Error updating user:', error);
            });

        closeUpdatePopup();
    };



    return (
        <Layout>
            <div className="main-page-container">
                <div className="user-table-container">
                    <h2>Student Table</h2>
                    <div className="pagination">
                        <div className="search-container">
                            <input className="search-input" type="text" placeholder="Search by name" value={searchQuery} onChange={handleSearch} />
                        </div>
                        <div className="users-per-page">
                            <label>Students Per Page:</label>
                            <select value={studentsPerPage} onChange={handleStudentsPerPageChange}>
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="15">15</option>
                            </select>
                        </div>
                        <div className="page-selection">
                            {Array.from({ length: Math.ceil(students.length / studentsPerPage) }, (_, index) => (
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
                        {currentStudents.map((student) => (
                            <tr key={student.id}>
                                <td>{student.id}</td>
                                <td>{student.firstName}</td>
                                <td>{student.lastName}</td>
                                <td>{student.email}</td>
                                <td>{student.phone}</td>
                                <td>
                                    <button className="update-button" onClick={() => handleUpdateStudent(student)}>
                                        Update
                                    </button>
                                    <button className="delete-button" onClick={() => handleDeleteStudent(student)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                        <tfoot class="user-table-footer">
                            <button className="create-button" onClick={openCreatePopup}>
                                Create New Student
                            </button>
                        </tfoot>
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
                                        value={newStudent.firstName}
                                        onChange={handleCreateInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Last Name:</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={newStudent.lastName}
                                        onChange={handleCreateInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email:</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={newStudent.email}
                                        onChange={handleCreateInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone:</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={newStudent.phone}
                                        onChange={handleCreateInputChange}
                                    />
                                </div>
                                <div className="popup-buttons">
                                    <button className="cancel-button" onClick={closeCreatePopup}>
                                        Cancel
                                    </button>
                                    <button className="create-button" onClick={handleCreateStudent}>
                                        Create
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {selectedStudent && (
                    <div className="popup-overlay">
                        <div className="update-popup">
                            <h3>Update Student</h3>
                            <form>
                                <div className="form-group">
                                    <label>First Name:</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={selectedStudent.firstName}
                                        onChange={handleUpdateInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Last Name:</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={selectedStudent.lastName}
                                        onChange={handleUpdateInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email:</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={selectedStudent.email}
                                        onChange={handleUpdateInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone:</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={selectedStudent.phone}
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
        </Layout>
    );
};

export default MainPage;
