import React, { useEffect, useState } from "react";
import {
  getPartnerRestaurantRequests,
  approvePartnerRestaurant,
  rejectPartnerRestaurant,
} from "../../api/admin";

const AdminPartnerRestaurants = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getPartnerRestaurantRequests();
      setRequests(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load partner requests");
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id) => {
    try {
      await approvePartnerRestaurant(id);
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to approve request");
    }
  };

  const reject = async (id) => {
    try {
      await rejectPartnerRestaurant(id);
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to reject request");
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="container mt-4">
      <h3>Partner Restaurant Requests</h3>

      {loading && <p>Loading requests...</p>}

      {!loading && requests.length === 0 && (
        <p className="text-muted">No partner requests found</p>
      )}

      {requests.map((r) => (
        <div key={r.id} className="card p-3 mb-3 shadow-sm">
          <h5 className="mb-1">{r.name}</h5>
          <p className="mb-1 text-muted">{r.address}</p>
          <p className="mb-2">
            Status: <strong>{r.status}</strong>
          </p>

          {r.status === "PENDING" && (
            <div>
              <button
                onClick={() => approve(r.id)}
                className="btn btn-success btn-sm me-2"
              >
                Approve
              </button>
              <button
                onClick={() => reject(r.id)}
                className="btn btn-danger btn-sm"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminPartnerRestaurants;
