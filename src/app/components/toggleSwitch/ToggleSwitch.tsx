import React from "react";

interface ToggleSwitchProps {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  description,
  enabled,
  onToggle,
}) => {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-700">
      <div>
        <h3 className="text-white font-semibold text-[16px]">{label}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
      <div
        className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
          enabled ? "bg-green-500" : "bg-gray-600"
        }`}
        onClick={() => onToggle(!enabled)}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
            enabled ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </div>
    </div>
  );
};

export default ToggleSwitch;
