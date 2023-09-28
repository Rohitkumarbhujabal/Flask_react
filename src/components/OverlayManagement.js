import React, { useState, useEffect } from 'react';
import axios from 'axios';

function OverlayManagement() {
  const [overlays, setOverlays] = useState([]);
  const [newOverlay, setNewOverlay] = useState('');
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    axios.get('/api/overlay')
      .then((response) => {
        setOverlays(response.data);
      })
      .catch((error) => {
        console.error('Error fetching overlays:', error);
      });
  }, []);

  const addOverlay = () => {
    axios.put(`http://localhost:5001/api/overlay/${newOverlay}`)
      .then((response) => {
        setOverlays([...overlays, response.data]);
        setNewOverlay('');
      })
      .catch((error) => {
        console.error('Error adding overlay:', error);
      });
  };

  const deleteOverlay = (overlay_id) => {
    axios.delete(`/api/overlay/${overlay_id}`)
      .then(() => {
        const updatedOverlays = overlays.filter((overlay) => overlay._id !== overlay_id);
        setOverlays(updatedOverlays);
      })
      .catch((error) => {
        console.error('Error deleting overlay:', error);
      });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      <h2>Overlay Management</h2>
      <input
        type="text"
        className='rtsp-input'
        placeholder="Enter overlay content"
        value={newOverlay}
        onChange={(e) => setNewOverlay(e.target.value)}
      />
      <button className='ovbutton' onClick={addOverlay}>Add Overlay</button>

      <input
        type="file"
        accept="image/*"
        onChange={handleLogoUpload}
      />

      {logo && (
        <div>
          <h3>Uploaded Logo</h3>
          <img src={logo} alt="Logo" style={{ maxWidth: '200px' }} />
        </div>
      )}

      <ul>
        {overlays.map((overlay) => (
          <li key={overlay._id}>
            {overlay.content}
            <button onClick={() => deleteOverlay(overlay._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OverlayManagement;
