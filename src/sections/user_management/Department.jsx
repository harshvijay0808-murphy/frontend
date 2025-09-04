import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import Protected from 'components/ProtectedRoute';
import MainCard from 'components/MainCard';
import { Modal, Button, Form, Badge } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";



export default function Department() {
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentData, setCurrentData] = useState({ id: '', departmentName: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/departments');
      setDepartments(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to load departments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const run = async () => {
      const isValid = await Protected();
      console.log(isValid);
      if (!isValid) {
        navigate("/login");
        return;
      }


      await fetchDepartments();
    };

    run();
  }, [navigate]);


  const handleAdd = () => {
    setCurrentData({ id: '', departmentName: '' });
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
      text: `Delete department "${row.departmentName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/departments/${row.id}`);
        setDepartments(departments.filter((d) => d.id !== row.id));
        Swal.fire('Deleted!', 'Department has been deleted.', 'success');
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Failed to delete department', 'error');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/departments/${currentData.id}`, {
          departmentName: currentData.departmentName,
        });
        setDepartments(
          departments.map((d) =>
            d.id === currentData.id ? { ...d, departmentName: currentData.departmentName } : d
          )
        );
        Swal.fire('Updated!', 'Department has been updated.', 'success');
      } else {
        const res = await axios.post('http://localhost:5000/api/departments', {
          departmentName: currentData.departmentName,
        });
        setDepartments([...departments, res.data]);
        Swal.fire('Added!', 'New department has been added.', 'success');
      }
      setShowModal(false);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to save department', 'error');
    }
  };

  return (
    <MainCard title={<h3 className="mb-0 text-center fw-bold text-primary">Department List</h3>}>
      <div className="d-flex justify-content-end mb-4">
        <Button
          variant="outline-primary"
          className="fw-bold shadow-sm"
          onClick={handleAdd}
        >
          <i className="ti ti-plus me-2" />
          Add Department
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
                <th>Department Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((row, index) => (
                <tr key={row.id}>
                  <td className="text-center">{index + 1}</td>
                  <td className="text-center">
                    {/* <Badge bg="light" className="p-2 text-dark fs-6"> */}
                    {row.departmentName}
                    {/* </Badge> */}
                  </td>
                  <td className="text-center">
                    <div className="d-flex gap-2 justify-content-center">
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => handleEdit(row)}
                      >
                        <i className="ti ti-pencil me-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(row)}
                      >
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

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>{isEditMode ? 'Edit Department' : 'Add Department'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="departmentName">
              <Form.Label className="fw-bold">Department Name</Form.Label>
              <Form.Control
                type="text"
                name="departmentName"
                placeholder="Enter department name"
                value={currentData.departmentName}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="fw-bold">
              {isEditMode ? 'Save Changes' : 'Add Department'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </MainCard>
  );
}
