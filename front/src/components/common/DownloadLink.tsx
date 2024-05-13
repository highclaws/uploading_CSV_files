import { Buffer } from "buffer";

interface DownloadLinkProps {
  data: Buffer;
  fileName: string;
}

const DownloadLink = ({ data, fileName }: DownloadLinkProps) => {

  const handleDownload = () => {
    const uint8Array = new Uint8Array(data);  
    const blob = new Blob([uint8Array], { type: 'application/zip' });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="pt-4">
      <button className="py-2 px-4 bg-blue-500 text-white rounded" onClick={handleDownload}>
        Download Archive
      </button>
    </div>
  );
};

export default DownloadLink;
