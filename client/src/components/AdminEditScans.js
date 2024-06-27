import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const AdminEditScans = () => {
  const { mangaName } = useParams();
  const [scans, setScans] = useState([]);
  const [newScanName, setNewScanName] = useState('');
  const [pdfFile, setPdfFile] = useState(null); // État pour le fichier PDF
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/admin/mangas/${mangaName}`)
      .then(response => response.json())
      .then(data => setScans(data.scans))
      .catch(error => setError(error.message));
  }, [mangaName]);

  const addScan = async () => {
    const formData = new FormData();
    formData.append('mangaName', mangaName);
    formData.append('scanName', newScanName);
    formData.append('pdf', pdfFile); // Ajouter le fichier PDF au formulaire

    try {
      const response = await axios.post('/api/admin/scans/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setScans([...scans, response.data.scanName]);
      setNewScanName('');
      setPdfFile(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const deleteScan = async (scanName) => {
    try {
      const response = await axios.delete(`/api/admin/scans/delete/${mangaName}/${scanName}`);
      if (response.status === 200) {
        setScans(scans.filter(scan => scan !== scanName));
      } else {
        throw new Error('Erreur lors de la suppression du scan');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const updateScan = async (oldScanName, newScanName) => {
    try {
      const response = await axios.put(`/api/admin/scans/update/${mangaName}/${oldScanName}`, {  newScanName });
      if (response.status === 200) {
        setScans(scans.map(scan => (scan === oldScanName ? newScanName : scan)));
      } else {
        throw new Error('Erreur lors de la mise à jour du scan');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className='text-light'>
      <h2>Édition des scans pour {mangaName}</h2>
      <Row className="mb-3">
        <Col xs={8}>
          <Form.Control
            type="text"
            value={newScanName}
            onChange={(e) => setNewScanName(e.target.value)}
            placeholder="Nom du Scan"
          />
          <Form.Control
            type="file"
            onChange={(e) => setPdfFile(e.target.files[0])}
            className="mt-2"
          />
        </Col>
        <Col xs={4}>
          <Button variant="primary" onClick={addScan} className="w-100">
            Ajouter Scan
          </Button>
        </Col>
      </Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nom du Scan</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {scans.map(scan => (
            <tr key={scan}>
              <td>{scan}</td>
              <td className='d-flex justify-content-evenly'>
                <Button
                  variant="primary"
                  className="me-2"
                  onClick={() => {
                    const newName = prompt('Nouveau nom du scan:', scan);
                    if (newName) {
                      updateScan(scan, newName);
                    }
                  }}
                >
                  Edit
                </Button>
                <Button variant="danger" onClick={() => deleteScan(scan)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {error && <p className="text-danger">{error}</p>}
    </div>
  );
};

export default AdminEditScans;
