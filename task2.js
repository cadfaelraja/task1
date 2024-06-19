import React, { useState } from 'react';
import './App.css';

const Modal = ({ role, closeModal }) => {
  const [masterAccess, setMasterAccess] = useState('read');
  const [activeMaster, setActiveMaster] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [subAccess, setSubAccess] = useState({
    chatBox: 'read',
    visualization: 'read',
    dataLoader: 'read',
    security: 'read',
    fund: 'read',
    fundGroup: 'read',
    materialityMap: 'read'
  });

  const handleMasterButtonClick = (type) => {
    setMasterAccess(type);
    setActiveMaster(true);
    setSubAccess(prevState => ({
      ...prevState,
      security: type,
      fund: type,
      fundGroup: type,
      materialityMap: type
    }));
  };

  const handleSubButtonClick = (menuName, type) => {
    if (['security', 'fund', 'fundGroup', 'materialityMap'].includes(menuName)) {
      setActiveMaster(false);
    }
    setSubAccess(prevState => ({ ...prevState, [menuName]: type }));
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const renderMasterButtons = () => (
    <div className="button-group">
      <button
        className={`btn btn-read ${activeMaster && masterAccess === 'read' ? 'active' : ''}`}
        onClick={() => handleMasterButtonClick('read')}
      >
        Read
      </button>
      <button
        className={`btn btn-write ${activeMaster && masterAccess === 'write' ? 'active' : ''}`}
        onClick={() => handleMasterButtonClick('write')}
      >
        Write
      </button>
      <button
        className={`btn btn-disable ${activeMaster && masterAccess === 'disable' ? 'active' : ''}`}
        onClick={() => handleMasterButtonClick('disable')}
      >
        Disable
      </button>
    </div>
  );

  const renderSubButtons = (menuName) => (
    <div className="button-group">
      <button
        className={`btn btn-read ${subAccess[menuName] === 'read' ? 'active' : ''}`}
        onClick={() => handleSubButtonClick(menuName, 'read')}
      >
        Read
      </button>
      {menuName !== 'visualization' && (
        <button
          className={`btn btn-write ${subAccess[menuName] === 'write' ? 'active' : ''}`}
          onClick={() => handleSubButtonClick(menuName, 'write')}
        >
          Write
        </button>
      )}
      <button
        className={`btn btn-disable ${subAccess[menuName] === 'disable' ? 'active' : ''}`}
        onClick={() => handleSubButtonClick(menuName, 'disable')}
      >
        Disable
      </button>
    </div>
  );

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>&times;</span>
        <h2>Access Control for {role}</h2>
        <table>
          <thead>
            <tr>
              <th>Menu Name</th>
              <th>Module Access</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="bold-text">Chat Box</td>
              <td>{renderSubButtons('chatBox')}</td>
            </tr>
            <tr>
              <td className="bold-text">Visualization</td>
              <td>{renderSubButtons('visualization')}</td>
            </tr>
            <tr>
              <td className="bold-text">Data Loader</td>
              <td>{renderSubButtons('dataLoader')}</td>
            </tr>
            <tr>
              <td className="bold-text" onClick={toggleDropdown} style={{ cursor: 'pointer' }}>
                Masters ▼ {/* Dropdown icon */}
              </td>
              <td>{renderMasterButtons()}</td>
            </tr>
            {dropdownOpen && (
              <>
                <tr>
                  <td>Security</td>
                  <td>{renderSubButtons('security')}</td>
                </tr>
                <tr>
                  <td>Fund</td>
                  <td>{renderSubButtons('fund')}</td>
                </tr>
                <tr>
                  <td>Fund Group</td>
                  <td>{renderSubButtons('fundGroup')}</td>
                </tr>
                <tr>
                  <td>Materiality Map</td>
                  <td>{renderSubButtons('materialityMap')}</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const App = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  const openModal = (roleName) => {
    setModalOpen(true);
    setSelectedRole(roleName);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedRole('');
  };

  return (
    <div className="App">
      <h2>Role Information</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Role Name</th>
            <th>Description</th>
            <th>Active Status</th>
          </tr>
        </thead>
        <tbody>
          <tr onClick={() => openModal('Admin')} style={{ cursor: 'pointer' }}>
            <td>Admin</td>
            <td>Description of Admin role</td>
            <td><button className="active-button">Active</button></td>
          </tr>
          <tr onClick={() => openModal('Team')} style={{ cursor: 'pointer' }}>
            <td>Team</td>
            <td>Description of Team role</td>
            <td><button className="active-button">Active</button></td>
          </tr>
          <tr onClick={() => openModal('Admin')} style={{ cursor: 'pointer' }}>
            <td>Admin</td>
            <td>Description of Admin role</td>
            <td><button className="active-button">Active</button></td>
          </tr>
        </tbody>
      </table>

      {modalOpen && <Modal role={selectedRole} closeModal={closeModal} />}
    </div>
  );
};

export default App;
