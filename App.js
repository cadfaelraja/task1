import React, { useState } from 'react';
import './App.css';

const App = () => {
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
    <div className="App">
      <table border="1">
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
            <td
              className={`bold-text ${dropdownOpen ? 'open' : ''}`}
              onClick={toggleDropdown}
              style={{ cursor: 'pointer' }}
            >
              Masters <span className="triangle">{dropdownOpen ? '▼' : '▶'}</span>
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
  );
};

export default App;
