// src/components/AdBannerGroup.jsx
const AdBannerGroup = () => {
  return (
    <div className="bg-gray-100 px-6 py-6 mb-10">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-yellow-100 h-40 rounded-xl shadow-lg shadow-gray-400/50" />
        <div className="bg-pink-100 h-40 rounded-xl shadow-lg shadow-gray-400/50" />
        <div className="bg-purple-100 h-40 rounded-xl shadow-lg shadow-gray-400/50" />
      </div>
    </div>
  );
};

export default AdBannerGroup;
