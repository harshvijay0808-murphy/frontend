import React, { useState, useEffect } from "react";
import axios from "axios";

const tables = [
  "customers",
  "customers_other_details",
  "customers_photos",
  "customers_shipping_details",
  "customers_billing_details",
  "customers_contact",
  "customers_terms",
];

const fields = {
  customers: ["cust_name", "gst_no", "udyam_reg_no", "cust_status", "pan", "aadhar"],
  customers_other_details: ["annual_turnover", "no_counters_in_chain", "list_of_other_products", "list_of_other_companies", "appoint_date"],
  customers_photos: ["shop_image_1", "shop_image_2", "shop_image_3", "shop_image_4", "image_security_cheque_1", "image_security_cheque_2", "image_security_cheque_3", "image_security_cheque_4", "gst_certificate_image"],
  customers_shipping_details: ["shipping_address", "shipping_city", "shipping_district", "shipping_state", "shipping_pin_code"],
  customers_billing_details: ["billing_address", "billing_city", "billing_district", "billing_state", "billing_pin_code"],
  customers_contact: [
    "register_mobile", "register_email", "contact_person1_name", "contact_person1_mobile", "contact_person1_email",
    "contact_person1_dob", "contact_person1_anniversary", "contact_person2_name", "contact_person2_mobile",
    "contact_person2_email", "contact_person2_dob", "contact_person2_anniversary", "contact_person3_name",
    "contact_person3_mobile", "contact_person3_email", "contact_person3_dob", "contact_person3_anniversary"
  ],
  customers_terms: ["tally_name", "cust_branch", "dispatch_store", "cust_category", "price_list_code", "disc_code", "sales_person", "allocated_cre", "zone"],
};

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeTable, setActiveTable] = useState("customers");
  const [formData, setFormData] = useState({});
  const [editingCustomer, setEditingCustomer] = useState(null);

  // Fetch customers from Node API
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/customers"); // your Node API
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (table, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [table]: {
        ...(prev[table] || {}),
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      if (editingCustomer) {
        await axios.put(`http://localhost:5000/api/customers/${editingCustomer.id}`, formData);
      } else {
        await axios.post("http://localhost:5000/api/customers", formData);
      }
      fetchCustomers();
      setShowModal(false);
      setFormData({});
      setEditingCustomer(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/customers/${id}`);
      fetchCustomers();
    } catch (err) {
      console.error(err);
    }
  };

  const openAddModal = () => {
    setFormData({});
    setEditingCustomer(null);
    setActiveTable("customers");
    setShowModal(true);
  };

  const openEditModal = (customer) => {
    setFormData(customer);
    setEditingCustomer(customer);
    setActiveTable("customers");
    setShowModal(true);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Customers</h2>
        <button className="btn btn-success" onClick={openAddModal}>
          + Add Customer
        </button>
      </div>

      {/* Customers Table */}
      <table className="table table-striped table-hover shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>GST No</th>
            <th>PAN</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((cust) => (
            <tr key={cust.id}>
              <td>{cust.id}</td>
              <td>{cust.cust_name}</td>
              <td>{cust.gst_no}</td>
              <td>{cust.pan}</td>
              <td>
                <button
                  className="btn btn-info btn-sm me-2"
                  onClick={() => openEditModal(cust)}
                >
                  View/Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(cust.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-xl modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title">{editingCustomer ? "Edit Customer" : "Add Customer"}</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body d-flex">
                {/* Sidebar */}
                <div className="border-end pe-3" style={{ width: "220px" }}>
                  <ul className="list-group">
                    {tables.map((table) => (
                      <li
                        key={table}
                        className={`list-group-item list-group-item-action ${
                          activeTable === table ? "active" : ""
                        }`}
                        onClick={() => setActiveTable(table)}
                        style={{ cursor: "pointer" }}
                      >
                        {table}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Form Fields */}
                <div className="flex-grow-1 ps-3">
                  <h5 className="mb-3 text-capitalize">{activeTable.replaceAll("_", " ")}</h5>
                  <div className="row">
                    {fields[activeTable].map((field) => (
                      <div className="col-md-6 mb-3" key={field}>
                        <label className="form-label text-capitalize">{field.replaceAll("_", " ")}</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData[activeTable]?.[field] || ""}
                          onChange={(e) =>
                            handleInputChange(activeTable, field, e.target.value)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Close
                </button>
                <button className="btn btn-primary" onClick={handleSave}>
                  {editingCustomer ? "Update" : "Save & Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;
