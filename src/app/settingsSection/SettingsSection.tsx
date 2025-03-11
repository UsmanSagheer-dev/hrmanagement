import React from "react";

interface SettingsSectionProps {
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ children }) => {
  return <div className=" text-white  rounded-lg">{children}</div>;
};

export default SettingsSection;