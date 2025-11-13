'use client'
import React, { useState, useMemo, useCallback } from 'react';

// --- Utility Icons (lucide-react replacements for single file) ---
const TrashIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
);
const PlusIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
);
const ZapIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);
const DollarSignIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
);
const SettingsIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.78 1.48a2 2 0 0 0 .73 2.73l.15.08a2 2 0 0 1 1 1.73v.18a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.78-1.48a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
);
const SunIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
);
const MoonIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
);


// --- Reusable Components ---

const ResultCard = ({ title, value, unit, icon, isDarkMode }) => (
  <div className={`p-4 rounded-xl shadow-lg flex flex-col items-center justify-center text-center transition duration-300 hover:shadow-xl ${
    isDarkMode 
    ? 'bg-gray-700 border border-gray-600 text-white' 
    : 'bg-white border border-gray-100 text-gray-800 hover:shadow-xl'
  }`}>
    <div className="text-3xl text-indigo-400 mb-1">{icon}</div>
    <h3 className={`text-sm font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{title}</h3>
    <p className="text-2xl font-bold mt-0.5">
      {value} <span className={`text-base font-normal ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{unit}</span>
    </p>
  </div>
);

// Updated ApplianceRow to show individual consumption metrics
const ApplianceRow = ({ appliance, handleDeleteAppliance, isDarkMode }) => (
  <div className={`flex items-center justify-between p-4 rounded-xl shadow-sm mb-2 transition duration-300 ${
    isDarkMode 
    ? 'bg-gray-700 border border-gray-600 text-white' 
    : 'bg-white border border-gray-200 text-gray-800'
  }`}>
    
    <div className="flex-1 min-w-0">
      <p className="font-semibold truncate">{appliance.name}</p>
      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        {appliance.watts}W • {appliance.hours} hrs/day
      </p>
    </div>
    
    <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
      {/* Individual Consumption Details */}
      <div className="text-right">
        <p className="text-sm font-semibold text-indigo-400">{appliance.dailyKWh} kWh/day</p>
        <p className="text-xs text-green-500 font-medium">PKR {appliance.dailyCost}/day</p>
      </div>

      <button
        onClick={() => handleDeleteAppliance(appliance.id)}
        className="ml-4 p-2 bg-red-600/10 text-red-400 rounded-full hover:bg-red-600/20 transition duration-150"
        title="Remove Appliance"
      >
        <TrashIcon className="w-5 h-5" />
      </button>
    </div>
  </div>
);

const ModeButton = ({ label, isSelected, onClick }) => {
  const baseClasses = "w-full sm:w-[250px] font-medium rounded-lg text-base px-6 py-3 text-center transition duration-300 shadow-lg";
  
  // Contained (Selected) style
  const selectedClasses = "text-white bg-gradient-to-br from-indigo-600 to-purple-500 hover:from-indigo-700 hover:to-purple-600 focus:ring-4 focus:ring-indigo-300";
  
  // Outlined (Unselected) style
  const unselectedClasses = "text-indigo-400 bg-gray-700/50 border-2 border-indigo-400 hover:bg-gray-700 focus:ring-4 focus:ring-indigo-300 dark:bg-gray-800 dark:hover:bg-gray-700";

  return (
    <button
      onClick={onClick}
      type="button" 
      className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}
    >
      {label}
    </button>
  );
};

// Common Input Styling function for dark mode adaptation
const getIndigoInputClasses = (isDarkMode) => 
  `w-full p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ${
    isDarkMode
    ? 'bg-gray-900/30 text-white border-indigo-700 placeholder-indigo-500'
    : 'bg-white text-indigo-700 border-indigo-300 placeholder-indigo-400'
  }`;


// --- View Components ---

