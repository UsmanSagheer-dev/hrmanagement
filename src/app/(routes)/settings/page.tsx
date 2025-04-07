"use client";
import React, { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Header from "../../header/Header";
import ToggleSwitch from "../../components/toggleSwitch/ToggleSwitch";
import Dropdown from "../../components/dropdown/Dropdown";

export interface Employee {
  name: string;
  designation: string;
  type: string;
  checkInTime: string;
  status: "On Time" | "Late";
  image?: string;
}

function Settings() {
  const [twoFactor, setTwoFactor] = useState(true);
  const [mobilePush, setMobilePush] = useState(true);
  const [desktopNotif, setDesktopNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);

  const [theme, setTheme] = useState("Light");
  const [language, setLanguage] = useState("English");

  return (
    <div className="h-screen bg-[#131313] p-[20px]">
      <div className="w-full h-full flex justify-between gap-3">
        <div>
          <Sidebar />
        </div>
        <div className="w-full flex flex-col items-center gap-[30px]">
          <div className="w-full">
            <Header
              title="Settings"
              description="Configure your application settings"
              textColor="#A2A1A8"
            />
          </div>
          <div className="max-h-[86vh] w-full bg-transparent border border-[#A2A1A833] rounded-[10px] p-4 flex flex-col overflow-y-auto">
            <Dropdown
              label="APPEARANCE"
              description="Customize how your theme looks on your device"
              value={theme}
              options={["Light", "Dark"]}
              onChange={setTheme}
            />
            <Dropdown
              label="LANGUAGE"
              description="Select your language"
              value={language}
              options={["English", "Spanish", "French"]}
              onChange={setLanguage}
            />
            <ToggleSwitch
              label="TWO-FACTOR AUTHENTICATION"
              description="Keep your account secure by enabling 2FA via email"
              enabled={twoFactor}
              onToggle={setTwoFactor}
            />
            <ToggleSwitch
              label="MOBILE PUSH NOTIFICATIONS"
              description="Receive push notification"
              enabled={mobilePush}
              onToggle={setMobilePush}
            />
            <ToggleSwitch
              label="DESKTOP NOTIFICATION"
              description="Receive push notification in desktop"
              enabled={desktopNotif}
              onToggle={setDesktopNotif}
            />
            <ToggleSwitch
              label="EMAIL NOTIFICATIONS"
              description="Receive email notification"
              enabled={emailNotif}
              onToggle={setEmailNotif}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
