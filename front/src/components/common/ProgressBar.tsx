
interface ProgressBarProps {
  progress: number;
  taskNameText: string;
  taskColor: string
}

const ProgressBar = ({ progress, taskNameText, taskColor }: ProgressBarProps) => {
  return (
    <div className="w-full mt-4">
      <p>{taskNameText}</p>
      <div className="bg-gray-200 h-4 rounded-full">
        <div
          className={` h-full rounded-full ${taskColor}`} 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;