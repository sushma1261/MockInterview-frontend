import React from "react";

interface FeaturesProps {
  title: string;
  subtitle: string;
  icon: string;
}

const Features: React.FC<FeaturesProps> = ({ title, subtitle, icon }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100">
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{subtitle}</p>
    </div>
  );
};

export default Features;
