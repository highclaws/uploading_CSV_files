import { useAppDispatch, useAppSelector } from "../../app/hooks"
import DownloadLink from "../../components/common/DownloadLink";
import ProgressBar from "../../components/common/ProgressBar";
import { uploadCSV } from "./uploadSlice";

const UploadForm = () => {
  const dispatch = useAppDispatch()
  const uploadProgress = useAppSelector((state) => state.upload.progress);
  const downloadLink = useAppSelector((state) => state.upload.downloadLink);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      dispatch(uploadCSV(file));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-semibold mb-6">CSV File Uploader</h1>
      <div className="flex items-center justify-center w-full">
          <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">XLSX, CSV, XLS</p>
          </div>
              <input accept=".xlsx, .csv, .xls"id="dropzone-file" type="file" className="hidden"   onChange={handleFileChange} />
          </label>
      </div> 
      {uploadProgress > 0 && <ProgressBar taskColor="bg-green-500" taskNameText={uploadProgress ===100 ? "Downloaded" : "Downloading...."} progress={uploadProgress} />}
      {uploadProgress === 100 && <ProgressBar taskColor="bg-blue-500" taskNameText={uploadProgress  === 100  && !downloadLink ? "In Process...." :  "Process Done" } progress={uploadProgress} />}
      {uploadProgress === 100 && downloadLink?.length && <DownloadLink data={downloadLink} fileName={"archive"} />}
    </div>
  );
};

export default UploadForm;
