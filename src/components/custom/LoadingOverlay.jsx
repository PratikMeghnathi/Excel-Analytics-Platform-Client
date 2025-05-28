import { Spinner1 } from "./loaders";

const LoadingOverlay = () => (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-70">
        <div className="bg-loading-overlay-bg absolute inset-0"></div>
        <Spinner1 className="w-10 h-10 border-3 border-loading-spinner-color" />
    </div>
);

export default LoadingOverlay;