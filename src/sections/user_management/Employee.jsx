import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import MainCard from 'components/MainCard';
import { Modal, Button, Form, Badge } from 'react-bootstrap';

export default function Employee() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentData, setCurrentData] = useState({
    emp_id: '',
    name: '',
    dep_id: '',
    designation: '',
    role_id: '',
    registered_email: '',
    phone_number: '',
    address: '',
    aadhar_num: '',
    pan_num: '',
    image_aadhar: '',
    image_pan: '',
    dob: '',
    doj: '',
    activeYN: 1
  });
  const [loading, setLoading] = useState(false);

  // Fetch employees
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to load employees', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch departments and roles for dropdowns
  const fetchDepartmentsAndRoles = async () => {
    try {
      const [depRes, roleRes] = await Promise.all([
        axios.get('http://localhost:5000/api/departments'),
        axios.get('http://localhost:5000/api/roles')
      ]);
      setDepartments(depRes.data);
      setRoles(roleRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchDepartmentsAndRoles();
  }, []);

  const handleAdd = () => {
    setCurrentData({
      emp_id: '',
      name: '',
      dep_id: '',
      designation: '',
      role_id: '',
      registered_email: '',
      phone_number: '',
      address: '',
      aadhar_num: '',
      pan_num: '',
      image_aadhar: '',
      image_pan: '',
      dob: '',
      doj: '',
      activeYN: 1
    });
    setIsEditMode(false);
    setShowModal(true);
  };

  const handleEdit = (row) => {
    setCurrentData(row);
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (row) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Delete employee "${row.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/employees/${row.emp_id}`);
        setEmployees(employees.filter((e) => e.emp_id !== row.emp_id));
        Swal.fire('Deleted!', 'Employee has been deleted.', 'success');
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Failed to delete employee', 'error');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form
  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && data[key] !== null) formData.append(key, data[key]);
    });

    if (data.image_aadhar && data.image_aadhar[0]) formData.append('image_aadhar', data.image_aadhar[0]);
    if (data.image_pan && data.image_pan[0]) formData.append('image_pan', data.image_pan[0]);

    try {
      if (isEditMode && currentData.emp_id) {
        await axios.put(`http://localhost:5000/api/employees/${currentData.emp_id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        Swal.fire('Updated!', 'Employee has been updated.', 'success');
      } else {
        await axios.post(`http://localhost:5000/api/employees`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        Swal.fire('Added!', 'New employee has been added.', 'success');
      }
      setShowModal(false);
    } catch (err) {
      console.error(err.response?.data || err.message);
      Swal.fire('Error', err.response?.data?.message || 'Failed to save employee', 'error');
    }
  };



  return (
    <MainCard title={<h3 className="mb-0 text-center fw-bold text-primary">Employee List</h3>}>
      <div className="d-flex justify-content-end mb-4">
        <Button variant="outline-primary" className="fw-bold shadow-sm" onClick={handleAdd}>
          <i className="ti ti-plus me-2" />
          Add Employee
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <div style={{ maxHeight: '450px', overflowY: 'auto' }}>
          <table className="table table-hover table-bordered align-middle">
            <thead className="table-dark text-center">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Department</th>
                <th>Role</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((row, index) => (
                <tr key={row.emp_id}>
                  <td className="text-center">{index + 1}</td>
                  <td>{row.name}</td>
                  <td>{row.departmentName}</td>
                  <td>{row.roleName}</td>
                  <td>{row.registered_email}</td>
                  <td>{row.phone_number}</td>
                  <td className="text-center">
                    <div className="d-flex gap-2 justify-content-center">
                      <Button variant="outline-success" size="sm" onClick={() => handleEdit(row)}>
                        <i className="ti ti-pencil me-1" />
                        Edit
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(row)}>
                        <i className="ti ti-trash me-1" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>{isEditMode ? 'Edit Employee' : 'Add Employee'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={currentData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Department</Form.Label>
              <Form.Select name="dep_id" value={currentData.dep_id} onChange={handleChange} required>
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.departmentName}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Role</Form.Label>
              <Form.Select name="role_id" value={currentData.role_id} onChange={handleChange} required>
                <option value="">Select Role</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Email</Form.Label>
              <Form.Control
                type="file"
                {...register('image_aadhar', {
                  validate: (fileList) => {
                    console.log(fileList)
                    // If no file selected
                    if (!fileList || fileList.length === 0) {
                      return isEditMode ? true : 'Aadhaar image is required';
                    }

                    console.log(isEditMode)

                    const file = fileList[0];

                    // Validate file type
                    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
                    console.log(file.type)
                    if (!allowedTypes.includes(file.type)) {
                      return isEditMode ? true : 'Only jpeg, jpg, png files are allowed';
                    }

                    // Validate file size
                    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
                    if (file.size > maxSizeInBytes) {
                      return 'File size must be less than 5 MB';
                    }

                    return true;
                  }
                })}
              />


              {errors.image_aadhar && <small className="text-danger">{errors.image_aadhar.message}</small>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Phone Number</Form.Label>
              <Form.Control
                type="file"
                {...register('image_pan', {
                  validate: (fileList) => {
                    console.log(fileList)
                    // If no file selected
                    if (!fileList || fileList.length === 0) {
                      return isEditMode ? true : 'Pan image is required';
                    }

                    console.log(isEditMode)

                    const file = fileList[0];

                    // Validate file type
                    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
                    console.log(file.type)
                    if (!allowedTypes.includes(file.type)) {
                      return isEditMode ? true : 'Only jpeg, jpg, png files are allowed';
                    }

                    // Validate file size
                    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
                    if (file.size > maxSizeInBytes) {
                      return 'File size must be less than 5 MB';
                    }

                    return true;
                  }
                })}
              />
            </Form.Group>

            {/* DOB */}
            <Form.Group className="mb-3">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control type="date" {...register('dob', userValidationSchema.dob)} />
              {errors.dob && <small className="text-danger">{errors.dob.message}</small>}
            </Form.Group>

            {/* DOJ */}
            <Form.Group className="mb-3">
              <Form.Label>Date of Joining</Form.Label>
              <Form.Control type="date" {...register('doj', userValidationSchema.doj)} />
              {errors.doj && <small className="text-danger">{errors.doj.message}</small>}
            </Form.Group>

            {/* Address */}
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control type="text" {...register('address', userValidationSchema.address)} />
              {errors.address && <small className="text-danger">{errors.address.message}</small>}
            </Form.Group>

            {/* Active Toggle */}
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                label="Active / Inactive"
                checked={watch('activeYN') === 'Y'}
                onChange={handleActiveToggle}
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" variant="primary" className="fw-bold">
              {isEditMode ? 'Save Changes' : 'Add Employee'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </MainCard>
  );
}