const TaxConfiguration = ({ daysInMonth, setDaysInMonth, pricePerKWh, setPricePerKWh, fixedCharge, setFixedCharge, variableTaxPerKWh, setVariableTaxPerKWh, isDarkMode }) => (
  <div className={`mb-8 p-6 rounded-xl shadow-lg transition duration-300 ${
    isDarkMode 
    ? 'bg-gray-800 border border-indigo-700' 
    : 'bg-white border border-indigo-200'
  }`}>
    <h3 className={`text-xl font-bold mb-4 flex items-center space-x-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
      <SettingsIcon className="w-6 h-6 text-indigo-500" />
      <span>Bill Rate Configuration (PKR)</span>
    </h3>
    
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      
      {/* Energy Rate */}
      <div className='col-span-2 md:col-span-1'>
        <label htmlFor="pricePerKWh" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Energy Rate (PKR/kWh)
        </label>
        <input
          id="pricePerKWh"
          type="number"
          placeholder="49.33"
          value={pricePerKWh}
          onChange={(e) => setPricePerKWh(e.target.value)}
          min="0"
          step="0.01"
          className={`${getIndigoInputClasses(isDarkMode)} p-2 text-center`}
        />
        <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>The cost of electricity itself.</p>
      </div>
      
      {/* Variable Tax */}
      <div className='col-span-2 md:col-span-1'>
        <label htmlFor="variableTaxPerKWh" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Tax/Surcharge (PKR/kWh)
        </label>
        <input
          id="variableTaxPerKWh"
          type="number"
          placeholder="e.g., 0.50"
          value={variableTaxPerKWh}
          onChange={(e) => setVariableTaxPerKWh(e.target.value)}
          min="0"
          step="0.01"
          className={`${getIndigoInputClasses(isDarkMode)} p-2 text-center`}
        />
        <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Taxes that change with units used.</p>
      </div>

      {/* Fixed Charges */}
      <div className='col-span-2 md:col-span-1'>
        <label htmlFor="fixedCharge" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Fixed Charge (PKR/Bill)
        </label>
        <input
          id="fixedCharge"
          type="number"
          placeholder="e.g., 22.44"
          value={fixedCharge}
          onChange={(e) => setFixedCharge(e.target.value)}
          min="0"
          step="0.01"
          className={`${getIndigoInputClasses(isDarkMode)} p-2 text-center`}
        />
        <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Charges applied regardless of use.</p>
      </div>

      {/* Days in Month */}
      <div className='col-span-2 md:col-span-1'>
        <label htmlFor="daysInMonth" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Calculation Days (Days)
        </label>
        <input
          id="daysInMonth"
          type="number"
          placeholder="30"
          value={daysInMonth}
          onChange={(e) => setDaysInMonth(e.target.value)}
          min="1"
          step="1"
          className={`${getIndigoInputClasses(isDarkMode)} p-2 text-center`}
        />
        <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Billing period length.</p>
      </div>
    </div>
  </div>
);

const MultiApplianceView = ({ 
  appliances, calculatedAppliances, totalConsumption, handleAddAppliance, handleDeleteAppliance, 
  newName, setNewName, newWatts, setNewWatts, newHours, setNewHours, isDarkMode
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    
    {/* Column 1 & 2: Appliance List and Add Form */}
    <div className="lg:col-span-2">
            {/* Add New Appliance Form */}
      <h3 className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Add New Appliance</h3>
      <form onSubmit={handleAddAppliance} className={`p-4 rounded-xl shadow-md space-y-3 ${isDarkMode ? 'bg-gray-900/50' : 'bg-indigo-50'}`}>
        <input
          type="text"
          placeholder="Appliance Name (e.g., Gaming PC, Fridge)"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className={getIndigoInputClasses(isDarkMode)}
          required
        />
        <div className="flex space-x-3">
          <input
            type="number"
            placeholder="Wattage (W)"
            value={newWatts}
            onChange={(e) => setNewWatts(e.target.value)}
            min="1"
            step="1"
            className={getIndigoInputClasses(isDarkMode)}
            required
          />
          <input
            type="number"
            placeholder="Daily Usage (Hours)"
            value={newHours}
            onChange={(e) => setNewHours(e.target.value)}
            min="0"
            step="0.1"
            className={getIndigoInputClasses(isDarkMode)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold shadow-md hover:bg-indigo-700 transition duration-150 flex items-center justify-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Appliance</span>
        </button>
      </form>
      
      <h2 className={`text-xl font-bold mb-4 flex justify-between items-center ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
        Your Appliances ({appliances.length})
      </h2>
      
      {/* List of Appliances - Now showing calculated individual metrics */}
      <div className={`h-72 overflow-y-auto pr-2 mb-6 border p-2 rounded-xl ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50'}`}>
        {calculatedAppliances.length === 0 ? (
          <div className={`text-center py-12 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            No appliances added yet. Use the form below!
          </div>
        ) : (
          calculatedAppliances.map(appliance => (
            <ApplianceRow 
              key={appliance.id} 
              appliance={appliance} 
              handleDeleteAppliance={handleDeleteAppliance} 
              isDarkMode={isDarkMode}
            />
          ))
        )}
      </div>

  
    </div>
    
    {/* Column 3: Summary Results */}
    <div className="lg:col-span-1">
      <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
        Total Estimated Consumption
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <ResultCard title="Daily Units" value={totalConsumption.dailyKWh} unit="kWh" icon={<ZapIcon />} isDarkMode={isDarkMode} />
        <ResultCard title="Daily Cost (Energy)" value={totalConsumption.dailyEnergyCost} unit="PKR" icon={<DollarSignIcon />} isDarkMode={isDarkMode} />
        <ResultCard title={`Total Units (${totalConsumption.days}D)`} value={totalConsumption.totalKWh} unit="kWh" icon={<ZapIcon />} isDarkMode={isDarkMode} />
        <ResultCard title={`ESTIMATED BILL TOTAL (${totalConsumption.days}D)`} value={totalConsumption.totalBillCost} unit="PKR" icon={<DollarSignIcon />} isDarkMode={isDarkMode} />
      </div>
       <div className={`mt-4 p-3 rounded-xl text-sm transition duration-300 ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
        <p className='font-semibold'>Bill Breakdown:</p>
        <p>Energy Cost: PKR {totalConsumption.monthlyEnergyCost}</p>
        <p>Variable Tax: PKR {totalConsumption.monthlyVariableTax}</p>
        <p>Fixed Charge: PKR {totalConsumption.fixedChargeCost}</p>
        <p className='font-bold mt-1 text-lg text-indigo-400'>Total Bill: PKR {totalConsumption.totalBillCost}</p>
      </div>
    </div>
  </div>
);

const SingleApplianceView = ({ newName, setNewName, newWatts, setNewWatts, newHours, setNewHours, totalConsumption, isDarkMode }) => {
  const isValid = parseFloat(newWatts) > 0 && parseFloat(newHours) >= 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Column 1 & 2: Input Form */}
      <div className={`lg:col-span-2 p-4 rounded-xl shadow-md space-y-4 transition duration-300 ${isDarkMode ? 'bg-gray-900/50' : 'bg-indigo-50'}`}>
        <h3 className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Single Appliance Details</h3>

        <input
          type="text"
          placeholder="Appliance Name (Optional)"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className={getIndigoInputClasses(isDarkMode)}
        />
        <div className="flex space-x-3">
          <input
            type="number"
            placeholder="Wattage (W)"
            value={newWatts}
            onChange={(e) => setNewWatts(e.target.value)}
            min="1"
            step="1"
            className={getIndigoInputClasses(isDarkMode)}
            required
          />
          <input
            type="number"
            placeholder="Daily Usage (Hours)"
            value={newHours}
            onChange={(e) => setNewHours(e.target.value)}
            min="0"
            step="0.1"
            className={getIndigoInputClasses(isDarkMode)}
            required
          />
        </div>
      </div>
      
      {/* Column 3: Summary Results */}
      <div className="lg:col-span-1">
        <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Estimated Consumption
        </h2>
        
        {isValid ? (
          <div className="grid grid-cols-2 gap-4">
            <ResultCard title="Daily Units" value={totalConsumption.dailyKWh} unit="kWh" icon={<ZapIcon />} isDarkMode={isDarkMode} />
            <ResultCard title="Daily Cost (Energy)" value={totalConsumption.dailyEnergyCost} unit="PKR" icon={<DollarSignIcon />} isDarkMode={isDarkMode} />
            <ResultCard title={`Total Units (${totalConsumption.days}D)`} value={totalConsumption.totalKWh} unit="kWh" icon={<ZapIcon />} isDarkMode={isDarkMode} />
            <ResultCard title={`ESTIMATED BILL TOTAL (${totalConsumption.days}D)`} value={totalConsumption.totalBillCost} unit="PKR" icon={<DollarSignIcon />} isDarkMode={isDarkMode} />
          </div>
        ) : (
          <div className={`p-4 text-center rounded-xl shadow-lg border transition duration-300 ${isDarkMode ? 'bg-gray-800 text-gray-400 border-gray-700' : 'bg-white text-gray-500'}`}>
            Enter Wattage and Hours to calculate.
          </div>
        )}
        <div className={`mt-4 p-3 rounded-xl text-sm transition duration-300 ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
            <p className='font-semibold'>Bill Breakdown:</p>
            <p>Energy Cost: PKR {totalConsumption.monthlyEnergyCost}</p>
            <p>Variable Tax: PKR {totalConsumption.monthlyVariableTax}</p>
            <p>Fixed Charge: PKR {totalConsumption.fixedChargeCost}</p>
            <p className='font-bold mt-1 text-lg text-indigo-400'>Total Bill: PKR {totalConsumption.totalBillCost}</p>
        </div>
      </div>
    </div>
  );
};


// --- Main Application Component ---
const BothView = () => {
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Mode State: true for Single, false for Multiple
  const [isModeSingle, setIsModeSingle] = useState(false);
  
  // Global states for all inputs (reused for single mode)
  const [appliances, setAppliances] = useState([]);
  
  // Custom Bill/Tax States (Initialized based on user's bill)
  const [pricePerKWh, setPricePerKWh] = useState(49.33); // Based on KE bill's rate
  const [fixedCharge, setFixedCharge] = useState(22.44); // Based on Fixed Charge on KE bill
  const [variableTaxPerKWh, setVariableTaxPerKWh] = useState(0.00); // Placeholder, user can adjust for FPA/GST
  const [daysInMonth, setDaysInMonth] = useState(30); // Default to 30 days
  
  const [newName, setNewName] = useState('');
  const [newWatts, setNewWatts] = useState('');
  const [newHours, setNewHours] = useState('');

  // --- Multi-Appliance CRUD Operations (Local State) ---
  const handleAddAppliance = (e) => {
    e.preventDefault();
    
    const wattsValue = parseFloat(newWatts);
    const hoursValue = parseFloat(newHours);

    if (isNaN(wattsValue) || isNaN(hoursValue) || wattsValue <= 0 || hoursValue < 0) {
      console.error("Please enter valid positive numbers for Watts and non-negative hours.");
      return;
    }

    const newAppliance = {
      id: crypto.randomUUID(), 
      name: newName || `Appliance ${appliances.length + 1}`,
      watts: wattsValue,
      hours: hoursValue,
    };
    
    setAppliances(prev => [...prev, newAppliance]); 
    setNewName('');
    setNewWatts('');
    setNewHours('');
  };

  const handleDeleteAppliance = useCallback((id) => {
    setAppliances(prev => prev.filter(app => app.id !== id));
  }, []);

  // --- Core Calculation Logic (Mode-Aware) ---
  const calculation = useMemo(() => {
    const energyRate = parseFloat(pricePerKWh) || 0;
    const fixedRate = parseFloat(fixedCharge) || 0;
    const variableTaxRate = parseFloat(variableTaxPerKWh) || 0;
    const days = parseInt(daysInMonth) || 30; // Use custom days, default to 30

    // 1. Determine the list of items and calculate individual metrics
    let calculatedItems = [];
    let totalDailyKWh = 0;

    const itemsToProcess = isModeSingle 
        ? ([{ watts: parseFloat(newWatts) || 0, hours: parseFloat(newHours) || 0, id: 'single', name: newName || 'Single Appliance' }])
        : appliances;

    itemsToProcess.forEach(item => {
        const { watts, hours, id, name } = item;
        
        if (watts > 0 && hours >= 0) {
            const dailyKWh = (watts / 1000) * hours;
            totalDailyKWh += dailyKWh;

            // Individual Daily Cost is just energy cost (excluding fixed and taxes for simplicity)
            const dailyEnergyCost = dailyKWh * energyRate;

            calculatedItems.push({
                id: id,
                name: name,
                watts: watts,
                hours: hours,
                dailyKWh: dailyKWh.toFixed(2),
                dailyCost: dailyEnergyCost.toFixed(2), 
            });
        }
    });

    // 2. Total Summary Calculation (Monthly/Period based)
    const totalKWh = totalDailyKWh * days;
    
    // Energy cost for the period
    const monthlyEnergyCost = totalKWh * energyRate;
    
    // Variable tax/surcharge for the period
    const monthlyVariableTax = totalKWh * variableTaxRate;

    // Total Cost (Energy + Variable Tax + Fixed Charge)
    const totalBillCost = monthlyEnergyCost + monthlyVariableTax + fixedRate;


    return {
      total: {
        dailyKWh: totalDailyKWh.toFixed(2),
        dailyEnergyCost: (totalDailyKWh * energyRate).toFixed(2), // Energy only
        totalKWh: totalKWh.toFixed(2),
        monthlyEnergyCost: monthlyEnergyCost.toFixed(2),
        monthlyVariableTax: monthlyVariableTax.toFixed(2),
        fixedChargeCost: fixedRate.toFixed(2),
        totalBillCost: totalBillCost.toFixed(2), // The final, all-inclusive bill
        days: days, // Pass days used for display
      },
      individualItems: calculatedItems,
    };
  }, [appliances, pricePerKWh, fixedCharge, variableTaxPerKWh, isModeSingle, newWatts, newHours, daysInMonth, newName]); 
  
  // Destructure for cleaner access in rendering
  const { total: totalConsumption, individualItems: calculatedAppliances } = calculation;
  
  // --- Rendering ---
  return (
    <div className={`min-h-screen p-4 sm:p-8 font-inter transition-colors duration-500 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`w-full max-w-5xl mx-auto p-6 sm:p-10 rounded-2xl shadow-2xl transition-colors duration-500 ${
        isDarkMode 
        ? 'bg-gray-800 shadow-indigo-900/50' 
        : 'bg-white'
      }`}>
        
        <header className="mb-8 relative">
          {/* Theme Toggle Button */}
          <button
            onClick={() => setIsDarkMode(prev => !prev)}
            className={`absolute top-0 right-0 p-3 rounded-full transition duration-300 ${
              isDarkMode 
              ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' 
              : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
            }`}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
          </button>
          
          <div className="text-center pt-2">
            <h1 className={`text-3xl sm:text-4xl font-extrabold leading-tight transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Home Energy Cost Calculator (PKR)
            </h1>
            <p className={`mt-2 text-md transition-colors duration-500 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Estimate your monthly bill by including Energy Rate, Taxes, and Fixed Charges.
            </p>
          </div>
        </header>

        {/* --- MODE SELECTOR --- */}
        <div className="flex flex-col justify-center items-center gap-4 mb-8">
          <h1 className={`text-xl sm:text-2xl font-bold transition-colors duration-500 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Please select your calculation mode
          </h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <ModeButton 
              label="Single Appliance" 
              isSelected={isModeSingle} 
              onClick={() => setIsModeSingle(true)} 
            />
            <ModeButton 
              label="Multiple Appliances" 
              isSelected={!isModeSingle} 
              onClick={() => setIsModeSingle(false)} 
            />
          </div>
        </div>
        {/* --- END MODE SELECTOR --- */}

        {/* --- BILL CONFIGURATION --- */}
        <TaxConfiguration 
          daysInMonth={daysInMonth} setDaysInMonth={setDaysInMonth}
          pricePerKWh={pricePerKWh} setPricePerKWh={setPricePerKWh}
          fixedCharge={fixedCharge} setFixedCharge={setFixedCharge}
          variableTaxPerKWh={variableTaxPerKWh} setVariableTaxPerKWh={setVariableTaxPerKWh}
          isDarkMode={isDarkMode}
        />
        {/* --- END BILL CONFIGURATION --- */}


        {/* Conditional View Rendering */}
        {isModeSingle ? (
          <SingleApplianceView 
            newName={newName} setNewName={setNewName}
            newWatts={newWatts} setNewWatts={setNewWatts}
            newHours={newHours} setNewHours={setNewHours}
            totalConsumption={totalConsumption}
            isDarkMode={isDarkMode}
          />
        ) : (
          <MultiApplianceView 
            appliances={appliances} 
            calculatedAppliances={calculatedAppliances} // Pass calculated data
            totalConsumption={totalConsumption} 
            handleAddAppliance={handleAddAppliance} 
            handleDeleteAppliance={handleDeleteAppliance} 
            newName={newName} setNewName={setNewName}
            newWatts={newWatts} setNewWatts={setNewWatts}
            newHours={newHours} setNewHours={setNewHours}
            isDarkMode={isDarkMode}
          />
        )}

        <footer className={`mt-12 pt-6 border-t text-center text-sm transition-colors duration-500 ${isDarkMode ? 'text-gray-600 border-t-gray-700' : 'text-gray-400'}`}>
          <p>
            The estimated total bill includes the Energy Rate, Fixed Charge, and Tax/Surcharge based on your configuration.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default BothView;